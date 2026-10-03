import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");

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
        <div className="max-w-md rounded-xl bg-white p-6 shadow">

          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Support Tickets
            </p>

            <h3 className="mt-1 text-xl font-bold">
              My Assigned Tickets
            </h3>
          </div>

          <p className="mb-6 text-gray-500">
            View the tickets assigned to you and respond to customers.
          </p>

          <button
            onClick={() => navigate("/agent/tickets")}
            className="w-full rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            View Assigned Tickets
          </button>

        </div>

      </main>

    </div>
  );
};

export default AgentDashboard;