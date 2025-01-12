import axios from "axios";

const axiosInstance = axios.create({
  timeout: 30000, // 타임아웃을 10초로 설정
});

export async function s3Uploader(file) {
  try {
    console.log(file);
    const base64File = await toBase64(file);
    const lambdaUrl =
      "https://whsqeb2rffzyuibvp7epoikl6i0vgokk.lambda-url.us-east-1.on.aws/";
    const payload = {
      file_name: file.name,
      file_content: base64File.split(",")[1], // Base64 인코딩 데이터
      contentType: file.type,
    };
    const response = await axiosInstance.post(lambdaUrl, payload);
    console.log("Lambda response:", JSON.stringify(response));
    return response;
  } catch (error) {
    console.error("Error uploading image to Lambda:", error);
    throw error;
  }
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
