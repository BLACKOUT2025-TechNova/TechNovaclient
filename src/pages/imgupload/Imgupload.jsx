// Imgupload.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 이미지, 사운드 등 리소스
import backIcon from "../../assets/images/backIcon.svg";
import checkIcon from "../../assets/images/imgupload/check.svg";
import uploadImg from "../../assets/images/imgupload/uploadImg.svg";
import checkMarkSound from "../../assets/sounds/checkMarkSound.mp3";

// 예시: S3 업로더/백엔드 요청 함수 (실제 프로젝트 로직에 맞게 구현)
import { s3Uploader } from "../../utils/s3-uploader";
import { requestAssessmentToLambda } from "../../utils/claude-sender";

export default function Imgupload() {
  const location = useLocation();
  const navigate = useNavigate();

  // 선택된 파일(이미지)
  const file = location?.state?.file || null;

  // 미리보기, 로딩, 애니메이션 관련 state
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkListIndex, setCheckListIndex] = useState(0);
  const [finalCheck, setFinalCheck] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // ★ totalScore를 저장하여 Resultpage에 넘기기
  const [totalScore, setTotalScore] = useState(null);

  // 사운드 재생용 ref
  const audioRef = useRef(null);

  // 사운드 로딩
  useEffect(() => {
    audioRef.current = new Audio(checkMarkSound);
  }, []);

  // 파일이 있다면 미리보기 URL 생성
  // (가짜 서버 요청 등 필요 시)
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 문구 순차 등장 등 필요 시
      simulateInitialAnimation();
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setLoading(false);
    }
  }, [file]);

  // 체크포인트 문구 3개를 순차적으로 표시하는 예시
  const simulateInitialAnimation = () => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setCheckListIndex(i);
      if (i === 3) {
        clearInterval(timer);
      }
    }, 300);
  };

  // 실제 업로드 + 평가 로직
  // 완료 후 totalScore 계산
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1) S3 업로드
      const result_response = await s3Uploader(file);
      if (result_response.status === 200) {
        const image_url = result_response.data.file_url;
        console.log("S3 uploaded image URL:", image_url);

        // 예: AWS Lambda에 이미지 평가 요청
        const urlObj = new URL(image_url);
        const encodedFileName = urlObj.pathname.split("/").pop();
        const fileName = decodeURIComponent(encodedFileName);

        const assessment = await requestAssessmentToLambda({
          "object-key": fileName,
          prompt:
            "이 이미지의 공유킥보드 주차 상태를 0-100점으로 엄격하게 평가해주세요. 배점 기준은 다음과 같습니다: 1. 지쿠 서비스 가능 지역 내 위치 여부 (서비스 불가 지역일 시 무조건 0점 처리 및 총점도 0점 처리.) 2. 보행자 안전 요소 (35점) * 보행공간 2m 이상 확보 * 보행자 주통행로 가장자리 위치(벽, 울타리, 화단, 가로수 등과 가까울 경우 가장자리일 가능성 높음) * 출입구/상가 입구 미방해 * 계단/경사로 접근성 * 굴다리/터널/산책로 중앙이 아닌 위치 1. 시설물 이격거리 (20점) * 버스정류장/지하철 10m 초과 * 횡단보도/소화전 5m 초과 * 점자블록 1m 초과 * 교통시설물 시야 미방해 1. 주차 안정성 (15점) * 킥보드 직립 상태 * 지면 평탄도 * 충돌 위험성 1. 정렬 상태 (15점) * 도로 구조물 정렬 * 다른 킥보드들과의 정렬. 총점과 합격/불합격 여부(총점 60점 이상이면 합격)를 답변의 맨 앞에 제시하고, 각 항목의 점수와 구체적인 판단 근거를 제시해주세요. 애매한 경우에는 문제 없는 것으로 처리해주세요. 출력은 다음과 같은 형식으로 내보내줘. 예시\n총점: 75점 \n지쿠 서비스 가능 지역 내 위치 여부: 15점 \n- 도시 환경으로 보이므로 서비스 가능 지역으로 판단\n보행자 안전 요소: 30점 \n- 보행공간 2m 이상 확보: 충분함, 보행자 주통행로 가장자리 위치: 울타리와 나무 근처, 출입구/상가 입구 미방해: 방해 요소 없음, 계단/경사로 접근성: 평평한 보도로 문제없음, 5점 감점: 보행자 통행에 약간의 방해 가능성\n시설물 이격거리: 15점 \n- 버스정류장/지하철, 횡단보도/소화전과의 거리 문제없음, 점자블록과 1m 이상 거리 확보, 5점 감점: 나무와 매우 가까워 약간의 문제 가능성\n주차 안정성: 10점 \n- 킥보드 직립 상태로 주차, 지면 평탄, 5점 감점: 나무와 울타리 사이로 충돌 위험 약간 있음\n정렬 상태: 5점 \n- 도로 구조물과 어느 정도 정렬, 10점 감점: 다른 킥보드와의 정렬 확인 불가, 나무와 울타리 사이 비스듬히 주차되어 완벽하지 않음\n전반적 평가: 안전하게 주차되었으나 보행자 통행 방해 가능성과 정렬 상태 부족으로 일부 감점.",
        });

        // 2) totalScore 산출
        let newTotalScore = 0;
        assessment.forEach((item) => {
          newTotalScore += item.score;
        });
        console.log("new total score", newTotalScore);

        // totalScore를 state에 저장
        setTotalScore(newTotalScore);

        // 적합도 계산 완료 애니메이션
        triggerFinalCheck();
      } else {
        alert("업로드 실패");
      }
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 최종 체크 표시 (토스처럼)
  // 일정 시간 후 fadeOut, 그리고 navigate
  const triggerFinalCheck = () => {
    setFinalCheck(true);

    // 진동
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50]);
    }
    // 사운드
    if (audioRef.current) {
      audioRef.current.play().catch((err) => console.warn("Audio play error:", err));
    }

    // 1초 뒤 fadeOut
    setTimeout(() => {
      setFadeOut(true);
    }, 1000);
  };

  // fadeOut이 끝나면 Resultpage로 이동 + totalScore 넘김
  useEffect(() => {
    if (fadeOut) {
      const timer = setTimeout(() => {
        // navigate + state
        navigate("/resultpage", { state: { totalScore } });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fadeOut, navigate, totalScore]);

  // 뒤로가기
  const handleNext = () => {
    navigate(-1);
  };

  // 다시 업로드
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

      {/* Check Point 카드 (문구 3개) */}
      <div
        className="mx-auto mt-4 bg-secondary-container text-on-secondary-container rounded-lg"
        style={{
          width: "21.375rem",
          minHeight: "12.25rem",
          padding: "1.4375rem 1.75rem",
        }}
      >
        <div className="flex items-center">
          <img src={checkIcon} alt="checkIcon" className="w-6 h-6 mr-2" />
          <div className="text-t2 font-semibold">Check Point</div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {/* 문구1 */}
          <div
            className={`${
              checkListIndex >= 1 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
            } transition-all duration-300`}
          >
            <div className="bg-white text-gray-700 text-b4 rounded-md px-4 py-2">흔들리지 않았나요?</div>
          </div>
          {/* 문구2 */}
          <div
            className={`${
              checkListIndex >= 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
            } transition-all duration-300 delay-100`}
          >
            <div className="bg-white text-gray-700 text-b4 rounded-md px-4 py-2">가이드에 맞춰서 촬영해주세요!</div>
          </div>
          {/* 문구3 */}
          <div
            className={`${
              checkListIndex >= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
            } transition-all duration-300 delay-200`}
          >
            <div className="bg-white text-gray-700 text-b4 rounded-md px-4 py-2">주변이 잘 보이면 좋아요!</div>
          </div>
        </div>
      </div>

      {/* 업로드 버튼 */}
      <div className="mt-4 px-4">
        <button
          className="w-full bg-primary text-white py-3 rounded-md text-center text-b3 font-semibold"
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
