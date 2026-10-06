import api from "./api";

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: "CUSTOMER" | "AGENT";
  message: string;
  createdAt: string;
}

export interface SendMessageRequest {
  message: string;
}

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