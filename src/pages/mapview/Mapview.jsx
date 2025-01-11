import React, { useEffect, useRef, useState } from "react";
// PNG 아이콘
import redBikePng from "../../assets/images/mapview/redBikeIcon.png";
import qrIcon from "../../assets/images/mapview/qrIcon.svg";

const Mapview = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const userMarkerRef = useRef(null);
  const watchIdRef = useRef(null);

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

  // 서비스 지역 폴리곤
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

  // CSV 마커
  const drawMarkersFromCSV = async (gMap) => {
    try {
      const res = await fetch("/data/filtered_output.csv");
      const csvText = await res.text();

      const lines = csvText.trim().split("\n");
      const dataLines = lines.slice(1);

      // drawMarkersFromCSV 내에서 (오류 해결 버전)
      dataLines.forEach((line) => {
        const [bicycle_id, end_lat, end_lng, modelType] = line.split(",");
        const lat = parseFloat(end_lat);
        const lng = parseFloat(end_lng);

        // AdvancedMarkerElement
        if (window.google?.maps?.marker?.AdvancedMarkerElement) {
          // 1) DOM 요소 생성
          const markerDiv = document.createElement("div");
          markerDiv.style.width = "32px";
          markerDiv.style.height = "32px";
          markerDiv.style.background = "url('/src/assets/images/mapview/redBikeIcon.png') no-repeat center center";
          markerDiv.style.backgroundSize = "contain";

          new window.google.maps.marker.AdvancedMarkerElement({
            map: gMap,
            position: { lat, lng },
            title: `${modelType} - ${bicycle_id}`,
            content: markerDiv, // 문자열이 아닌 실제 Node!
          });
        } else {
          // fallback: 일반 Marker
          new window.google.maps.Marker({
            map: gMap,
            position: { lat, lng },
            title: `${modelType} - ${bicycle_id}`,
            icon: "/src/assets/images/mapview/redBikeIcon.png",
          });
        }
      });
    } catch (err) {
      console.error("Failed to draw markers from CSV:", err);
    }
  };

  // 내 위치 보기
  const handleMoveToMyLocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
      return;
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading } = pos.coords;
        if (map) {
          map.panTo({ lat: latitude, lng: longitude });
          updateUserMarker(latitude, longitude, heading);
        }
      },
      (err) => {
        console.error(err);
        alert("위치 정보를 가져올 수 없습니다. (PC에선 HTTPS 필요)");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  // 사용자 위치 마커 생성/업데이트
  const updateUserMarker = (lat, lng, heading) => {
    const deg = heading || 0;
    if (!userMarkerRef.current) {
      // AdvancedMarkerElement 시도
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          title: "내 위치",
          content: `
            <div style="
              width:40px; height:40px; 
              transform: rotate(${deg}deg);
              background: url('${redBikePng}') no-repeat center center; 
              background-size: contain;
            "></div>
          `,
        });
      } else {
        // 일반 Marker
        userMarkerRef.current = new window.google.maps.Marker({
          map,
          position: { lat, lng },
          title: "내 위치",
          icon: {
            url: redBikePng,
            scaledSize: new window.google.maps.Size(40, 40),
          },
        });
      }
    } else {
      // 업데이트
      if (userMarkerRef.current instanceof window.google.maps.marker.AdvancedMarkerElement) {
        userMarkerRef.current.position = { lat, lng };
        userMarkerRef.current.content = `
          <div style="
            width:40px; height:40px; 
            transform: rotate(${deg}deg);
            background: url('${redBikePng}') no-repeat center center; 
            background-size: contain;
          "></div>
        `;
      } else {
        // 일반 marker
        userMarkerRef.current.setPosition({ lat, lng });
      }
    }
  };

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

  useEffect(() => {
    if (map) {
      drawServiceRegions(map);
      drawMarkersFromCSV(map);
    }
  }, [map]);

  // 언마운트 시 watchPosition 해제
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "calc(100vh - 100px)", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* 하단 고정 버튼 */}
      <div className="absolute bottom-0 left-0 w-full bg-white py-6 text-center text-left w-full">
        <p className="text-sm text-gray-500 text-on-secondary-container text-b3">
          헌트 하시려면 기기의 QR을 스캔 해주세요.
        </p>
        <button className="mt-4 bg-primary text-white w-10/12 py-3 rounded-md mx-auto flex justify-center items-center">
          <img src={qrIcon} alt="QR Icon" className="w-5 h-5 mr-2" />
          기기 QR 스캔하기
        </button>
      </div>

      {/* 내 위치 보기 */}
      <button onClick={handleMoveToMyLocation} className="absolute bottom-6 right-6 bg-white px-4 py-2 rounded shadow">
        내 위치 보기
      </button>
    </div>
  );
};

export default Mapview;
