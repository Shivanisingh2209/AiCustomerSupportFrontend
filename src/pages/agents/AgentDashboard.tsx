import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyAssignedTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";
import AgentNavbar from "../../components/AgentNavbar";
import { getAgents, updateAgentStatus } from "../../services/agentService";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState("");
  const [agentStatus, setAgentStatus] = useState("AVAILABLE");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const userEmail = localStorage.getItem("userEmail");

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
      } finally {
        setLoading(false);
      }
    };
  
    loadTickets();
  }, []);

  useEffect(() => {
    const loadAgent = async () => {
      try {
        const agents = await getAgents();
  
        const currentAgent = agents.find(
          (agent) => agent.email === userEmail
        );
  
        if (currentAgent) {
          setAgentId(currentAgent.id);
          setAgentStatus(currentAgent.status);
        }
      } catch (error) {
        console.error(
          "Failed to load agent:",
          error
        );
      }
    };
  
    loadAgent();
  }, [userEmail]);

  const handleStatusChange = async (
    newStatus: string
  ) => {
    if (!agentId) return;
  
    try {
      setUpdatingStatus(true);
  
      const updatedAgent = await updateAgentStatus(
        agentId,
        newStatus
      );
  
      setAgentStatus(updatedAgent.status);
    } catch (error) {
      console.error(
        "Failed to update agent status:",
        error
      );
    } finally {
      setUpdatingStatus(false);
    }
  };
  
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;
  
  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;
  
  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;
  
  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;

  const totalTickets = tickets.length;

  return (
    <div className="min-h-screen bg-gray-100">

      <AgentNavbar />

      {/* Main */}
      <main className="mx-auto max-w-7xl p-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Agent Dashboard
          </h2>

          <p className="mt-2 text-gray-500">
            Welcome, {userEmail}
          </p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            Availability:
          </span>
        
          <select
            value={agentStatus}
            onChange={(e) =>
              handleStatusChange(e.target.value)
            }
            disabled={updatingStatus}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium outline-none focus:border-purple-600 disabled:opacity-50"
          >
            <option value="AVAILABLE">
              AVAILABLE
            </option>
        
            <option value="BUSY">
              BUSY
            </option>
          </select>
        </div>

        {/* Assigned Tickets Card */}
      {loading ? (
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Loading dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        
              {/* Total */}
              <div
                onClick={() => navigate("/agent/tickets")}
                className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-medium text-gray-500">
                  Total Assigned
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalTickets}
                </p>
              </div>
        
              {/* Open */}
              <div
                onClick={() => navigate("/agent/tickets?status=OPEN")}
                className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-medium text-gray-500">
                  Open
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {openTickets}
                </p>
              </div>
        
              {/* In Progress */}
              <div
                onClick={() => navigate("/agent/tickets?status=IN_PROGRESS")}
                className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-medium text-gray-500">
                  In Progress
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {inProgressTickets}
                </p>
              </div>
        
              {/* Resolved */}
              <div
                onClick={() => navigate("/agent/tickets?status=RESOLVED")}
                className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-medium text-gray-500">
                  Resolved
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {resolvedTickets}
                </p>
              </div>

              <div
                onClick={() => navigate("/agent/tickets?status=CLOSED")}
                className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-sm font-medium text-gray-500">
                  Closed
                </p>
              
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {closedTickets}
                </p>
              </div>
            </div>
        
            {/* Assigned Tickets */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow">
              <div className="flex items-center justify-between">
        
                <div>
                  <h3 className="text-xl font-bold">
                    My Assigned Tickets
                  </h3>
        
                  <p className="mt-1 text-gray-500">
                    View and manage tickets assigned to you.
                  </p>
                </div>
        
                <button
                  onClick={() => navigate("/agent/tickets")}
                  className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                >
                  View Tickets
                </button>
        
              </div>
            </div>
          </>
      )}

      </main>

    </div>
  );
};

export default AgentDashboard;