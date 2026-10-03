export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: "CUSTOMER" | "AGENT";
  message: string;
  createdAt: string;
}