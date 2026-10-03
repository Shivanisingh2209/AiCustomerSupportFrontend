import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyAssignedTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              AI Customer Support
            </h1>

            <p className="text-sm text-gray-500">
              Agent Panel
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium hover:bg-gray-50"
          >
            Logout
          </button>

        </div>
      </header>

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
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">
                  Total Assigned
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalTickets}
                </p>
              </div>
        
              {/* Open */}
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">
                  Open
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {openTickets}
                </p>
              </div>
        
              {/* In Progress */}
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">
                  In Progress
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {inProgressTickets}
                </p>
              </div>
        
              {/* Resolved */}
              <div className="rounded-xl bg-white p-6 shadow">
                <p className="text-sm font-medium text-gray-500">
                  Resolved
                </p>
        
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {resolvedTickets}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
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