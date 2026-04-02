import { apiPPID } from "../AxiosInstance";

export const getLogHistory = async (page, limit) => {
  try {
    const response = await apiPPID.get(`/logs/all?page=${page}&limit=${limit}`); // Ambil data dari properti data
    return response.data;
  } catch (error) {
    throw error;
  }
};
