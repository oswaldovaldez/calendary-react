// components/RouteGuard.tsx
import { type ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth.store";

export function RouteGuard({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: string;
}) {
  const user = useAuthStore((s) => s.user);
  const permissionsT = useAuthStore(
    (s) => s.user?.roles?.[0].permissions ?? []
  );
  const role = useAuthStore((s) => s.user?.roles?.[0]??{ name: "", permissions: [] });
  const permissions = [...(permissionsT || []), ...(role?.permissions || [])];
  // console.log(
  //   permissions,
  //   permission,
  //   !permissions.some((p: any) => p.name === permission)
  // );

  if (!user) return <Navigate to="/" />;
  if (role.name === "superadmin") {
    return <>{children}</>;
  }
  if (permission && !permissions.some((p: any) => p.name === permission)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
