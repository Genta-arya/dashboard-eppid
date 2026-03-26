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

export const updateStatus = async (
  id,
  status,
  catatan,
  isNotif,
  id_user,
  username,
) => {
  try {
    const response = await apiPPID.put(`/form/update/status`, {
      id,
      status,
      catatan: catatan || null,
      isNotif,
      id_user,
      username,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteForm = async (id) => {
  try {
    const response = await apiPPID.post(`/form/delete`, {
      id: id,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLog = async (page = 1, limit = 50) => {
  try {
    const response = await apiPPID.get(
      `/form/log/all?page=${page}&limit=${limit}`,
    ); // Ambil data dari properti data
    return response.data;
  } catch (error) {
    throw error;
  }
};
