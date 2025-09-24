/* eslint-disable @typescript-eslint/no-explicit-any */
// store/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CommerceType } from "../types";


interface AuthState {
  user: any | null;
  token: string | null;
  roles: string[];  permissions: string[];
  commerces: any[];
  commerce: CommerceType|null;
  setAuth: (data: any) => void;
  setCommerce: (data: any) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(persist(
  (set) => ({
  user: null,
  token: null,
  roles: [],
  permissions: [],
  commerces: [],
  commerce:null,
  
  setCommerce: (data) => set({
      commerce:data
  }),
  setAuth: (data) => set({
    user: data?.user,
    token: data?.token,
    roles: data.roles,
    permissions: data.permissions,
    commerces: data.commerces,
  }),
  clearAuth: () => set({
    user: null,
    token: null,
    roles: [],
    permissions: [],
    commerces: [],
    commerce:null,
  })
  
  })
  ,
    {
      name: "auth-storage", // nombre en localStorage
    }
));
