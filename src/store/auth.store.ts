import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CommerceType } from "../types";
import { Api } from "../services/api";
import { Navigate } from "@tanstack/react-router";

interface AuthState {
  user: any | null;
  token: string | null;
  roles: string[];
  permissions: string[];
  commerces: any[];
  commerce: CommerceType | null;
  setAuth: (data: any) => void;
  setCommerce: (data: any) => void;
  clearAuth: () => void;
  checkToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      roles: [],
      permissions: [],
      commerces: [],
      commerce: null,

      setCommerce: (data) => set({ commerce: data }),
      setAuth: (data) =>
        set({
          user: data?.user,
          token: data?.token,
          roles: data.roles,
          permissions: data.permissions,
          commerces: data.commerces,
        }),
      clearAuth: () =>
        set({
          user: null,
          token: null,
          roles: [],
          permissions: [],
          commerces: [],
          commerce: null,
        }),

      // ---- Función para validar token ----
      checkToken: async () => {
        const { token, clearAuth } = get();
        if (!token) {
          clearAuth();
          return;
        }

        Api.checkToken({ _token: token })
        .then((response) => {
          if (!response.valid) {
            clearAuth();
             Navigate({ to: "/" });
          }
        })
        .catch(() => {
          clearAuth();
           Navigate({ to: "/" });
        });
      },
    }),
    {
      name: "auth-storage", // nombre en localStorage
    }
  )
);
