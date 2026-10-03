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

export const createTicketMessage = async (
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