import { useNavigate } from "react-router-dom";

const AgentNavbar = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    navigate("/agent/tickets");
  };

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        <div>
          <button
            onClick={() => navigate("/agent/dashboard")}
            className="text-2xl font-bold text-purple-700"
          >
            AI Customer Support
          </button>

          <p className="text-sm text-gray-500">
            Agent Panel
          </p>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-gray-700">
              {userEmail}
            </p>

            <p className="text-xs text-gray-500">
              Agent
            </p>
          </div>

          <button
            onClick={() => navigate("/agent/tickets")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            My Tickets
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
  );
};

export default AgentNavbar;