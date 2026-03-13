import axios from "axios";

export const uploadProfile = async (data) => {
  const UPLOAD_URL = "https://clouds.apiservices.my.id/uploads.php";
  try {
    const response = await axios.post(UPLOAD_URL, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        genta: "Genta@456",
      },
    });
    return response;
  } catch (error) {
    handleError(error);
  }
};
