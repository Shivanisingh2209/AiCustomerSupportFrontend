import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyAssignedTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";

const AgentTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getMyAssignedTickets();

        setTickets(data);
      } catch (error) {
        console.error(
          "Failed to load assigned tickets:",
          error
        );

        setError("Failed to load assigned tickets.");
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
          Loading assigned tickets...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mx-auto max-w-6xl">
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            My Assigned Tickets
          </h1>

          <p className="mt-1 text-gray-500">
            Tickets assigned to you
          </p>
        </div>

        {/* Count */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">
            Assigned Tickets
          </p>

          <p className="mt-1 text-3xl font-bold">
            {tickets.length}
          </p>
        </div>

        {/* Empty */}
        {tickets.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No tickets are currently assigned to you.
            </p>
          </div>
        ) : (
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
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-50"
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
                      <button
                        onClick={() =>
                          navigate(`/tickets/${ticket.id}`)
                        }
                        className="rounded-lg bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
                      >
                        View
                      </button>
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

export default AgentTickets;