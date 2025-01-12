import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Imgupload.module.css"; // CSS 모듈 import

import backIcon from "../../assets/images/backIcon.svg";

import checkIcon from "../../assets/images/imgupload/check.svg";
import { s3Uploader } from "../../utils/s3-uploader";
import { requestAssessmentToLambda } from "../../utils/claude-sender";

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
      const result_response = await s3Uploader(file);
      if (result_response.status === 200) {
        const image_url = result_response.data.file_url;
        console.log("S3 uploaded image URL:", image_url);
        const urlObj = new URL(image_url);

        // pathname에서 파일명 추출
        const encodedFileName = urlObj.pathname.split("/").pop();

        // URL 디코딩하여 실제 파일명 얻기
        const fileName = decodeURIComponent(encodedFileName);
        const assessment = await requestAssessmentToLambda({
          "object-key": fileName,
          prompt:
            "이 이미지의 공유킥보드 주차 상태를 0-100점으로 엄격하게 평가해주세요. 배점 기준은 다음과 같습니다: 1. 지쿠 서비스 가능 지역 내 위치 여부 (서비스 불가 지역일 시 무조건 0점 처리 및 총점도 0점 처리.) 2. 보행자 안전 요소 (35점) * 보행공간 2m 이상 확보 * 보행자 주통행로 가장자리 위치(벽, 울타리, 화단, 가로수 등과 가까울 경우 가장자리일 가능성 높음) * 출입구/상가 입구 미방해 * 계단/경사로 접근성 * 굴다리/터널/산책로 중앙이 아닌 위치 1. 시설물 이격거리 (20점) * 버스정류장/지하철 10m 초과 * 횡단보도/소화전 5m 초과 * 점자블록 1m 초과 * 교통시설물 시야 미방해 1. 주차 안정성 (15점) * 킥보드 직립 상태 * 지면 평탄도 * 충돌 위험성 1. 정렬 상태 (15점) * 도로 구조물 정렬 * 다른 킥보드들과의 정렬. 총점과 합격/불합격 여부(총점 60점 이상이면 합격)를 답변의 맨 앞에 제시하고, 각 항목의 점수와 구체적인 판단 근거를 제시해주세요. 애매한 경우에는 문제 없는 것으로 처리해주세요. 출력은 다음과 같은 형식으로 내보내줘. 예시\n총점: 75점 \n지쿠 서비스 가능 지역 내 위치 여부: 15점 \n- 도시 환경으로 보이므로 서비스 가능 지역으로 판단\n보행자 안전 요소: 30점 \n- 보행공간 2m 이상 확보: 충분함, 보행자 주통행로 가장자리 위치: 울타리와 나무 근처, 출입구/상가 입구 미방해: 방해 요소 없음, 계단/경사로 접근성: 평평한 보도로 문제없음, 5점 감점: 보행자 통행에 약간의 방해 가능성\n시설물 이격거리: 15점 \n- 버스정류장/지하철, 횡단보도/소화전과의 거리 문제없음, 점자블록과 1m 이상 거리 확보, 5점 감점: 나무와 매우 가까워 약간의 문제 가능성\n주차 안정성: 10점 \n- 킥보드 직립 상태로 주차, 지면 평탄, 5점 감점: 나무와 울타리 사이로 충돌 위험 약간 있음\n정렬 상태: 5점 \n- 도로 구조물과 어느 정도 정렬, 10점 감점: 다른 킥보드와의 정렬 확인 불가, 나무와 울타리 사이 비스듬히 주차되어 완벽하지 않음\n전반적 평가: 안전하게 주차되었으나 보행자 통행 방해 가능성과 정렬 상태 부족으로 일부 감점.",
        });
      }
      console.log("업로드 성공");
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
          <img
            src={preview}
            alt="미리보기"
            className="w-64 h-64 object-cover mb-4 border border-gray-300"
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-white text-gray-400 border border-gray-300 mb-4">
            선택된 이미지가 없습니다.
          </div>
        )}
      </div>
      <div>
        <button
          className="w-full bg-primary text-white py-3 rounded-md flex justify-center items-center"
          onClick={handleUpload}
        >
          이미지 업로드
        </button>
      </div>
      <div>
        <div className={styles.checkpoint}>
          <div>
            <img src={checkIcon} alt="checkIcon" className={styles.checkIcon} />
            <div className={styles.checkPointDiv}>Check Point</div>
          </div>
          <div className={styles.checkpointText}>흔들리지 않았나요?</div>
          <div className={styles.checkpointText}>
            가이드에 맞춰서 촬영해주세요!
          </div>
          <div className={styles.checkpointText}>주변이 잘 보이면 좋아요!</div>
        </div>
      </div>
    </>
  );
};

export default Imgupload;
