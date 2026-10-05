import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import type { Ticket } from "../../types/ticket";
import type { Agent } from "../../types/agent";
import { getAgents } from "../../services/agentService";
import { assignTicketToAgent, updateTicketStatus } from "../../services/ticketService";
import type { TicketMessage } from "../../types/ticketMessage";
import { getTicketMessages } from "../../services/ticketMessageService";

const AdminTicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [selectedAgent, setSelectedAgent] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const [ticketResponse, agentsData, messagesData] =
        await Promise.all([
          api.get<Ticket>(`/tickets/${id}`),
          getAgents(),
          getTicketMessages(id),
        ]);

        setTicket(ticketResponse.data);
        setAgents(agentsData);
        setMessages(messagesData);
        setMessagesLoading(false);

        if (ticketResponse.data.agentId) {
          setSelectedAgent(ticketResponse.data.agentId);
        }
      } catch (error) {
        console.error("Failed to load ticket details:", error);
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
        setMessagesLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAssignAgent = async () => {
    if (!id || !selectedAgent) {
      setError("Please select an agent.");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const updatedTicket = await assignTicketToAgent(
        id,
        selectedAgent
      );

      setTicket(updatedTicket);
      setSuccess("Ticket assigned successfully.");
    } catch (error) {
      console.error("Failed to assign agent:", error);
      setError("Failed to assign ticket to agent.");
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (
    newStatus: string
  ) => {
    if (!id) return;
  
    try {
      setUpdatingStatus(true);
      setError("");
      setSuccess("");
  
      const updatedTicket = await updateTicketStatus(
        id,
        newStatus
      );
  
      setTicket(updatedTicket);
      setSuccess("Ticket status updated successfully.");
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      setError("Failed to update ticket status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">
          Loading ticket details...
        </h1>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="border-b bg-white shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
            <div>
              <h1 className="text-2xl font-bold text-purple-700">
                AI Customer Support
              </h1>
              <p className="text-sm text-gray-500">
                Admin Panel
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-8">
          <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow">
            <p className="text-red-600">{error}</p>

            <button
              onClick={() => navigate("/admin/tickets")}
              className="mt-4 rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
            >
              Back to All Tickets
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  const assignedAgent = agents.find(
    (agent) => agent.id === ticket.agentId
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-left"
            >
              <h1 className="text-2xl font-bold text-purple-700">
                AI Customer Support
              </h1>

              <p className="text-sm text-gray-500">
                Admin Panel
              </p>
            </button>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-700">
                {localStorage.getItem("userEmail")}
              </p>

              <p className="text-xs text-gray-500">
                Admin
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/tickets")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              All Tickets
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-8">

        <div className="mx-auto max-w-4xl">

          <button
            onClick={() => navigate("/admin/tickets")}
            className="mb-6 text-sm font-medium text-purple-600 hover:text-purple-800"
          >
            ← Back to All Tickets
          </button>

          <div className="mb-6">
            <h2 className="text-3xl font-bold">
              Ticket Details
            </h2>

            <p className="mt-1 text-gray-500">
              Review and manage this customer support ticket
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
              {success}
            </div>
          )}

          {/* Ticket Information */}
          <div className="rounded-xl bg-white p-6 shadow">

            <div className="flex flex-col gap-6">

              <div>
                <p className="text-sm text-gray-500">
                  Subject
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  {ticket.subject || "No subject"}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">
                    Customer Name
                  </p>

                  <p className="mt-1 font-medium">
                    {ticket.customerName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Customer Email
                  </p>

                  <p className="mt-1 font-medium">
                    {ticket.customerEmail || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <select
                    value={ticket.status || ""}
                    onChange={(e) =>
                      handleStatusChange(e.target.value)
                    }
                    disabled={updatingStatus}
                    className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-purple-600 disabled:opacity-50"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Priority
                  </p>

                  <span className="mt-1 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
                    {ticket.priority || "-"}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Created At
                  </p>

                  <p className="mt-1 font-medium">
                    {ticket.createdAt
                      ? new Date(ticket.createdAt).toLocaleString()
                      : "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Ticket ID
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-gray-700">
                    {ticket.id}
                  </p>
                </div>

              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-500">
                  Description
                </p>

                <div className="mt-2 rounded-lg bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-gray-700">
                    {ticket.description || "No description provided."}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Agent Assignment */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow">

            <h3 className="text-xl font-semibold">
              Agent Assignment
            </h3>

            <div className="mt-4">

              {assignedAgent && (
                <div className="mb-4 rounded-lg bg-green-50 p-4">
                  <p className="text-sm text-gray-500">
                    Currently Assigned
                  </p>

                  <p className="mt-1 font-semibold text-green-700">
                    {assignedAgent.name}
                  </p>

                  <p className="text-sm text-gray-600">
                    {assignedAgent.email}
                  </p>
                </div>
              )}

              {!assignedAgent && (
                <p className="mb-4 text-sm text-gray-500">
                  No agent is currently assigned.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">

                <select
                  value={selectedAgent}
                  onChange={(e) =>
                    setSelectedAgent(e.target.value)
                  }
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-600"
                >
                  <option value="">
                    Select Agent
                  </option>

                  {agents.map((agent) => (
                    <option
                      key={agent.id}
                      value={agent.id}
                    >
                      {agent.name} ({agent.status})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssignAgent}
                  disabled={assigning || !selectedAgent}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {assigning
                    ? "Assigning..."
                    : "Assign Agent"}
                </button>

              </div>

            </div>
          </div>

          {/* Conversation */}
          <div className="mt-6 rounded-xl bg-white p-6 shadow">
          
            <h3 className="text-xl font-semibold">
              Conversation
            </h3>
          
            {messagesLoading ? (
              <p className="mt-4 text-sm text-gray-500">
                Loading conversation...
              </p>
            ) : messages.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No messages yet.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
          
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg p-4 ${
                      message.senderRole === "AGENT"
                        ? "ml-8 bg-purple-50"
                        : "mr-8 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {message.senderRole === "AGENT"
                          ? "Agent"
                          : "Customer"}
                      </p>
          
                      <p className="text-xs text-gray-500">
                        {message.createdAt
                          ? new Date(
                              message.createdAt
                            ).toLocaleString()
                          : ""}
                      </p>
                    </div>
          
                    <p className="mt-2 whitespace-pre-wrap text-gray-700">
                      {message.message}
                    </p>
                  </div>
                ))}
          
              </div>
            )}
          
          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminTicketDetails;