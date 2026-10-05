import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginAgent } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";

const CustomerLogin = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<"USER" | "AGENT">("USER");
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
        const credentials = { email, password };
  
        const token =
          role === "AGENT"
            ? await loginAgent(credentials)
            : await loginUser(credentials);
  
        console.log("Login response:", token);
  
        // Save JWT token
        localStorage.setItem("token", token);
  
        // Save logged-in email
        localStorage.setItem("userEmail", email);
  
        // Read JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));
  
        console.log("JWT Payload:", payload);
  
        // Get role from JWT (renamed so it doesn't shadow the state)
        const jwtRole = payload.role || payload.roles;
  
        console.log("Logged in role:", jwtRole);
  
        if (jwtRole === "ADMIN" || jwtRole === "ROLE_ADMIN") {
          navigate("/admin/dashboard");
        } else if (jwtRole === "AGENT" || jwtRole === "ROLE_AGENT") {
          navigate("/agent/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error: any) {
      console.error("Login failed:", error.response?.status, error.response?.data);

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
              Login as
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "USER" | "AGENT")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
            >
              <option value="USER">Customer</option>
              <option value="AGENT">Agent</option>
            </select>
          </div>

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
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-purple-600 hover:text-purple-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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

export default CustomerLogin;