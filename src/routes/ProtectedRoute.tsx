import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return <>{children}</>;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    const role = payload.role || payload.roles;

    const normalizedRole = Array.isArray(role)
      ? role.map((item) =>
          item.replace("ROLE_", "")
        )
      : role?.replace("ROLE_", "");

    const hasAccess = Array.isArray(normalizedRole)
      ? normalizedRole.some((item) =>
          allowedRoles.includes(item)
        )
      : allowedRoles.includes(normalizedRole);

    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;

  } catch (error) {
    console.error("Invalid JWT token:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;