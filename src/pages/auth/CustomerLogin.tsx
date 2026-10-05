import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";

const CustomerLogin = () => {
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const credentials = {
        email,
        password,
      };

      const token = await loginUser(credentials);

      console.log("Login response:", token);

      // Read JWT payload
      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      console.log("JWT Payload:", payload);

      const jwtRole = payload.role || payload.roles;

      console.log("Logged in role:", jwtRole);

      const normalizedRole =
        typeof jwtRole === "string"
          ? jwtRole.replace("ROLE_", "")
          : jwtRole;

      // Customer login is only for USER
      if (normalizedRole !== "USER") {
        setError(
          "Access denied. This login is only for customers."
        );
        return;
      }

      // Save JWT token
      localStorage.setItem("token", token);

      // Save logged-in email
      localStorage.setItem("userEmail", email);

      // Go to customer dashboard
      navigate("/dashboard");

    } catch (error: any) {
      console.error(
        "Customer login failed:",
        error.response?.status,
        error.response?.data
      );

      setError(
        error.response?.data?.message ||
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

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Customer Login
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Login to manage your support tickets
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-16 outline-none focus:border-purple-600"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute inset-y-0 right-0 px-4 text-purple-600 hover:text-purple-800"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Customer Login"}
          </button>

        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/customer/register"
            className="font-semibold text-purple-600 hover:text-purple-700"
          >
            Create Customer Account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default CustomerLogin;