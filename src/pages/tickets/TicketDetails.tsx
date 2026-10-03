import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import type { Ticket } from "../../types/ticket";

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      if (!id) {
        setError("Ticket ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get<Ticket>(`/tickets/${id}`);

        console.log("Ticket details:", response.data);

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

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">
          Loading ticket...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg bg-red-100 p-4 text-red-700">
            {error}
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

  if (!ticket) {
    return (
      <div className="p-8">
        <p>Ticket not found.</p>
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
              View customer support ticket
            </p>
          </div>

          <button
            onClick={() => navigate("/tickets")}
            className="rounded-lg border bg-white px-5 py-3 font-medium hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>

        {/* Ticket */}
        <div className="rounded-xl bg-white p-8 shadow">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {ticket.subject}
            </h2>

            <p className="mt-2 text-gray-500">
              Ticket ID: {ticket.id}
            </p>
          </div>

          {/* Status / Priority */}
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
                Agent
              </p>

              <p className="mt-1 font-semibold">
                {ticket.agentId ?? "Unassigned"}
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
                <span className="font-medium">Name:</span>{" "}
                {ticket.customerName}
              </p>

              <p className="mt-2">
                <span className="font-medium">Email:</span>{" "}
                {ticket.customerEmail}
              </p>

              {ticket.customerId && (
                <p className="mt-2">
                  <span className="font-medium">Customer ID:</span>{" "}
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

          {/* Created At */}
          <div>
            <p className="text-sm text-gray-500">
              Created At
            </p>

            <p className="mt-1">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;