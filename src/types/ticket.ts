export interface Ticket {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  agentId?: string | null;
  createdAt: string;
}