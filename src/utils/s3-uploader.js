export async function s3Uploader() {
  try {
    const base64File = await toBase64(file);
    const lambdaUrl =
      "https://zbpolyuv2x4k5ktustpup7ccly0rroil.lambda-url.us-east-1.on.aws/";
    const payload = {
      fileName: file.name,
      fileContent: base64File.split(",")[1], // Base64 인코딩 데이터
      contentType: file.type,
    };
    const response = await axios.post(lambdaUrl, payload);
    console.log("Lambda response:", response.data);
    return response.data;
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
