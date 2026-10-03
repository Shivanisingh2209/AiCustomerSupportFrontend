export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: "CUSTOMER" | "AGENT";
  message: string;
  createdAt: string;
}