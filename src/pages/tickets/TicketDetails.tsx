import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  getTicketMessages,
  sendTicketMessage,
} from "../../services/messageService";
import type { TicketMessage } from "../../services/messageService";
import type { Ticket } from "../../types/ticket";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [closing, setClosing] = useState(false);

  /*
   * Load ticket
   */
  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await api.get<Ticket>(`/tickets/${id}`);

        console.log("Ticket details:", response.data);

        setTicket(response.data);
      } catch (error) {
        console.error("Failed to load ticket:", error);
        setError("Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTicket();
    }
  }, [id]);

  /*
   * Load conversation messages
   */
  useEffect(() => {
    const loadMessages = async () => {
      if (!id) return;

      try {
        setMessagesLoading(true);

        const data = await getTicketMessages(id);

        console.log("Ticket messages:", data);

        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [id]);

  /*
   * Send message
   */
  const handleSendMessage = async () => {
    if (!id) return;

    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    try {
      setSending(true);

      const newMessage = await sendTicketMessage(
        id,
        trimmedMessage
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);

      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  /*
   * Send message using Enter
   */
  const handleMessageKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  /*
   * Close ticket
   */
  const handleCloseTicket = async () => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to close this ticket?"
    );

    if (!confirmed) return;

    try {
      setClosing(true);

      const response = await api.patch<Ticket>(
        `/tickets/${id}/close`
      );

      setTicket(response.data);

      alert("Ticket closed successfully.");
    } catch (error) {
      console.error("Failed to close ticket:", error);
      alert("Failed to close ticket.");
    } finally {
      setClosing(false);
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">
          Loading ticket...
        </h1>
      </div>
    );
  }

  /*
   * Error
   */
  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl bg-red-100 p-6 text-red-700">
            {error || "Ticket not found."}
          </div>

          <button
            onClick={() => navigate(backRoute)}
            className="mt-5 rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-900"
          >
            ← Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  /*
   * Status style
   */
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700";

      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-700";

      case "RESOLVED":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /*
   * Priority style
   */
  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /*
   * Current logged-in role
   */
  const role = localStorage.getItem("role");

  const backRoute =
    role === "AGENT"
      ? "/agent/dashboard"
      : "/tickets";
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <button
          onClick={() => navigate(backRoute)}
          className="mb-6 text-sm font-semibold text-purple-600 hover:text-purple-800"
        >
          ← Back to My Tickets
        </button>

        {/* Ticket Header */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

            <div>
              <p className="text-sm text-gray-400">
                Ticket ID
              </p>

              <p className="mt-1 text-sm font-medium text-gray-600">
                {ticket.id}
              </p>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {ticket.subject || "No subject"}
              </h1>
            </div>

            <div className="flex gap-2">
              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                  ticket.status
                )}`}
              >
                {ticket.status || "UNKNOWN"}
              </span>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${getPriorityStyle(
                  ticket.priority
                )}`}
              >
                {ticket.priority || "N/A"}
              </span>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* LEFT SIDE */}
          <div className="md:col-span-2">

            {/* Description */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Issue Description
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                {ticket.description || "No description provided."}
              </p>

            </div>

            {/* Conversation */}
            <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">

              {/* Header */}
              <div className="border-b border-gray-200 p-6">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Conversation
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Communicate with the support team
                    </p>
                  </div>

                  <div className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {messages.length}{" "}
                    {messages.length === 1
                      ? "Message"
                      : "Messages"}
                  </div>

                </div>

              </div>

              {/* Messages */}
              <div className="max-h-125 min-h-62.5 overflow-y-auto p-6">

                {messagesLoading ? (
                  <div className="flex min-h-50 items-center justify-center">
                    <p className="text-gray-500">
                      Loading conversation...
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex min-h-50 flex-col items-center justify-center text-center">

                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                      💬
                    </div>

                    <p className="font-semibold text-gray-700">
                      No messages yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Start the conversation below.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-5">

                    {messages.map((message) => {

                      const isMine =
                        (role === "AGENT" &&
                          message.senderRole === "AGENT") ||
                        (role === "USER" &&
                          message.senderRole === "CUSTOMER");

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`max-w-[80%] ${
                              isMine
                                ? "items-end"
                                : "items-start"
                            } flex flex-col`}
                          >

                            {/* Sender */}
                            <p className="mb-1 px-1 text-xs font-semibold text-gray-500">
                              {message.senderRole === "AGENT"
                                ? "Support Agent"
                                : "You"}
                            </p>

                            {/* Bubble */}
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                isMine
                                  ? "rounded-br-md bg-purple-600 text-white"
                                  : "rounded-bl-md bg-gray-100 text-gray-800"
                              }`}
                            >
                              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                                {message.message}
                              </p>
                            </div>

                            {/* Time */}
                            <p className="mt-1 px-1 text-[11px] text-gray-400">
                              {message.createdAt
                                ? new Date(
                                    message.createdAt
                                  ).toLocaleString()
                                : ""}
                            </p>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

              {/* Message Input */}
              {ticket.status !== "CLOSED" ? (
                <div className="border-t border-gray-200 p-5">

                  <div className="flex gap-3">

                    <textarea
                      value={messageText}
                      onChange={(event) =>
                        setMessageText(event.target.value)
                      }
                      onKeyDown={handleMessageKeyDown}
                      placeholder="Type your message..."
                      rows={2}
                      disabled={sending}
                      className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
                    />

                    <button
                      onClick={handleSendMessage}
                      disabled={
                        sending ||
                        !messageText.trim()
                      }
                      className="self-end rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {sending ? "Sending..." : "Send"}
                    </button>

                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Press Enter to send · Shift + Enter for a new line
                  </p>

                </div>
              ) : (
                <div className="border-t border-gray-200 bg-gray-50 p-5 text-center">

                  <p className="font-semibold text-gray-600">
                    This ticket is closed.
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    You cannot send new messages to a closed ticket.
                  </p>

                </div>
              )}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Ticket Information
              </h2>

              <div className="mt-5 space-y-5">

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Customer
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {ticket.customerName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 break-all font-medium text-gray-800">
                    {ticket.customerEmail || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Assigned Agent
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {ticket.agentId || "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Priority
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {ticket.priority || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Status
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {ticket.status || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Created At
                  </p>

                  <p className="mt-1 font-medium text-gray-800">
                    {ticket.createdAt
                      ? new Date(
                          ticket.createdAt
                        ).toLocaleString()
                      : "-"}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-900">
            Actions
          </h2>

          <div className="mt-4 flex flex-wrap gap-3">

            {ticket.status !== "CLOSED" && role === "USER" && (
              <button
                onClick={handleCloseTicket}
                disabled={closing}
                className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {closing
                  ? "Closing..."
                  : "Close Ticket"}
              </button>
            )}

            {ticket.status === "CLOSED" && (
              <div className="rounded-lg bg-gray-100 px-5 py-3 font-semibold text-gray-600">
                ✓ This ticket is closed
              </div>
            )}

            <button
              onClick={() => {
                const role = localStorage.getItem("role");
            
                navigate(
                  role === "AGENT"
                    ? "/agent/dashboard"
                    : "/tickets"
                );
              }}
              className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Tickets
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TicketDetails;
