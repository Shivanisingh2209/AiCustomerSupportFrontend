import api from "./api";
import type { Ticket } from "../types/ticket";

export interface TicketPage {
  content: Ticket[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getTickets = async (): Promise<Ticket[]> => {
  const response = await api.get<TicketPage>("/tickets");
  return response.data.content;
};

export const getMyAssignedTickets = async (): Promise<Ticket[]> => {
  const response = await api.get<Ticket[]>(
    "/tickets/agent/my"
  );

  return response.data;
};

export const updateTicketStatus = async (
  ticketId: string,
  status: string
): Promise<Ticket> => {
  const response = await api.patch<Ticket>(
    `/tickets/${ticketId}/status`,
    {
      status,
    }
  );

  return response.data;
};