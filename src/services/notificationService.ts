import api from "./api";

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  message: string;
  type: string;
  ticketId?: string;
  read: boolean;
  createdAt: string;
}

export const getMyNotifications = async (): Promise<Notification[]> => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found");
  }

  const response = await api.get(
    `/notifications/user/${userId}`
  );

  return response.data;
};

export const getMyUnreadNotifications = async (): Promise<
  Notification[]
> => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    throw new Error("User ID not found");
  }

  const response = await api.get(
    `/notifications/user/${userId}/unread`
  );

  return response.data;
};