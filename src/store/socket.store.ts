import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface NotificationPayload {
  id: string;
  message: string;
  title: string;
  date: string;
  read: boolean;
}

interface SocketState {
  socket: Socket | null;
  notifications: NotificationPayload[];
  connectSocket: (userId: number) => void;
  disconnectSocket: () => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
}

export const useSocketStore = create<SocketState>()(
  devtools((set, get) => ({
    socket: null,
    notifications: [],

    connectSocket: (userId: number) => {
      if (get().socket) return;

      const socket = io(import.meta.env.VITE_SOCKET_URL || "http://168.231.69.210:3131", {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("🟢 Conectado:", socket.id);
        socket.emit("set_user_id", userId);
      });

      socket.on("user.notification", (data) => {
        const notification: NotificationPayload = {
          id: crypto.randomUUID(),
          read: false,
          ...data,
        };
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }), false, "ADD_NOTIFICATION");
      });

      socket.on("disconnect", () => {
        console.log("🔴 Desconectado del servidor Socket.IO");
      });

      set({ socket }, false, "SET_SOCKET");
    },

    disconnectSocket: () => {
      const socket = get().socket;
      if (socket) {
        socket.disconnect();
        set({ socket: null }, false, "DISCONNECT_SOCKET");
      }
    },

    clearNotifications: () => {
      set({ notifications: [] }, false, "CLEAR_NOTIFICATIONS");
    },

    markAsRead: (id: string) => {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }), false, "MARK_AS_READ");
    },
  }), { name: "SocketStore" })
);
