import api from "./api";
import type { TicketMessage } from "../types/ticketMessage";

export const getTicketMessages = async (
  ticketId: string
): Promise<TicketMessage[]> => {
  const response = await api.get<TicketMessage[]>(
    `/tickets/${ticketId}/messages`
  );

  return response.data;
};

export const sendTicketMessage = async (
  ticketId: string,
  message: string
): Promise<TicketMessage> => {
  const response = await api.post<TicketMessage>(
    `/tickets/${ticketId}/messages`,
    {
      message,
    }
  );

  return response.data;
};

export const updateTicketMessage = async (
  ticketId: string,
  messageId: string,
  message: string
): Promise<TicketMessage> => {
  const response = await api.put<TicketMessage>(
    `/tickets/${ticketId}/messages/${messageId}`,
    {
      message,
    }
  );

  return response.data;
};

export const deleteTicketMessage = async (
  ticketId: string,
  messageId: string
): Promise<void> => {
  await api.delete(
    `/tickets/${ticketId}/messages/${messageId}`
  );
};