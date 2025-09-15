// components/RouteGuard.tsx
import { type ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth.store";

export function RouteGuard({
  children,
  permission,
  role,
}: {
  children: ReactNode;
  permission?: string;
  role?: string;
}) {
  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);
  const roles = useAuthStore((s) => s.roles);

  if (!user) return <Navigate to="/" />;

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/unauthorized" />;
  }

  if (role && roles[0] !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
