import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export interface NotificationPayload {
  id: string;
  message: string;
  title: string;
  date: string;
  read: boolean;
  type: "private" | "public";
}

interface SocketState {
  socket: Socket | null;
  notifications: NotificationPayload[];
  reloadCalendar: boolean;
  bufferedNotifications: Omit<NotificationPayload, "id" | "read">[];
  connectSocket: (userId: number) => void;
  disconnectSocket: () => void;
  setReloadCalendar: (value:boolean) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
}

export const useSocketStore = create<SocketState>()(
  persist(
    (set, get) => ({
      socket: null,
      notifications: [],
      reloadCalendar: false,
      bufferedNotifications: [],

      connectSocket: (userId: number) => {
        if (get().socket) return;

        const socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
        });

        // Conectado
        socket.on("connect", () => {
          // console.log("🟢 Conectado:", socket.id);
          socket.emit("set_user_id", userId);

          // Procesar notificaciones buffer
          const buffered = get().bufferedNotifications;
          if (buffered.length > 0) {
            buffered.forEach((data) => {
              const notification: NotificationPayload = {
                id: crypto.randomUUID(),
                read: false,
                ...data,
              };
              set((state) => ({
                notifications: [notification, ...state.notifications],
              }));
            });
            set({ bufferedNotifications: [] }); // Limpiar buffer
          }
        });

        // Reconexión
        // socket.on("reconnect_attempt", (attempt) => {
        //   console.log(`🔄 Intento de reconexión #${attempt}`);
        // });

        socket.on("reconnect", (attempt) => {
           console.log(`✅ Reconectado después de ${attempt} intentos`);
          socket.emit("set_user_id", userId); // Reasignamos userId
        });

        // Notificaciones
        const notificationHandler = (data: Omit<NotificationPayload, "id" | "read">) => {
          
          const socketConnected = get().socket?.connected;
          if (socketConnected) {
            if (data.type === "private") {

              const notification: NotificationPayload = {
                id: crypto.randomUUID(),
                read: false,
                ...data,
              };
              set((state) => ({
                notifications: [notification, ...state.notifications],
              }));
            }
            else { 
              const { title } = data;
              if (title === 'refresh_calendary') { 
                set({ reloadCalendar: true });
              }
              // console.log("Notificación pública recibida, no se muestra en este contexto.");
            }
          } else {
            // Guardar en buffer si no hay conexión
            set((state) => ({
              bufferedNotifications: [data, ...state.bufferedNotifications],
            }));
          }
        };
      

        socket.on("user.notification", notificationHandler);

        socket.on("disconnect", (reason) => {
          console.log("🔴 Desconectado:", reason);
        });

        set({ socket });
      },

      disconnectSocket: () => {
        const socket = get().socket;
        if (socket) {
          socket.removeAllListeners();
          socket.disconnect();
          set({ socket: null });
        }
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
      setReloadCalendar: (value: boolean) => {
        set({ reloadCalendar: value });
      },
      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
    }),
    {
      name: "SocketStore",
      partialize: (state) => ({
        notifications: state.notifications,
        bufferedNotifications: state.bufferedNotifications, // Persistimos también buffer
      }),
    }
  )
);
