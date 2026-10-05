import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const AgentLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<string>(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data;

      if (!token) {
        setError("Login failed. Token was not received.");
        return;
      }

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const role = payload.role?.replace("ROLE_", "");

      console.log("Agent login role:", role);

      if (role !== "AGENT") {
        setError(
          "Access denied. This login is only for agents."
        );
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);

      navigate("/agent/dashboard");
    } catch (error: any) {
      console.error("Agent login failed:", error);

      setError(
        error.response?.data?.message ||
          "Invalid agent email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-700">
            AI Customer Support
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Agent Login
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your assigned support tickets
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Agent Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@company.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter agent password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Agent Login"}
          </button>
        </form>

        <div className="mt-6 space-y-3 text-center">
          <p className="text-sm text-gray-600">
            Are you a Customer?{" "}
            <Link
              to="/customer/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Customer Login
            </Link>
          </p>

          <p className="text-sm text-gray-600">
            Are you an Admin?{" "}
            <Link
              to="/admin/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;