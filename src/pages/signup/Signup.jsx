import React from "react";
import { useNavigate } from "react-router-dom";

// 임시 이미지 / 아이콘 (실제로 교체 필요)
import gcooLogo from "../../assets/logos/main-logo.svg";
import whiteLogo from "../../assets/images/signup/whiteLogo.svg";

export default function Signup() {
  const navigate = useNavigate();

  // 카드 클릭 시 처리
  const handleSelectUser = (type) => {
    alert(`Selected user type: ${type}`);
  };

  // “다음” 버튼 클릭 시
  const handleNext = () => {
    navigate("/"); // 실제 로직
  };

  return (
    <div className="relative w-full min-h-screen h-full bg-white flex flex-col items-center">
      {/* 상단 로고 부분 */}
      <div className="w-full flex flex-row items-center justify-between px-4 py-6">
        <img src={gcooLogo} alt="GCOO Logo" className="h-6" />
        <div></div> {/* 우측 빈공간 */}
      </div>

      {/* 중앙 안내문구 */}
      <div className="mt-10 text-center mb-20">
        <p className="text-t3 text-on-surface mb-2 font-normal leading-6">
          안녕하세요,
          <br />
          어떤 유저로 가입하실지 선택해주세요
        </p>
      </div>

      {/* 카드 2개 (일반 / 헌트) */}
      <div className="mt-10 flex flex-row items-center justify-center gap-8 mb-20">
        {/* (1) 일반 GCOO 유저 카드: 연한 초록색 */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => handleSelectUser("normal")}
            className={`
              w-20 h-20 bg-primary-container rounded-md
              flex items-center justify-center
              hover:scale-105 hover:shadow-md
              transition-transform duration-200 ease-out
              cursor-pointer
            `}
          >
            <img src={whiteLogo} alt="White Logo Icon" className="w-8 h-8" />
          </div>
          <div className="mt-2 text-center">
            <p className="text-b4 text-gray-700">일반</p>
            <p className="text-b4 text-gray-700">GCOO 유저</p>
          </div>
        </div>

        {/* (2) 헌트 GCOO 유저 카드: 진한 초록색, 호버시 subtle */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => handleSelectUser("hunt")}
            className={`
              w-20 h-20 bg-primary rounded-md
              flex items-center justify-center
              hover:scale-105 hover:shadow-md
              transition-transform duration-200 ease-out
              cursor-pointer
            `}
          >
            <img src={whiteLogo} alt="White Logo Icon" className="w-8 h-8" />
          </div>
          <div className="mt-2 text-center">
            <p className="text-b4 text-gray-700">헌트</p>
            <p className="text-b4 text-gray-700">GCOO 유저</p>
          </div>
        </div>
      </div>

      {/* 하단 “다음” 버튼 */}
      <div className="w-full flex justify-center mt-12 mb-12">
        <button
          onClick={handleNext}
          className="bg-primary text-white px-6 py-3 rounded-md text-b3 font-semibold
                     hover:bg-primary-container hover:text-on-primary-container
                     transition duration-200 w-3/4"
        >
          다음
        </button>
      </div>
    </div>
  );
}
