import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
          <h1 className="text-2xl font-bold text-purple-700">
            AI Customer Support
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4">
        <div className="w-full max-w-4xl text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            Welcome to AI Customer Support
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Manage support tickets, communicate with customers,
            and provide fast and efficient customer support.
          </p>

          {/* Login Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Customer */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">
                Customer
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create and manage your support tickets.
              </p>

              <button
                onClick={() => navigate("/customer/login")}
                className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Customer Login
              </button>

              <button
                onClick={() => navigate("/customer/register")}
                className="mt-3 w-full rounded-lg border border-purple-600 px-4 py-3 font-semibold text-purple-600 hover:bg-purple-50"
              >
                Create Account
              </button>
            </div>

            {/* Agent */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">
                Support Agent
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Manage assigned tickets and respond to customers.
              </p>

              <button
                onClick={() => navigate("/agent/login")}
                className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Agent Login
              </button>
            </div>

            {/* Admin */}
            <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">
                Administrator
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Manage agents, tickets, and support operations.
              </p>

              <button
                onClick={() => navigate("/admin/login")}
                className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700"
              >
                Admin Login
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;