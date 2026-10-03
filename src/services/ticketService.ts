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