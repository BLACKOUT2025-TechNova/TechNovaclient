import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 임시 아이콘들: 실제 경로로 교체하세요
import backIcon from "../../assets/images/backIcon.svg";
import clapIcon from "../../assets/images/result/clap.svg"; // 박수 아이콘
import coinIcon from "../../assets/images/result/coin.svg"; // 코인 아이콘(보상 모달)

export default function Resultpage() {
  const navigate = useNavigate();

  // 점수 애니메이션용
  const [currentScore, setCurrentScore] = useState(0);
  const [prevScore, setPrevScore] = useState(0);

  // 모달(보상) 표시
  const [rewardModal, setRewardModal] = useState(false);

  // **원형 그래프**를 그릴 때 필요한 strokeDashoffset 계산
  //  - 전체 원둘레(circleLength), 점수(0~100)에 따라 offset 조절
  //  - 여기선 그냥 96 => 96% 등
  const circleLength = 280; // 예: 원형 그래프의 둘레(px)

  // 점수 로딩 후에 애니메이션으로 0 -> 96, 0 -> 48
  useEffect(() => {
    let start = 0;
    let startPrev = 0;
    const targetScore = 96; // 변화된 적합도
    const targetPrev = 48; // 이전 적합도

    const interval = setInterval(() => {
      start += 2;
      startPrev += 1;
      if (start >= targetScore) start = targetScore;
      if (startPrev >= targetPrev) startPrev = targetPrev;

      setCurrentScore(start);
      setPrevScore(startPrev);

      if (start === targetScore && startPrev === targetPrev) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // 뒤로가기
  const handleBack = () => {
    navigate(-1);
  };

  // 확인 버튼 → 보상 모달 띄우기
  const handleConfirm = () => {
    setRewardModal(true);
  };

  // 보상 받기 → 실제 로직 (ex: navigate 또는 api 호출)
  const handleReward = () => {
    alert("보상 받기 로직");
    setRewardModal(false);
  };

  // 모달 닫기
  const closeModal = () => {
    setRewardModal(false);
  };

  // **원형 그래프** strokeDashoffset 계산
  const currentOffset = circleLength * (1 - currentScore / 100);
  const prevOffset = circleLength * (1 - prevScore / 100);

  return (
    <div className="relative w-full min-h-screen bg-white pb-24 overflow-x-hidden">
      {/* 상단 뒤로가기 아이콘 */}
      <div className="flex items-center w-10 h-10 ml-4 mt-4 cursor-pointer" onClick={handleBack}>
        <img src={backIcon} alt="backIcon" className="w-6 h-6" />
      </div>

      {/* 합격 카드 */}
      <div className="fadeIn mx-auto mt-2 w-[21rem] bg-primary-container rounded-lg p-4 text-center flex flex-col items-center">
        <img src={clapIcon} alt="clapIcon" className="w-10 h-10 mb-1" />
        <h2 className="text-t2 text-primary font-bold">합격</h2>
        <p className="text-b3 text-on-surface-variant mt-1">
          OO님의 헌트 덕분에
          <br />
          적합도 점수가 48점 상승하였어요!
        </p>
      </div>

      {/* 점수 카드 */}
      <div className="fadeInUp mx-auto mt-3 w-[21rem] bg-[#f8f9fb] rounded-lg p-4 text-center">
        <h3 className="text-t3 font-semibold text-on-surface">내 점수</h3>
        <p className="text-b4 text-gray-500 mt-1">적절한 위치에 잘 주차하셨어요!</p>

        <div className="mt-4 flex items-center justify-center gap-8">
          {/* 큰 원형 그래프 (currentScore) */}
          <div className="relative w-[120px] h-[120px] flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
              {/* 회색 배경 원 */}
              <circle cx="50" cy="50" r="45" stroke="#d1d3d9" strokeWidth="10" fill="none" />
              {/* 초록색 값 원: dashoffset을 변경하여 그려짐 */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#28C06F"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circleLength}
                strokeDashoffset={currentOffset}
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-t2 font-bold text-on-surface">{currentScore}점</p>
              <p className="text-b4 mt-1 text-gray-600">변화된 적합도</p>
            </div>
          </div>

          {/* 작은 원형 그래프 (prevScore) */}
          <div className="relative w-[70px] h-[70px] flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
              {/* 회색 배경 원 */}
              <circle cx="50" cy="50" r="45" stroke="#eeeeee" strokeWidth="10" fill="none" />
              {/* 회색 값 원 */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#adb2ba"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circleLength}
                strokeDashoffset={prevOffset}
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>
            <div className="absolute text-center">
              <p className="text-sm font-bold text-gray-600">{prevScore}점</p>
              <p className="text-xs mt-1 text-gray-400">이전 적합도</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 w-full bg-white flex justify-around items-center py-4 border-t border-gray-100">
        <button className="bg-gray-100 text-gray-500 w-[45%] py-3 rounded-md text-b3" onClick={handleBack}>
          뒤로가기
        </button>
        <button className="bg-primary text-white w-[45%] py-3 rounded-md text-b3 font-semibold" onClick={handleConfirm}>
          확인
        </button>
      </div>

      {/* 보상 모달 */}
      {rewardModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center animate-[fadeIn_0.3s_ease_forwards]">
          <div className="bg-white rounded-lg w-72 p-4 text-center animate-[popIn_0.4s_ease_forwards]">
            <img src={coinIcon} alt="coin" className="mx-auto w-10 h-10 mb-2" />
            <p className="text-b3 text-gray-700">보상으로 크레딧을 수령하세요!</p>
            <button
              className="bg-primary text-white w-full py-3 rounded-md mt-4 text-b3 font-semibold"
              onClick={handleReward}
            >
              보상 받기
            </button>
            <button className="mt-2 text-sm text-gray-400" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
