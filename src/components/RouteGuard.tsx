// // components/RouteGuard.tsx
// import { type ReactNode } from "react";
// import { Navigate } from "@tanstack/react-router";
// import { useAuthStore } from "../store/auth.store";

// export function RouteGuard({
//   children,
//   permission,
// }: {
//   children: ReactNode;
//   permission?: string;
// }) {
//   const user = useAuthStore((s) => s.user);
//   const permissionsT = useAuthStore(
//     (s) => s.user?.roles?.[0].permissions ?? []
//   );
//   const role = useAuthStore((s) => s.user?.roles?.[0]??{ name: "", permissions: [] });
//   const permissions = [
//     ...(permissionsT || []),
//     ...(role?.permissions || []),
//     ...user.permissions,
//   ];
//   console.log(
//     permissions,
//     permission,
//     !permissions.some((p: any) => p.name === permission)
//   );

//   if (!user) return <Navigate to="/" />;
//   if (role.name === "superadmin") {
//     return <>{children}</>;
//   } 
//   if (permission && !permissions.some((p: any) => p.name === permission)) {
//     return <Navigate to="/unauthorized" />;
//   }

//   return <>{children}</>;
// }


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
  const role = user?.roles?.[0];
  const rolePermissions = role?.permissions ?? [];
  const userPermissions = user?.permissions ?? [];

  // Combinar permisos y eliminar duplicados por name
  const permissions = [...rolePermissions, ...userPermissions].filter(
    (p, index, self) =>
      p?.name && index === self.findIndex((x) => x.name === p.name)
  );

  // --- Debug completo ---
  // console.group("🔒 RouteGuard Debug");
  // console.log("Usuario:", user?.name);
  // console.log("Rol:", role?.name);
  // console.log("Permiso requerido:", permission);
  // console.log(
  //   "Permisos del rol:",
  //   rolePermissions.map((p:any) => p.name)
  // );
  // console.log(
  //   "Permisos del usuario:",
  //   userPermissions.map((p:any) => p.name)
  // );
  // console.log(
  //   "Permisos combinados:",
  //   permissions.map((p:any) => p.name)
  // );

  // console.groupEnd();

  // Validaciones
  if (!user) return <Navigate to="/" />;

  // superadmin tiene acceso total
  if (role?.name === "superadmin") return <>{children}</>;

  // Si se requiere un permiso específico
  if (permission && !permissions.some((p) => p.name === permission)) {
    console.warn(`No tiene permiso: ${permission}`);
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
