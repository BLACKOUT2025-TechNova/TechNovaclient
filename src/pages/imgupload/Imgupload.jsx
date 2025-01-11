import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Imgupload.module.css"; // CSS 모듈 import

import backIcon from "../../assets/images/backIcon.svg";

import checkIcon from "../../assets/images/imgupload/check.svg";

const Imgupload = () => {
  const location = useLocation();
  const [preview, setPreview] = useState(null);

  const file = location?.state?.file || null;

  useEffect(() => {
    if (file) {
      // 미리보기 이미지 URL 생성
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 정리(clean up)
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  // 서버로 업로드하는 함수 (fetch/Axios 등 활용)
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("https://example.com/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("이미지 업로드 성공!");
      } else {
        alert("이미지 업로드 실패!");
      }
    } catch (err) {
      console.error(err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div>
        <img src={backIcon} alt="backIcon" className={styles.backIcon} />
      </div>
      <div>
        {/* 미리보기 */}
        {preview ? (
          <img src={preview} alt="미리보기" className="w-64 h-64 object-cover mb-4 border border-gray-300" />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-white text-gray-400 border border-gray-300 mb-4">
            선택된 이미지가 없습니다.
          </div>
        )}
      </div>
      <div>
        <div className={styles.checkpoint}>
          <div>
            <img src={checkIcon} alt="checkIcon" className={styles.checkIcon} />
            <div className={styles.checkPointDiv}>Check Point</div>
          </div>
          <div className={styles.checkpointText}>흔들리지 않았나요?</div>
          <div className={styles.checkpointText}>가이드에 맞춰서 촬영해주세요!</div>
          <div className={styles.checkpointText}>주변이 잘 보이면 좋아요!</div>
        </div>
      </div>
    </>
  );
};

export default Imgupload;
