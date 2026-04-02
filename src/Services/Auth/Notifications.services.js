import { apiPPID } from "../AxiosInstance";

export const getAccountNotif = async () => {
  try {
    const response = await apiPPID.get(`/notifications/account-notifications`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAccountNotif = async (data) => {
  try {
    const response = await apiPPID.put(
      `/notifications/update/account-notifications/${data.id}`,
      data,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
