import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Tickets from "../pages/tickets/Tickets";
import CreateTicket from "../pages/tickets/CreateTicket";
import TicketDetails from "../pages/tickets/TicketDetails";
import AgentTickets from "../pages/agents/AgentTickets";
import AgentDashboard from "../pages/agents/AgentDashboard";
import ProtectedRoute from "./ProtectedRoute";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        AI Customer Support
      </h1>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tickets"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <Tickets />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tickets/create"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["USER", "AGENT"]}>
              <TicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/agent/tickets"
          element={
            <ProtectedRoute allowedRoles={["AGENT"]}>
              <AgentTickets />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;