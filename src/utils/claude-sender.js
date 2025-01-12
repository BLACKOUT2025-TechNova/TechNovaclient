import axios from "axios";
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 타임아웃을 10초로 설정
});
export async function requestAssessmentToLambda(prompt_data) {
  try {
    const response = await axiosInstance.post(
      "https://htrm6253q5t2yilrtf4k3go3by0llzxo.lambda-url.us-east-1.on.aws",
      prompt_data
    );
    const photoKey = prompt_data["object-key"];
    console.log("Raw answer: ", response.data);
    const formattedData = formatResponseData(response.data);
    console.log("Formatted answer: ", formattedData);
    const lastLine = getLastLine(response.data);
    await axiosInstance.post(
      "http://ec2-44-208-166-189.compute-1.amazonaws.com:8080/hunt",
      {
        mobilityId: 13,
        phoneNumber: 1066527809,
        parkingPhotoKey: photoKey,
        parkingPhotoUri: `https://blackout-20-bucket.s3.us-east-1.amazonaws.com/${photoKey}`,
        comment: lastLine,
        evaluation: formattedData,
      }
    );
    return formattedData;
    console.log(`평가: ${response.data}`);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

function getLastLine(responseText) {
  // 텍스트를 줄바꿈(\n)으로 나눠 배열로 변환
  const lines = responseText.trim().split("\n");

  // 마지막 줄 반환
  return lines[lines.length - 1].trim();
}

function formatResponseData(responseText) {
  // 텍스트를 두 줄 간격으로 나눔
  const sections = responseText.trim().split("\n\n");

  // 결과 배열
  const result = [];

  // 각 섹션을 처리
  sections.forEach((section) => {
    if (!section.trim()) return;

    // 줄 단위로 나눔
    const lines = section.split("\n").filter((line) => line.trim());

    // 첫 줄에서 카테고리와 점수 추출
    const categoryScore = lines[0];
    let [category, score] = categoryScore.split(": ").map((str) => str.trim());
    if (category === "총점" || category === "전반적 평가") return;
    // 점수를 Int로 변환
    score = parseInt(score, 10);

    // 나머지 세부 내용을 합침
    const detail = lines
      .slice(1)
      .map((line) => line.replace(/^- /, "").trim())
      .join(" ");

    // 결과 배열에 추가
    result.push({
      category,
      score,
      detail,
    });
  });

  return result;
}
