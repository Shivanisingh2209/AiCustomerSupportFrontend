import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyAssignedTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";

const AgentTickets = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyAssignedTickets();

        console.log("Agent assigned tickets:", data);

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

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.toLowerCase().trim();
  
    const matchesSearch =
      !searchText ||
      ticket.subject.toLowerCase().includes(searchText) ||
      ticket.customerName.toLowerCase().includes(searchText) ||
      ticket.customerEmail.toLowerCase().includes(searchText);
  
    const matchesStatus =
      statusFilter === "ALL" ||
      ticket.status === statusFilter;
  
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">
          Loading assigned tickets...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold">
              My Assigned Tickets
            </h1>

            <p className="mt-1 text-gray-500">
              Tickets assigned to you
            </p>
          </div>

          <button
            onClick={() => navigate("/agent/dashboard")}
            className="rounded-lg border bg-white px-5 py-3 font-medium hover:bg-gray-50"
          >
            ← Dashboard
          </button>

        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        
            <div>
              <p className="text-sm text-gray-500">
                Total Assigned Tickets
              </p>
        
              <p className="mt-1 text-3xl font-bold">
                {tickets.length}
              </p>
            </div>
        
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Search Tickets
              </label>
        
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject, customer or email..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>
        
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
        
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
        
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No tickets are currently assigned to you.
            </p>
          </div>
        ) : (

          <div className="overflow-x-auto rounded-xl bg-white shadow">

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
                    Created
                  </th>

                  <th className="p-4 text-left">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4 font-medium">
                      {ticket.subject || "No subject"}
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {ticket.customerName || "Unknown"}
                        </p>
                    
                        <p className="text-sm text-gray-500">
                          {ticket.customerEmail || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          ticket.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : ticket.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {ticket.priority || "-"}
                      </span>
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
                            ? "bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ticket.status || "-"}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
                          navigate(`/tickets/${ticket.id}`)
                        }
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                      >
                        View Details
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