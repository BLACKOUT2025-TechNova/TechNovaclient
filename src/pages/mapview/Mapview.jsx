// Mapview.jsx
import React, { useEffect, useRef, useState } from "react";
import redBikePng from "../../assets/images/mapview/redBikeIcon.png";
import qrIcon from "../../assets/images/mapview/qrIcon.svg";
import { useNavigate } from "react-router-dom";
const Mapview = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const watchIdRef = useRef(null);
  const navigate = useNavigate(null);

  const handleNavigateNext = () => {
    navigate("/authhunter");
  };

  // 마커 클릭 시 표시할 모달 state
  const [modalOpen, setModalOpen] = useState(false);
  // 선택된 마커 정보(서버 응답 데이터)
  const [selectedMarker, setSelectedMarker] = useState(null);
  // 모든 마커를 저장하기 위한 state
  const [markers, setMarkers] = useState([]);

  // 지도 초기화
  const initializeMap = () => {
    if (!mapRef.current) return;
    const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

    const gMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: 37.495436, lng: 127.029352 },
      zoom: 16,
      mapId,
    });
    setMap(gMap);
  };

  // 폴리곤 표시
  const drawServiceRegions = async (gMap) => {
    try {
      const res = await fetch("/data/service_regions.json");
      const data = await res.json();

      data.service_regions.forEach((region) => {
        region.paths.forEach((path) => {
          const outerCoords = path.outer_coords.map(([lng, lat]) => ({ lat, lng }));
          const polygon = new window.google.maps.Polygon({
            paths: outerCoords,
            strokeColor: "#22c55e",
            fillColor: "#22c55e",
            fillOpacity: 0.15,
            strokeOpacity: 1.0,
            strokeWeight: 2,
          });
          polygon.setMap(gMap);
        });
      });
    } catch (err) {
      console.error("Failed to draw service regions:", err);
    }
  };

  // 마커 표시
  const drawMarkersFromCSV = async (gMap) => {
    try {
      const res = await fetch("/data/filtered_output.csv");
      const csvText = await res.text();

      const lines = csvText.trim().split("\n");
      const dataLines = lines.slice(1);

      const newMarkers = dataLines.map((line) => {
        const [bicycle_id, end_lat, end_lng, modelType] = line.split(",");
        const lat = parseFloat(end_lat);
        const lng = parseFloat(end_lng);

        let marker;
        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          // Advanced Marker 사용
          const markerDiv = document.createElement("div");
          markerDiv.className =
            "w-12 h-12 bg-center bg-no-repeat bg-contain cursor-pointer transition-transform duration-200 pointer-events-auto";
          markerDiv.style.backgroundImage = `url('${redBikePng}')`;

          marker = new window.google.maps.marker.AdvancedMarkerElement({
            map: gMap,
            position: { lat, lng },
            title: `${modelType} - ${bicycle_id}`,
            content: markerDiv,
          });

          // Google Maps 이벤트 리스너 (마커 클릭)
          window.google.maps.event.addListener(marker, "click", async () => {
            // 4~10 중 랜덤 숫자
            const randomMobilityId = Math.floor(Math.random() * 7) + 4;
            try {
              const url = `http://ec2-44-208-166-189.compute-1.amazonaws.com:8080/find?mobilityId=${randomMobilityId}`;
              const response = await fetch(url);
              const data = await response.json();

              // progress도 추가로 저장
              setSelectedMarker({
                mobilityId: randomMobilityId,
                gcooId: data.gcooId,
                score: data.score,
                progress: data.progress, // <-- 추가
                comment: data.comment,
                photoUri: data.photoUri,
                needToBeHunted: data.needToBeHunted,
                type: data.type,
              });
              setModalOpen(true);
            } catch (err) {
              console.error("서버 요청 실패:", err);
            }
          });
        } else {
          // 일반 Marker (fallback)
          marker = new window.google.maps.Marker({
            map: gMap,
            position: { lat, lng },
            title: `${modelType} - ${bicycle_id}`,
            icon: {
              url: redBikePng,
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          // 일반 Marker 클릭
          marker.addListener("click", async () => {
            const randomMobilityId = Math.floor(Math.random() * 7) + 4;
            try {
              const url = `http://ec2-44-208-166-189.compute-1.amazonaws.com:8080/find?mobilityId=${randomMobilityId}`;
              const response = await fetch(url);
              const data = await response.json();
              setSelectedMarker({
                mobilityId: randomMobilityId,
                gcooId: data.gcooId,
                score: data.score,
                progress: data.progress, // <-- 추가
                comment: data.comment,
                photoUri: data.photoUri,
                needToBeHunted: data.needToBeHunted,
                type: data.type,
              });
              setModalOpen(true);
            } catch (err) {
              console.error("서버 요청 실패:", err);
            }
          });
        }

        return marker;
      });

      setMarkers(newMarkers);
    } catch (err) {
      console.error("Failed to draw markers from CSV:", err);
    }
  };

  // 마커 스타일 업데이트 (기존 로직 유지)
  const updateMarkerStyles = () => {
    markers.forEach((marker) => {
      const { gcooId } = selectedMarker || {};

      if (marker instanceof window.google.maps.marker.AdvancedMarkerElement) {
        const markerDiv = marker.content;
        // marker.title 예: "SCOOTER - GCOO-B2"
        if (gcooId && marker.title.includes(gcooId)) {
          markerDiv.classList.add("scale-150");
          markerDiv.classList.remove("opacity-50");
          markerDiv.style.zIndex = 40;
        } else if (gcooId) {
          markerDiv.classList.add("opacity-50");
          markerDiv.classList.remove("scale-150");
          markerDiv.style.zIndex = 10;
        } else {
          markerDiv.classList.remove("scale-150", "opacity-50");
          markerDiv.style.zIndex = 10;
        }
      } else {
        if (gcooId && marker.getTitle().includes(gcooId)) {
          marker.setIcon({
            url: redBikePng,
            scaledSize: new window.google.maps.Size(40, 40), // 확대
          });
          marker.setZIndex(40);
        } else if (gcooId) {
          marker.setIcon({
            url: redBikePng,
            scaledSize: new window.google.maps.Size(32, 32),
            opacity: 0.5,
          });
          marker.setZIndex(10);
        } else {
          marker.setIcon({
            url: redBikePng,
            scaledSize: new window.google.maps.Size(32, 32),
            opacity: 1,
          });
          marker.setZIndex(10);
        }
      }
    });
  };

  // 내 위치 보기
  const handleMoveToMyLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (map) {
          map.panTo({ lat: latitude, lng: longitude });
        }
      },
      (err) => {
        console.error(err);
        alert("위치 정보를 가져올 수 없습니다. (PC에선 HTTPS 필요)");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  // 스크립트 로딩 / 지도 표시
  useEffect(() => {
    if (window.google?.maps) {
      initializeMap();
    } else {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        existingScript.addEventListener("load", initializeMap);
        return () => existingScript.removeEventListener("load", initializeMap);
      }
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initializeMap;
      document.head.appendChild(script);
      return () => {
        script.removeEventListener("load", initializeMap);
      };
    }
  }, []);

  // 지도 객체가 준비되면 폴리곤, 마커 표시
  useEffect(() => {
    if (map) {
      drawServiceRegions(map);
      drawMarkersFromCSV(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // 마커 스타일 업데이트
  useEffect(() => {
    if (markers.length > 0) {
      updateMarkerStyles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarker]);

  // 언마운트 시 geolocation clear
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
    setSelectedMarker(null);
  };

  // [추가] progress bar 표시를 위한 계산 함수
  const renderProgressBar = (progressValue) => {
    // 0~100 범위 제한
    const validValue = Math.min(Math.max(progressValue || 0, 0), 100);
    // 25% 단위로 4칸 중 몇 칸 채울지
    const filledCount = Math.ceil(validValue / 25); // 예: 50% => 2칸, 75% => 3칸
    const totalCount = 4;

    return (
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: totalCount }).map((_, i) => {
          const isFilled = i < filledCount;
          return <div key={i} className={`w-6 h-2 rounded ${isFilled ? "bg-green-500" : "bg-gray-300"}`}></div>;
        })}
        <span className="text-xs text-gray-600 ml-2">{validValue}%</span>
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen">
      {/* 지도 영역 */}
      <div ref={mapRef} className="w-full h-full transition-opacity duration-300" />

      {/* 내 위치 보기 버튼 */}
      <button
        onClick={handleMoveToMyLocation}
        className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded shadow z-40"
      >
        내 위치 보기
      </button>

      {/* 하단 고정 버튼 (QR 스캔) */}
      <div onClick={handleNavigateNext} className="absolute bottom-0 left-0 w-full bg-white py-4 text-center z-40">
        <p className="text-sm text-gray-500 ">헌트 하시려면 기기의 QR을 스캔 해주세요.</p>
        <button className="mt-2 bg-primary text-white w-10/12 py-3 rounded-md mx-auto flex justify-center items-center">
          <img src={qrIcon} alt="QR Icon" className="w-5 h-5 mr-2" />
          기기 QR 스캔하기
        </button>
      </div>

      {/* 모달 */}
      {modalOpen && selectedMarker && (
        <>
          {/* 반투명 배경 (지도를 약간 어둡게) */}
          <div className="absolute inset-0 bg-black bg-opacity-60 z-50" onClick={closeModal}></div>

          {/* 하단 모달 */}
          <div
            className={`absolute w-full bottom-0 left-0 rounded-t-2xl bg-white z-50 transform transition-transform duration-500 ease-out ${
              modalOpen ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.2)" }}
          >
            {/* 모달 상단: 소리로 찾기 버튼 */}
            <div className="flex justify-end p-4">
              <button className="bg-white text-green-600 border border-green-500 px-3 py-1 rounded-full text-sm shadow">
                🔊 소리로 찾기
              </button>
            </div>

            {/* 모달 내용 */}
            <div className="px-6 pb-6">
              <div className="flex gap-4 justify-between">
                {/* 상단: 썸네일, 적합도 점수 등 */}
                <div className="flex items-center mb-3 w-full text-left">
                  <div>
                    {/* gcooId / id 표기 */}
                    <p className="text-base font-semibold">{selectedMarker.gcooId}</p>
                    {/* 적합도 점수 */}
                    <div className="text-st2 text-on-surface-variant">적합도</div>
                    <p className="text-t2 font-bold text-on-surface mb-1">
                      <span className="text-h1 text-on-surface">{selectedMarker.score}</span>점
                    </p>

                    {/* [추가] progress bar (최대 4칸) */}
                    {selectedMarker?.progress !== undefined && renderProgressBar(selectedMarker.progress)}

                    {/* 코멘트(없으면 대체문구) */}
                    <p className="text-xs text-gray-400 mt-1">{selectedMarker.comment || "어딘지 모르겠어요!"}</p>
                  </div>
                </div>

                <div className="w-full h-full">
                  {/* 서버에서 받은 photoUri가 있으면 표시, 없으면 빨간 마커 아이콘 */}
                  {selectedMarker?.photoUri ? (
                    <img
                      src={selectedMarker.photoUri}
                      alt="thumbnail"
                      className="w-full h-full mr-3 object-contain rounded"
                    />
                  ) : (
                    <img src={redBikePng} alt="Scooter Icon" className="w-14 h-14 mr-3" />
                  )}
                </div>
              </div>
              {/* 선 (구분) */}
              <hr className="my-3" />

              {/* 지도 닫기 / 헌트하기 버튼 */}
              <div onClick={handleNavigateNext} className="flex justify-between gap-4">
                <button onClick={closeModal} className="bg-gray-200 text-gray-700 px-4 py-2 rounded w-full">
                  지도 닫기
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded w-full">헌트하기</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Mapview;
