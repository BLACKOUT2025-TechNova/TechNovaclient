// src/pages/qrscanner/QRScanner.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { ArrowLeft, FlashlightIcon } from "lucide-react";

const QRScanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // HTML5 QR 스캐너 초기화
    const html5QrCode = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);

        // 카메라 시작
        html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // QR 코드 스캔 성공
            setIsScanning(true);
            console.log("스캔된 QR 코드:", decodedText);

            // 잠시 후 업로드 페이지로 이동
            setTimeout(() => {
              html5QrCode.stop();
              navigate("/upload", {
                state: { qrData: decodedText },
              });
            }, 1000);
          },
          (error) => {
            // 스캔 중 에러는 무시 (계속 스캔 시도)
          }
        );
      } catch (err) {
        console.error("카메라 권한 에러:", err);
        setHasPermission(false);
      }
    };

    startScanner();

    // 컴포넌트 언마운트 시 정리
    return () => {
      html5QrCode.stop().catch(console.error);
    };
  }, [navigate]);

  // 플래시 라이트 토글
  const toggleFlashlight = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          advanced: [{ torch: !flashlight }],
        },
      });

      const track = stream.getVideoTracks()[0];
      await track.applyConstraints({
        advanced: [{ torch: !flashlight }],
      });

      setFlashlight(!flashlight);
    } catch (err) {
      console.error("플래시 라이트 에러:", err);
    }
  };

  if (!hasPermission) {
    return (
      <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>카메라 권한이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white relative">
      {/* 헤더 */}
      <div className="p-4 flex items-center">
        <button className="p-2 hover:bg-gray-800 rounded-full" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* 안내 텍스트 */}
      <div className="text-center mt-4">
        <h1 className="text-xl font-bold mb-2">킥보드 상단의</h1>
        <p className="text-lg">QR 코드를 찍어주세요</p>
      </div>

      {/* QR 스캐너 영역 */}
      <div className="mx-auto mt-8 relative w-64 h-64">
        <div id="reader" className="w-full h-full overflow-hidden rounded-lg"></div>

        {/* 스캐너 코너 프레임 */}
        <div className={`absolute inset-0 border-2 border-transparent ${isScanning ? "animate-pulse" : ""}`}>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500"></div>
        </div>

        {/* 스캔 라인 애니메이션 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 opacity-50 animate-scan"></div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <button className={`rounded-full p-4 ${flashlight ? "bg-green-500" : "bg-white"}`} onClick={toggleFlashlight}>
          <FlashlightIcon className={`w-6 h-6 ${flashlight ? "text-white" : "text-black"}`} />
        </button>
      </div>

      {/* 하단 텍스트 */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-sm">라이트 {flashlight ? "끄기" : "켜기"}</p>
      </div>
    </div>
  );
};

export default QRScanner;
