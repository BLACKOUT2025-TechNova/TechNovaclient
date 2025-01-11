import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
// 카메라 / 갤러리 아이콘, 이미지
import cameraIcon from "../../assets/images/authhunter/cameraIcon.svg";

const Authhunter = () => {
  const navigate = useNavigate();

  // 숨겨진 input (카메라 촬영)
  const cameraInputRef = useRef(null);
  // 숨겨진 input (앨범 선택)
  const galleryInputRef = useRef(null);

  // 카메라 버튼 클릭
  const handleCameraClick = () => {
    // 숨겨진 input[type=file][capture="environment"] 열기
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // 앨범 버튼 클릭
  const handleGalleryClick = () => {
    // 숨겨진 input[type=file] 열기
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  // 카메라에서 파일 선택 완료
  const handleCameraChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // /Imgupload 라우트로 파일을 전달하면서 이동
      navigate("/Imgupload", { state: { file } });
    }
  };

  // 앨범에서 파일 선택 완료
  const handleGalleryChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // /Imgupload 라우트로 파일을 전달하면서 이동
      navigate("/Imgupload", { state: { file } });
    }
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-screen bg-white px-4">
      {/* 상단 컨텐츠 */}
      <br />
      <div className="mt-8 text-center">
        <p className="text-on-surface text-t1 ">
          헌터하기를 완료하신 후,
          <br />
          인증해주세요
        </p>
        <div className="w-[12rem] mx-auto mt-6 mb-16">
          <img src={cameraIcon} alt="cameraIcon" className="w-full h-full" />
        </div>
      </div>

      {/* 버튼 그룹 - 화면 바닥 */}
      <div className="flex flex-col space-y-4 w-full pb-6">
        {/* 카메라 촬영 버튼 */}
        <button
          onClick={handleCameraClick}
          className="bg-primary text-white py-3 rounded-lg w-full text-t1 font-medium"
        >
          촬영하기
        </button>

        {/* 앨범에서 업로드하기 버튼 */}
        <button
          onClick={handleGalleryClick}
          className="bg-primary-container py-3 rounded-lg w-full text-t1 font-medium"
          style={{ color: "#03BD54" }} // 앨범에서 업로드하기 글자색 #03BD54
        >
          앨범에서 업로드하기
        </button>
      </div>
      <br />

      {/* 숨겨진 input: 카메라 */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        style={{ display: "none" }}
        onChange={handleCameraChange}
      />

      {/* 숨겨진 input: 갤러리 */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        style={{ display: "none" }}
        onChange={handleGalleryChange}
      />
    </div>
  );
};

export default Authhunter;
