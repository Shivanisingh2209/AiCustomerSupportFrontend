import { useEffect, useState } from "react";
import { getTickets } from "../../services/ticketService";
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
        const data = await getTickets();

        console.log("Tickets from backend:", data);
        console.log("Number of tickets:", data.length);

        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets:", error);
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
        <div className="rounded-lg bg-red-100 p-5 text-red-700">
          {error}
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
              Tickets
            </h1>

            <p className="mt-1 text-gray-500">
              Customer support tickets
            </p>
          </div>

          <button
            onClick={() => navigate("/tickets/create")}
            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
          >
            + Create Ticket
          </button>

        </div>

        {/* Debug */}
        <div className="mb-6 rounded-lg bg-yellow-100 p-4">
          <p className="font-semibold">
            Total tickets: {tickets.length}
          </p>
        </div>

        {/* Tickets Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>

                <th className="p-4 text-left">
                  Subject
                </th>

                <th className="p-4 text-left">
                  Customer
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
                    {ticket.customerName || "Unknown"}
                  </td>

                  <td className="p-4">
                    {ticket.priority || "-"}
                  </td>

                  <td className="p-4">
                    {ticket.status || "-"}
                  </td>

                  <td className="p-4">
                    {ticket.agentId || "Unassigned"}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Tickets;