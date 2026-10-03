import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import {
  getTicketMessages,
  sendTicketMessage,
  updateTicketMessage,
  deleteTicketMessage,
} from "../../services/ticketMessageService";

import type { Ticket } from "../../types/ticket";
import type { TicketMessage } from "../../types/ticketMessage";

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);

  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      if (!id) {
        setError("Ticket ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<Ticket>(`/tickets/${id}`);

        setTicket(response.data);
      } catch (error) {
        console.error("Failed to load ticket:", error);
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!id) {
        return;
      }

      try {
        setMessagesLoading(true);
        setMessageError("");

        const data = await getTicketMessages(id);

        console.log(
  "FULL MESSAGE RESPONSE:",
  JSON.stringify(data, null, 2)
);

        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
        setMessageError("Failed to load conversation.");
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [id]);

  const handleEditMessage = async (
  messageId: string
) => {
  if (!id || !editingText.trim()) {
    return;
  }

  try {
    const updatedMessage = await updateTicketMessage(
      id,
      messageId,
      editingText.trim()
    );

    setMessages((previousMessages) =>
      previousMessages.map((item) =>
        item.id === messageId
          ? updatedMessage
          : item
      )
    );

    setEditingMessageId(null);
    setEditingText("");

  } catch (error) {
    console.error("Failed to edit message:", error);
    setSendError("Failed to edit message.");
  }
};

const handleDeleteMessage = async (
  messageId: string
) => {
  if (!id) {
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this message?"
  );

  if (!confirmed) {
    return;
  }

  try {
    setSendError("");

    console.log("Deleting message:", messageId);
    console.log("Ticket ID:", id);

    await deleteTicketMessage(id, messageId);

    console.log("Message deleted successfully");

    setMessages((previousMessages) =>
      previousMessages.filter(
        (item) => item.id !== messageId
      )
    );

  } catch (error: any) {
    console.error(
      "DELETE MESSAGE ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    setSendError(
      `Failed to delete message. Status: ${
        error?.response?.status || "Unknown"
      }`
    );
  }
};

  const handleSendMessage = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!id || !message.trim()) {
      return;
    }

    try {
      setSending(true);
      setSendError("");
    
      const newMessage = await sendTicketMessage(
        id,
        message.trim()
      );
    
      console.log("Message sent:", newMessage);
    
      setMessages((previousMessages) => [
        ...previousMessages,
        newMessage,
      ]);
    
      setMessage("");
    
      const ticketResponse = await api.get<Ticket>(
        `/tickets/${id}`
      );
    
      setTicket(ticketResponse.data);
    } catch (error) {
      console.error("Failed to send message:", error);
      setSendError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">
          Loading ticket...
        </h1>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg bg-red-100 p-4 text-red-700">
            {error || "Ticket not found."}
          </div>

          <button
            onClick={() => navigate("/tickets")}
            className="mt-4 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Ticket Details
            </h1>

            <p className="mt-1 text-gray-500">
              Customer support ticket
            </p>
          </div>

          <button
            onClick={() => navigate("/agent/tickets")}
            className="rounded-lg border bg-white px-5 py-3 font-medium hover:bg-gray-50"
          >
            ← Back to Assigned Tickets
          </button>
        </div>

        {/* Ticket Information */}
        <div className="rounded-xl bg-white p-8 shadow">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {ticket.subject}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Ticket ID: {ticket.id}
            </p>
          </div>

          {/* Status / Priority / Agent */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Status
              </p>

              <p className="mt-1 font-semibold">
                {ticket.status}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Priority
              </p>

              <p className="mt-1 font-semibold">
                {ticket.priority}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Assigned Agent
              </p>

              <p className="mt-1 font-semibold">
                {ticket.agentId ? "Assigned to you" : "Unassigned"}
              </p>
            </div>

          </div>

          {/* Customer */}
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-semibold">
              Customer Information
            </h3>

            <div className="rounded-lg bg-gray-50 p-5">

              <p>
                <span className="font-medium">
                  Name:
                </span>{" "}
                {ticket.customerName}
              </p>

              <p className="mt-2">
                <span className="font-medium">
                  Email:
                </span>{" "}
                {ticket.customerEmail}
              </p>

              {ticket.customerId && (
                <p className="mt-2">
                  <span className="font-medium">
                    Customer ID:
                  </span>{" "}
                  {ticket.customerId}
                </p>
              )}

            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-semibold">
              Description
            </h3>

            <div className="rounded-lg bg-gray-50 p-5 text-gray-700">
              {ticket.description}
            </div>
          </div>

          {/* Conversation */}
          <div className="border-t pt-8">

            <h3 className="mb-5 text-xl font-semibold">
              Conversation
            </h3>

            {messageError && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                {messageError}
              </div>
            )}

            {sendError && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                {sendError}
              </div>
            )}

            {messagesLoading ? (
              <div className="rounded-lg bg-gray-50 p-5 text-gray-500">
                Loading conversation...
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-lg bg-gray-50 p-5 text-center text-gray-500">
                No messages yet.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((item) => {
                  const isAgentMessage =
                    item.senderRole === "AGENT";
                
                  const isEditing =
                    editingMessageId === item.id;
                
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border bg-gray-50 p-5"
                    >
                
                      {/* Message Header */}
                      <div className="mb-2 flex items-center justify-between">
                
                        <span className="font-semibold">
                          {item.senderRole === "AGENT"
                            ? "Agent"
                            : "Customer"}
                        </span>
                
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                
                      </div>
                
                      {/* Message */}
                      {isEditing ? (
                        <div>
                
                          <textarea
                            value={editingText}
                            onChange={(e) =>
                              setEditingText(e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
                          />
                
                          <div className="mt-3 flex gap-2">
                
                            <button
                              onClick={() =>
                                handleEditMessage(item.id)
                              }
                              disabled={!editingText.trim()}
                              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                              Save
                            </button>
                
                            <button
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditingText("");
                              }}
                              className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                
                          </div>
                
                        </div>
                      ) : (
                        <p className="text-gray-700">
                          {item.message}
                        </p>
                      )}
                
                      {/* Agent Actions */}
                      {isAgentMessage && !isEditing && (
                        <div className="mt-4 flex gap-2">
                
                          <button
                            onClick={() => {
                              setEditingMessageId(item.id);
                              setEditingText(item.message);
                              setSendError("");
                            }}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
                          >
                            Edit
                          </button>
                
                          <button
                            onClick={() =>
                              handleDeleteMessage(item.id)
                            }
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                
                        </div>
                      )}
                
                    </div>
                  );
                })}
              </div>
            )}

            {/* Reply */}
            <form onSubmit={handleSendMessage} className="mt-6">

              <label className="mb-2 block font-medium">
                Reply to Customer
              </label>
            
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your reply to the customer..."
                rows={4}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
              />
            
              {sendError && (
                <div className="mt-3 rounded-lg bg-red-100 p-3 text-sm text-red-700">
                  {sendError}
                </div>
              )}
            
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Reply"}
                </button>
              </div>
            
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;