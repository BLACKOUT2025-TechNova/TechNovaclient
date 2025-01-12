import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import backIcon from "../../assets/images/backIcon.svg";
import checkIcon from "../../assets/images/imgupload/check.svg";
import uploadImg from "../../assets/images/imgupload/uploadImg.svg";
import checkMarkSound from "../../assets/sounds/checkMarkSound.mp3";
import { s3Uploader } from "../../utils/s3-uploader";
import { requestAssessmentToLambda } from "../../utils/claude-sender";

export default function Imgupload() {
  const location = useLocation();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkListIndex, setCheckListIndex] = useState(0);
  const [finalCheck, setFinalCheck] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

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
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const result_response = await s3Uploader(file);
      if (result_response.status === 200) {
        const image_url = result_response.data.file_url;
        console.log("S3 uploaded image URL:", image_url);
        const urlObj = new URL(image_url);

        const encodedFileName = urlObj.pathname.split("/").pop();
        const fileName = decodeURIComponent(encodedFileName);

        const assessment = await requestAssessmentToLambda({
          "object-key": fileName,
          prompt: "이 이미지의 공유킥보드 주차 상태를 평가해주세요.",
        });
      }
      console.log("업로드 성공");
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    }
    setLoading(false);
  };

  const triggerFinalCheck = () => {
    setFinalCheck(true);
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.warn("Audio play error:", err));
    }
    setTimeout(() => setFadeOut(true), 1000);
  };

  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => navigate("/resultpage"), 500);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, navigate]);

  const handleNext = () => {
    navigate(-1);
  };

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
          <img src={preview} alt="미리보기" className="w-64 h-64 object-cover mb-4 border border-gray-300" />
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

      {/* 업로드 버튼 */}
      <div>
        <button
          className="w-full bg-primary text-white py-3 rounded-md flex justify-center items-center"
          onClick={handleUpload}
        >
          이미지 업로드
        </button>
      </div>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 rounded-2xl p-6 w-80 text-center shadow-md">
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

      {/* 최종 체크 표시 */}
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
