import { useEffect, useState } from "react";
import { getMyTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";
import { useNavigate } from "react-router-dom";

const Tickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getMyTickets();

        console.log("My tickets from backend:", data);
        console.log("Number of my tickets:", data.length);

        setTickets(data);
      } catch (error) {
        console.error("Failed to load my tickets:", error);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          Loading tickets...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-lg bg-red-100 p-5 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              My Tickets
            </h1>

            <p className="mt-1 text-gray-500">
              View and manage your support tickets
            </p>
          </div>

          <button
            onClick={() => navigate("/tickets/create")}
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
          >
            + Create Ticket
          </button>
        </div>

        {/* Total */}
        <div className="mb-6 rounded-lg bg-yellow-100 p-4">
          <p className="font-semibold">
            Total tickets: {tickets.length}
          </p>
        </div>

        {/* Empty State */}
        {tickets.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No tickets found
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't created any support tickets yet.
            </p>

            <button
              onClick={() => navigate("/tickets/create")}
              className="mt-5 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
            >
              Create Your First Ticket
            </button>
          </div>
        ) : (
          /* Tickets Table */
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">
                    Subject
                  </th>

                  <th className="p-4 text-left">
                    Priority
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Agent
                  </th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer border-t hover:bg-gray-50"
                    onClick={() =>
                      navigate(`/tickets/${ticket.id}`)
                    }
                  >
                    <td className="p-4 font-medium">
                      {ticket.subject || "No subject"}
                    </td>

                    <td className="p-4">
                      {ticket.priority || "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          ticket.status === "OPEN"
                            ? "bg-blue-100 text-blue-700"
                            : ticket.status === "IN_PROGRESS"
                            ? "bg-yellow-100 text-yellow-700"
                            : ticket.status === "RESOLVED"
                            ? "bg-green-100 text-green-700"
                            : ticket.status === "CLOSED"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ticket.status || "-"}
                      </span>
                    </td>

                    <td className="p-4">
                      {ticket.agentId || "Unassigned"}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;