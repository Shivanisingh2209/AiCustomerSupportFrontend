import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import type { Ticket } from "../../types/ticket";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
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
          <div className="rounded-xl bg-red-100 p-6 text-red-700">
            {error || "Ticket not found."}
          </div>

          <button
            onClick={() => navigate("/tickets")}
            className="mt-5 rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-900"
          >
            ← Back to My Tickets
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/tickets")}
          className="mb-6 text-sm font-semibold text-purple-600 hover:text-purple-800"
        >
          ← Back to My Tickets
        </button>

        {/* Header */}
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

          {/* Description */}
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-900">
                Issue Description
              </h2>

              <p className="mt-4 whitespace-pre-wrap leading-7 text-gray-600">
                {ticket.description || "No description provided."}
              </p>

            </div>
          </div>

          {/* Ticket Information */}
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
                      ? new Date(ticket.createdAt).toLocaleString()
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

            {ticket.status !== "CLOSED" && (
              <button
                onClick={handleCloseTicket}
                disabled={closing}
                className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {closing ? "Closing..." : "Close Ticket"}
              </button>
            )}

            {ticket.status === "CLOSED" && (
              <div className="rounded-lg bg-gray-100 px-5 py-3 font-semibold text-gray-600">
                ✓ This ticket is closed
              </div>
            )}

            <button
              onClick={() => navigate("/tickets")}
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