import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { assignTicketToAgent, getTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";
import type { Agent } from "../../types/agent";
import { getAgents } from "../../services/agentService";

const AdminTickets = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const statusFromDashboard = searchParams.get("status") || "ALL";

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<
    Record<string, string>
  >({});
  const [assigningTicketId, setAssigningTicketId] = useState<string | null>(
    null
  );
  const [assignmentError, setAssignmentError] = useState("");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusFromDashboard);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTickets();

        console.log("Admin all tickets:", data);

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

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await getAgents();
  
        console.log("Available agents:", data);
  
        setAgents(data);
      } catch (error) {
        console.error("Failed to load agents:", error);
        setAssignmentError("Failed to load agents.");
      }
    };
  
    loadAgents();
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

    const handleAssignAgent = async (ticketId: string) => {
      const agentId = selectedAgents[ticketId];
    
      if (!agentId) {
        setAssignmentError("Please select an agent.");
        return;
      }
    
      try {
        setAssigningTicketId(ticketId);
        setAssignmentError("");
    
        const updatedTicket = await assignTicketToAgent(
          ticketId,
          agentId
        );
    
        setTickets((previousTickets) =>
          previousTickets.map((ticket) =>
            ticket.id === ticketId
              ? updatedTicket
              : ticket
          )
        );
    
        setSelectedAgents((previous) => ({
          ...previous,
          [ticketId]: updatedTicket.agentId ?? agentId,
        }));
    
      } catch (error) {
        console.error("Failed to assign agent:", error);
        setAssignmentError("Failed to assign ticket to agent.");
      } finally {
        setAssigningTicketId(null);
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
          Loading all tickets...
        </h1>
      </div>
    );
  }

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
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Dashboard
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

        <div className="mx-auto max-w-7xl">

          <div className="mb-6">
            <h2 className="text-3xl font-bold">
              All Tickets
            </h2>

            <p className="mt-1 text-gray-500">
              View and manage all customer support tickets
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="mb-6 rounded-xl bg-white p-6 shadow">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div>
                <p className="text-sm text-gray-500">
                  Total Tickets
                </p>

                <p className="mt-1 text-3xl font-bold">
                  {tickets.length}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search
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
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-600"
                >
                  <option value="ALL">
                    All Statuses
                  </option>

                  <option value="OPEN">
                    Open
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="RESOLVED">
                    Resolved
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>
                </select>
              </div>

            </div>
          </div>

          {assignmentError && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {assignmentError}
            </div>
          )}

          {filteredTickets.length === 0 ? (

            <div className="rounded-xl bg-white p-8 text-center shadow">
              <p className="text-gray-500">
                No tickets found.
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
                      Agent
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
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                      className="cursor-pointer border-t hover:bg-gray-50"
                    >

                      <td className="p-4 font-medium">
                        {ticket.subject || "No subject"}
                      </td>

                      <td className="p-4">
                        <p className="font-medium">
                          {ticket.customerName || "Unknown"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {ticket.customerEmail || "-"}
                        </p>
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

                      <td
                        className="p-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          <p className="text-green-600 font-medium">
                            Currently Assigned:
                            <span className="ml-1">
                              {ticket.agentId
                                ? agents.find((agent) => agent.id === ticket.agentId)?.name
                                : "Not Assigned"}
                            </span>
                          </p>
                        
                          <select
                            value={selectedAgents[ticket.id] ?? ticket.agentId ?? ""}
                            onChange={(e) =>
                              setSelectedAgents((prev) => ({
                                ...prev,
                                [ticket.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="">Select Agent</option>
                        
                            {agents.map((agent) => (
                              <option key={agent.id} value={agent.id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        
                          <button
                            onClick={() => handleAssignAgent(ticket.id)}
                          >
                            {ticket.agentId ? "Change Agent" : "Assign Agent"}
                          </button>
                        </div>
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        {ticket.createdAt
                          ? new Date(
                              ticket.createdAt
                            ).toLocaleString()
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

      </main>
    </div>
  );
};

export default AdminTickets;