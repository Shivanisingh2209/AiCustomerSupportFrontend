import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<TicketStats>({
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
  closed: 0,
});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<Record<string, number>>(
          "/tickets/stats"
        );

        console.log("Admin ticket stats:", response.data);

        setStats({
          total: response.data.total || 0,
          open: response.data.open || 0,
          inProgress: response.data.inProgress || 0,
          resolved: response.data.resolved || 0,
          closed: response.data.closed || 0,
        });
      } catch (error) {
        console.error("Failed to load ticket statistics:", error);
        setError("Failed to load ticket statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const totalTickets = stats.total;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">
          Loading admin dashboard...
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
            <h1 className="text-2xl font-bold text-purple-700">
              AI Customer Support
            </h1>

            <p className="text-sm text-gray-500">
              Admin Panel
            </p>
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
              onClick={() => navigate("/admin/tickets")}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              All Tickets
            </button>

            <button
              onClick={() => navigate("/admin/agents/create")}
              className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
            >
              Create Agent
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

      {/* Dashboard */}
      <main className="p-8">

        <div className="mx-auto max-w-7xl">

          <div className="mb-8">
            <h2 className="text-3xl font-bold">
              Admin Dashboard
            </h2>

            <p className="mt-1 text-gray-500">
              Monitor and manage customer support tickets
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">

            <div 
              onClick={() => navigate("/admin/tickets")}
              className="rounded-xl bg-white p-6 shadow"
            >
              <p className="text-sm text-gray-500">
                Total Tickets
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalTickets}
              </p>
            </div>

            <div
              onClick={() => navigate("/admin/tickets?status=OPEN")}
              className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm text-gray-500">
                Open
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {stats.open}
              </p>
            </div>

            <div 
             onClick={() => navigate("/admin/tickets?status=IN_PROGRESS")}
             className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm text-gray-500">
                In Progress
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-600">
                {stats.inProgress}
              </p>
            </div>

            <div 
             onClick={() => navigate("/admin/tickets?status=RESOLVED")}
             className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm text-gray-500">
                Resolved
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {stats.resolved}
              </p>
            </div>

            <div 
             onClick={() => navigate("/admin/tickets?status=CLOSED")}
             className="cursor-pointer rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm text-gray-500">
                Closed
              </p>

              <p className="mt-2 text-3xl font-bold text-gray-600">
                {stats.closed}
              </p>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="mt-8 rounded-xl bg-white p-6 shadow">

            <h3 className="text-xl font-semibold">
              Quick Actions
            </h3>

            <div className="mt-4 flex flex-wrap gap-4">

              <button
                onClick={() => navigate("/admin/tickets")}
                className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Manage All Tickets
              </button>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;