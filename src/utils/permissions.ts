// utils/permissions.ts
import { useAuthStore } from "../store/auth.store";

export function hasPermission(permission: string) {
  const user = useAuthStore.getState().user;
  return user?.permissions.includes(permission);
}

export function hasRole(role: string) {
  const user = useAuthStore.getState().user;
  return user?.role === role;
}
