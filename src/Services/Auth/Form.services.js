import { apiPPID } from "../AxiosInstance";

export const getAllForm = async (type, status, date, page = 1) => {
  try {
    // Jika status atau date kosong/null/undefined, otomatis kirim "all"
    const finalStatus = status || "all";
    const finalDate = date || "all";

    const response = await apiPPID.get(
      `/form/all?type=${type}&status=${finalStatus}&date=${finalDate}&page=${page}&limit=2`,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const SearchForm = async (id) => {
  try {
    const response = await apiPPID.get(`/form/cek/status?id=${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  try {
    const response = await apiPPID.put(`/form/update/status`, {
      id,
      status,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteForm = async (id) => {
  try {
    const response = await apiPPID.post(`/form/delete`, {
      id:id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
