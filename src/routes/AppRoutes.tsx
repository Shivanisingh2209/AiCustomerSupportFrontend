import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Tickets from "../pages/tickets/Tickets";
import CreateTicket from "../pages/tickets/CreateTicket";
import TicketDetails from "../pages/tickets/TicketDetails";

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/tickets/create" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetails />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;