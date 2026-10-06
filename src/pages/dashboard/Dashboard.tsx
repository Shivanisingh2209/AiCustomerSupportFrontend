import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyTickets } from "../../services/ticketService";
import type { Ticket } from "../../types/ticket";

const Dashboard = () => {
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getMyTickets();

        console.log("My tickets from backend:", data);
        console.log("Number of my tickets:", data.length);

        setTickets(data);
      } catch (error) {
        console.error("Failed to load my tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // ================= TICKET STATISTICS =================

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;

  const totalTickets = tickets.length;

  // ================= SEARCH =================

  const filteredTickets = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return tickets;
    }

    return tickets.filter(
      (ticket) =>
        ticket.subject?.toLowerCase().includes(searchText) ||
        ticket.description?.toLowerCase().includes(searchText) ||
        ticket.status?.toLowerCase().includes(searchText) ||
        ticket.priority?.toLowerCase().includes(searchText)
    );
  }, [tickets, search]);

  const recentTickets = filteredTickets.slice(0, 5);

  // ================= STYLES =================

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-600";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-600";

      case "LOW":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "OPEN":
        return "bg-purple-100 text-purple-600";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-600";

      case "RESOLVED":
        return "bg-green-100 text-green-600";

      case "CLOSED":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HERO ================= */}

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 p-8 text-white shadow-lg md:p-10">

          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />

          <div className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-white/5" />

          <div className="relative max-w-3xl">

            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-purple-100">
              Customer Support Portal
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Hi, {userName || "there"}! 👋
            </h1>

            <p className="mt-3 text-base text-purple-100 md:text-lg">
              How can we help you today?
            </p>

            <div className="mt-6 flex max-w-xl items-center rounded-xl bg-white px-4 py-3 shadow-md">

              <span className="mr-3 text-lg">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your tickets..."
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
              />

            </div>

          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="mt-8">

          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Quick Actions
          </h2>

          <div className="grid gap-5 md:grid-cols-3">

            <div
              onClick={() => navigate("/tickets/create")}
              className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl transition group-hover:scale-110">
                🎫
              </div>

              <h3 className="font-semibold text-gray-800">
                Create a Ticket
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Need help? Create a new support request.
              </p>

              <p className="mt-4 text-sm font-semibold text-purple-600">
                Create Ticket →
              </p>

            </div>

            <div
              onClick={() => navigate("/tickets")}
              className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl transition group-hover:scale-110">
                💬
              </div>

              <h3 className="font-semibold text-gray-800">
                My Tickets
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View and track all your support requests.
              </p>

              <p className="mt-4 text-sm font-semibold text-blue-600">
                View Tickets →
              </p>

            </div>

            <div
              onClick={() => navigate("/notifications")}
              className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-yellow-200 hover:shadow-lg"
            >

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl transition group-hover:scale-110">
                🔔
              </div>

              <h3 className="font-semibold text-gray-800">
                Notifications
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Stay updated with your ticket activity.
              </p>

              <p className="mt-4 text-sm font-semibold text-yellow-600">
                View Notifications →
              </p>

            </div>

          </div>
        </div>

        {/* ================= TICKET OVERVIEW ================= */}

        <div className="mt-8">

          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Ticket Overview
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                  Open
                </p>

                <span className="text-lg">
                  🟣
                </span>

              </div>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {openTickets}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Awaiting support
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                  In Progress
                </p>

                <span className="text-lg">
                  🔵
                </span>

              </div>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {inProgressTickets}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Being handled
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                  Resolved
                </p>

                <span className="text-lg">
                  🟢
                </span>

              </div>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {resolvedTickets}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Successfully solved
              </p>

            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"> 
              <div className="flex items-center justify-between"> 
                <p className="text-sm text-gray-500"> 
                  Closed 
                </p> 
                <span className="text-lg"> ⚫ </span> 
              </div> 
              <p className="mt-2 text-3xl font-bold text-gray-700"> 
                {closedTickets} 
              </p> 
              <p className="mt-1 text-xs text-gray-400"> 
                Completed tickets 
              </p> 
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">

              <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                  Total Tickets
                </p>

                <span className="text-lg">
                  🎫
                </span>

              </div>

              <p className="mt-2 text-3xl font-bold text-gray-800">
                {totalTickets}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                All your tickets
              </p>

            </div>

          </div>
        </div>

        {/* ================= RECENT TICKETS ================= */}

        <div className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold text-gray-800">
                Recent Tickets
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest support requests
              </p>

            </div>

            <button
              onClick={() => navigate("/tickets")}
              className="text-sm font-semibold text-purple-600 transition hover:text-purple-700"
            >
              View All →
            </button>

          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {loading && (
              <div className="p-8 text-center text-sm text-gray-500">
                Loading your tickets...
              </div>
            )}

            {!loading && recentTickets.length === 0 && (
              <div className="p-10 text-center">

                <div className="text-4xl">
                  🎫
                </div>

                <h3 className="mt-3 font-semibold text-gray-800">
                  {search
                    ? "No matching tickets found"
                    : "No tickets yet"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {search
                    ? "Try searching with a different keyword."
                    : "Create your first support ticket and our team will help you."}
                </p>

                {!search && (
                  <button
                    onClick={() => navigate("/tickets/create")}
                    className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Create Your First Ticket
                  </button>
                )}

              </div>
            )}

            {!loading &&
              recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="group flex cursor-pointer flex-col gap-4 border-b border-gray-100 p-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
                >

                  <div className="min-w-0">

                    <h3 className="truncate font-semibold text-gray-800 group-hover:text-purple-600">
                      {ticket.subject}
                    </h3>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {ticket.description}
                    </p>

                  </div>

                  <div className="flex shrink-0 items-center gap-2">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityStyle(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        ticket.status
                      )}`}
                    >
                      {ticket.status?.replace("_", " ")}
                    </span>

                    <span className="ml-1 text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600">
                      →
                    </span>

                  </div>

                </div>
              ))}

          </div>
        </div>

        {/* ================= NEED HELP ================= */}

        <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-6 md:p-7">

          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">

            <div>

              <h2 className="text-lg font-semibold text-gray-800">
                Still need help? 💜
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Our support team is ready to help you resolve your issue.
              </p>

            </div>

            <button
              onClick={() => navigate("/tickets/create")}
              className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md"
            >
              Create New Ticket
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
