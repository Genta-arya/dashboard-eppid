import { apiPPID, baseUrl } from "../AxiosInstance";

export const getAnalytics = async (year) => {
  try {
    const response = await apiPPID.get(`/analytic?year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllInsight = async (year) => {
  try {
    const response = await apiPPID.get(`/insight/status?year=${year}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getNotification = async () => {
  try {
    const response = await apiPPID.get(`/notifications/all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const patchMarkAsRead = async (id) => {
  try {
    const response = await apiPPID.post(`/notifications/mark-as-read/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tandai semua sebagai sudah dibaca
export const patchReadAll = async () => {
  try {
    const response = await apiPPID.post(`/notifications/read-all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hapus semua notifikasi (Bersihkan list)
export const deleteNotificationsAll = async () => {
  try {
    const response = await apiPPID.post(`/notifications/delete-all`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getStreamNotificationUrl = `${baseUrl}/notifications/stream`;
