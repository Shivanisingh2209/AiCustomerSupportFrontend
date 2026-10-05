import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateAgent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.department
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/agents", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        status: "AVAILABLE",
      });

      setSuccess("Agent created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
      });
    } catch (error: any) {
      console.error("Failed to create agent:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create agent."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-8">
        <div className="rounded-xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">
            Create New Agent
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Admin can create and verify a new support agent.
          </p>

          {error && (
            <div className="mt-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-6 rounded-lg bg-green-100 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Agent Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter agent name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="agent@company.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter temporary password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Department
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Payments"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Agent..." : "Create Agent"}
            </button>
          </form>

          <p className="text-sm text-gray-600">
            Already have an Agent account?{" "}
            <Link
              to="/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Agent Login
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
      </main>
    </div>
  );
};

export default CreateAgent;