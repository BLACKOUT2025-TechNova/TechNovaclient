import mainLogo from "../../assets/logos/main-logo.svg";
import bellIcon from "../../assets/images/main/bell.svg";
import menuIcon from "../../assets/images/main/menu.svg";
import questionMarkIcon from "../../assets/images/main/question-mark.svg";
import headsetIcon from "../../assets/images/main/headset.svg";
import profileImg from "../../assets/images/main/profileImg.jpg";
import { useNavigate } from "react-router-dom";
const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;

  return (
    <div style={{ backgroundColor: "#EAEBEE", borderRadius: "4px", height: "8px", width: "70%" }}>
      <div
        style={{
          width: `${percentage}%`,
          backgroundColor: "#28C06F", // primary color
          height: "100%",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );
};
const Main = () => {
  const currentPoints = 17; // 현재 포인트
  const totalPoints = 20; // 총 포인트

  const navigate = useNavigate();

  const handleClickMapview = () => {
    navigate("/mapview");
  };
  return (
    <>
      <div className="bg-gray-50 font-pretendard h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-surface  py-4 px-6 flex justify-between items-center w-full">
          <div className="flex gap-3 w-full">
            <div>
              <img
                src={mainLogo}
                alt="Main  Logo"
                className="w-[4.375rem] h-[1.06719rem] flex-shrink-0 mr-[13.94rem]"
              />
            </div>
            <div className="flex gap-8 items-center absolute top-4 right-6">
              <img src={bellIcon} alt="bellIcon" className="w-6 h-6 cursor-pointer" />
              <img src={menuIcon} alt="menuIcon" className="w-6 h-6 cursor-pointer" />
            </div>
          </div>
        </header>

        {/* Main Card */}
        <main className="p-6 bg-white overflow-hidden">
          <div className="bg-surface-container-lowest shadow-md rounded-lg p-6 mb-6 h-[16.4375rem]">
            <div className="flex justify-between items-center">
              <div className="w-full">
                <div className="flex justify-between items-center">
                  <div className="text-bt3 font-bold text-primary text-left text-on-surface text-btn3">
                    헌터 OO님이
                    <br />
                    지구를 아껴준 시간 🌱
                  </div>
                  <div className="relative right-1">
                    <img src={profileImg} alt="Profile" className="w-14 h-14 bg-gray-200 rounded-full object-cover" />
                  </div>{" "}
                </div>
                <br />
                <div className="w-full text-left">
                  <span className="text-sm text-gray-500 text-on-primary-container underline pr-3">WHITE 등급</span>
                  <span className="text-on-surface-variant text-btn2">(다음등급까지 3회)</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center w-full">
              <div className="flex-grow">
                <ProgressBar current={currentPoints} total={totalPoints} />
              </div>
              <div className="flex-shrink-0 ml-4">
                <span className="text-btn3 text-primary">{currentPoints}</span> /{" "}
                <span className="text-btn2 text-on-secondary-container">{totalPoints} 회</span>
              </div>
            </div>

            <div className="my-4">
              <hr className="border-gray-40 outline-on-surface" />
            </div>
            <div className="mt-4 flex items-center">
              <div className="w-1/2 pt-5 pd-4">
                <span className="t4 mr-3">크레딧</span>
                <span className="text-on-primary-container">0</span>
              </div>
              <div className="w-1/2 pt-5 pd-4">
                <span className="t4 mr-3">쿠폰/패스</span>
                <span className="text-on-primary-container">1 개</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-6">
            <div
              onClick={handleClickMapview}
              className="bg-surface-container shadow-md rounded-lg p-6 text-center cursor-pointer"
            >
              <div className="bg-gray-200 w-full h-24 mb-4"></div>
              <p className="text-gray-700 text-t4 text-on-surface">
                방치된 지쿠 어딨지?
                <br />
                <span className="text-t2">지도로 보기</span>
              </p>
            </div>
            <div className="bg-surface-container shadow-md rounded-lg p-6 text-center">
              <div className="bg-gray-200 w-full h-24 mb-4"></div>
              <p className="text-gray-700 text-t4 text-on-surface">
                방치된 지쿠 찾았다!
                <br />
                <span className="text-t2">QR 스캔하기</span>
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-secondary-container text-on-secondary-container py-4 px-6 mt-6 rounded-md text-left text-btn1 text-on-secondary-container">
            지쿠 헌터 첫 활동 시<br />
            자전거 할인쿠폰 증정!{" "}
          </div>

          {/* Service Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-md flex flex-row justify-between items-center py-4 px-4 text-center text-primary">
              <div className="h-8">
                <img src={questionMarkIcon} alt="questionMarkIcon" className="w-8 h-8" />
              </div>
              <div className="text-btn1 text-on-secondary-container text-right flex-grow">서비스안내</div>
            </div>
            <div className="bg-surface-container-lowest rounded-md flex flex-row justify-between items-center py-4 px-4 text-center text-primary">
              <div className="h-8">
                <img src={headsetIcon} alt="headsetIcon" className="w-8 h-8" />
              </div>
              <div className="text-btn1 text-on-secondary-container text-right flex-grow">고객센터</div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Main;
