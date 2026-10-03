import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/tickets", {
        customerName,
        customerEmail,
        subject,
        description,
        priority,
      });

      console.log("Ticket created:", response.data);

      navigate("/tickets");
    } catch (error) {
      console.error("Failed to create ticket:", error);
      setError("Failed to create ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-2xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Create Ticket
          </h1>

          <p className="mt-1 text-gray-500">
            Create a new customer support ticket
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow">

          {error && (
            <div className="mb-5 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Customer Name */}
            <div>
              <label className="mb-2 block font-medium">
                Customer Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                placeholder="Enter customer name"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
                required
              />
            </div>

            {/* Customer Email */}
            <div>
              <label className="mb-2 block font-medium">
                Customer Email
              </label>

              <input
                type="email"
                value={customerEmail}
                onChange={(e) =>
                  setCustomerEmail(e.target.value)
                }
                placeholder="Enter customer email"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block font-medium">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                placeholder="Enter ticket subject"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe your issue"
                rows={5}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
                required
              />
            </div>

            {/* Priority */}
            <div>
              <label className="mb-2 block font-medium">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-purple-600"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">

              <button
                type="button"
                onClick={() => navigate("/tickets")}
                className="rounded-lg border px-5 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Ticket"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;