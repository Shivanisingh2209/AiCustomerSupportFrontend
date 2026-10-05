import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

const AdminLogin = () => {
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

      // Decode JWT payload
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const role = payload.role?.replace("ROLE_", "");

      console.log("Admin login role:", role);

      // Only ADMIN is allowed here
      if (role !== "ADMIN") {
        setError(
          "Access denied. This login is only for administrators."
        );
        return;
      }

      // Save authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", email);

      // Go to admin dashboard
      navigate("/admin/dashboard");
    } catch (error: any) {
      console.error("Admin login failed:", error);

      setError(
        error.response?.data?.message ||
          "Invalid admin email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-700">
            AI Customer Support
          </h1>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Sign in to access the administration panel
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
            />
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Admin Login"}
          </button>
        </form>

        {/* Back to normal login */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-semibold text-purple-600 hover:text-purple-700"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
