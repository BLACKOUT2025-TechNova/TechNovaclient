import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import backIcon from "../../assets/images/backIcon.svg";
import checkIcon from "../../assets/images/imgupload/check.svg";
import uploadImg from "../../assets/images/imgupload/uploadImg.svg";
import checkMarkSound from "../../assets/sounds/checkMarkSound.mp3";

export default function Imgupload() {
  const location = useLocation();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkListIndex, setCheckListIndex] = useState(0);
  const [finalCheck, setFinalCheck] = useState(false);

  const [fadeOut, setFadeOut] = useState(false); // 최종 체크 화면 페이드아웃 관리

  const file = location?.state?.file || null;
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(checkMarkSound);
  }, []);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      simulateServerRequest(); // 가짜 서버 요청
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLoading(false);
    }
  }, [file]);

  const simulateServerRequest = async () => {
    // 로딩 화면 보일 때 살짝 진동
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    await new Promise((res) => setTimeout(res, 3000));
    setLoading(false);
  };

  // 로딩 끝나면 CheckPoint 3개 문구 순차 등장
  useEffect(() => {
    if (!loading) {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setCheckListIndex(i);
        if (i === 3) {
          clearInterval(timer);
          // 3개 문구 등장 후 2초 뒤 최종 체크
          setTimeout(() => {
            triggerFinalCheck();
          }, 2000);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, [loading]);

  // 최종 체크 화면 표시
  const triggerFinalCheck = () => {
    setFinalCheck(true);
    // 진동(3번)
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    // 사운드
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.warn("Audio play error:", err));
    }

    // 체크 화면 1초 유지 후 페이드 아웃
    setTimeout(() => {
      setFadeOut(true); // 페이드 아웃 시작
    }, 1000);
  };

  // 페이드 아웃이 끝나면 /resultpage 로 이동
  useEffect(() => {
    if (fadeOut) {
      // 페이드 아웃 지속 시간 0.5초 가정
      const timer = setTimeout(() => {
        navigate("/resultpage");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, navigate]);

  // 뒤로가기
  const handleNext = () => {
    navigate(-1);
  };

  // 사진 다시 올리기
  const handleReUpload = () => {
    navigate("/authhunter");
  };

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* 상단 뒤로가기 아이콘 */}
      <div className="flex items-center ml-4 mt-4 mb-6 cursor-pointer w-6 h-6" onClick={handleNext}>
        <img src={backIcon} alt="backIcon" className="w-6 h-6" />
      </div>

      {/* 이미지 미리보기 */}
      <div
        className="mx-auto bg-[#f0f0f0] rounded-lg overflow-hidden flex items-center justify-center"
        style={{ width: "21.375rem", height: "28.41669rem" }}
      >
        {preview ? (
          <img src={preview} alt="미리보기" className="w-full h-full object-contain" />
        ) : (
          <div className="text-center text-gray-500">선택된 이미지가 없습니다.</div>
        )}
      </div>

      {/* 체크포인트 카드 */}
      <div
        className="mx-auto mt-4 bg-secondary-container text-on-secondary-container rounded-lg"
        style={{ width: "21.375rem", minHeight: "12.25rem", padding: "1.4375rem 1.75rem" }}
      >
        <div className="flex items-center">
          <img src={checkIcon} alt="checkIcon" className="w-6 h-6 mr-2" />
          <div className="text-t2 font-semibold">Check Point</div>
        </div>
        {/* 3개 문구 - 순차적으로 표시 */}
        <div className="mt-3 flex flex-col gap-2">
          <div
            className={`${
              checkListIndex >= 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
            } transition-all duration-500`}
          >
            <div className="bg-white text-gray-700 text-b4 rounded-md px-4 py-2">흔들리지 않았나요?</div>
          </div>
          <div
            className={`${
              checkListIndex >= 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
            } transition-all duration-500 delay-100`}
          >
            <div className="bg-white text-gray-700 text-b4 rounded-md px-4 py-2">가이드에 맞춰서 촬영해주세요!</div>
          </div>
          <div
            className={`${
              checkListIndex >= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
            } transition-all duration-500 delay-200`}
          >
            <div className="bg-white text-gray-700 text-b4 rounded-md px-4 py-2">주변이 잘 보이면 좋아요!</div>
          </div>
        </div>
      </div>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-2xl p-6 w-80 text-center shadow-md animate-[fadeIn_0.3s_ease-forwards]">
            <img src={uploadImg} alt="uploading" className="mx-auto w-16 h-16 mb-4 animate-spin-slow" />
            <h2 className="text-t3 font-semibold text-on-surface mb-2">
              사진을 토대로
              <br />
              적합도를 열심히 계산하고 있어요
            </h2>
            <p className="text-b4 text-gray-500 mb-4 leading-5">
              다음 화면으로 넘어가기 전까지 <br />이 화면을 끄지 말아주세요
            </p>
            <button
              className="w-full py-3 bg-white border border-gray-300 rounded-md text-b4 text-gray-700 hover:bg-gray-100 transition"
              onClick={handleReUpload}
            >
              사진 다시 올리기
            </button>
          </div>
        </div>
      )}

      {/* 최종 체크 표시 (적합도 계산 완료) */}
      {finalCheck && (
        <div
          className={`fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50
            ${fadeOut ? "animate-[fadeOut_0.5s_ease-forwards]" : "animate-[fadeIn_0.2s_ease_forwards]"}`}
        >
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-2 
              ${fadeOut ? "animate-[popOut_0.4s_ease_forwards]" : "animate-[popIn_0.4s_ease_forwards]"}`}
            >
              <span className="text-white text-4xl">✔</span>
            </div>
            <div
              className={`text-white text-t3 font-semibold 
              ${fadeOut ? "animate-[fadeOut_0.4s_ease_forwards]" : "animate-[fadeIn_0.6s_ease_forwards]"}`}
            >
              적합도 계산 완료
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
