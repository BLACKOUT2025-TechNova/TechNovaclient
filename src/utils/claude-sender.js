import axios from "axios";

export async function requestAssessmentToLambda(prompt_data) {
  try {
    const response = await axios.post(
      "https://htrm6253q5t2yilrtf4k3go3by0llzxo.lambda-url.us-east-1.on.aws",
      prompt_data
    );
    const formattedData = formatResponseData(response.data);
    const lastLine = getLastLine(response.data);
    await axios.post(
      "http://ec2-44-208-166-189.compute-1.amazonaws.com:8080/hunt",
      {
        "object-key": prompt_data["object-key"],
        comment: lastLine,
        scores: formattedData,
      }
    );
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
    const lines = section.split("\n");
    const categoryScore = lines[0];

    // 총점 항목과 마지막 문장은 제외
    if (
      categoryScore.includes("총점") ||
      categoryScore.includes("이 킥보드는")
    ) {
      return;
    }

    // 카테고리와 점수 분리
    let category = "";
    let score = 0;

    if (categoryScore.includes(": ")) {
      [category, score] = categoryScore.split(": ").map((str) => str.trim());
    }

    // 카테고리에서 번호 제거
    category = category.replace(/^\d+\.\s*/, "");

    // score에서 `/` 왼쪽 값만 추출하고 정수로 변환
    if (score.includes("/")) {
      score = parseInt(score.split("/")[0], 10);
    }

    // 상세 내용 합치기
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
