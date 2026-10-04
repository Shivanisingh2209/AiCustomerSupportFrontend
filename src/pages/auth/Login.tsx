import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const token = await loginUser({
        email,
        password,
      });

      console.log("Login response:", token);

      // Save JWT token
      localStorage.setItem("token", token);

      // Save logged-in email
      localStorage.setItem("userEmail", email);

      // Read JWT payload
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      console.log("JWT Payload:", payload);

      // Get role from JWT
      const role = payload.role || payload.roles;

      console.log("Logged in role:", role);

      if (role === "ADMIN" || role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (
        role === "AGENT" ||
        role === "ROLE_AGENT"
      ) {
        navigate("/agent/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Login failed. Please check your email and password."
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

          <p className="mt-2 text-gray-500">
            Login to your account
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?
          <span className="ml-1 cursor-pointer text-purple-600">
            Register
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;