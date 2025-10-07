import { useState, useEffect, useRef } from "react";
import { FaBell, FaTrashAlt } from "react-icons/fa";
import { useSocketStore } from "../store/socket.store";
import { useAuthStore } from "../store/auth.store";
import { timeAgo } from "../utils/timeAgo";

export interface Notification {
  id: string | number;
  title: string;
  message: string;
  time?: string;
  read?: boolean;
}

interface NotificationMenuProps {
  notifications?: Notification[];
  onNotificationClick?: (notification: Notification) => void;
  onClearAll?: () => void;
  onViewAll?: () => void;
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
  onNotificationClick,
  onClearAll,
  onViewAll,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const { connectSocket, disconnectSocket, notifications } = useSocketStore();
  const { user } = useAuthStore(); // Ejemplo: user = { id, name, ... }

  const unreadCount = notifications.filter((n) => !n.read).length;
  console.log(notifications);
  // const unreadCount = 100;
  useEffect(() => {
    if (user?.id) {
      connectSocket(user.id);
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);
  // Detectar el tema actual (oscuro o claro)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left mr-3" ref={dropdownRef}>
      {/* Botón de campana */}
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center px-3 py-2 rounded-md border transition duration-200"
        style={{
          backgroundColor: isDark
            ? "var(--color-surface-dark)"
            : "var(--color-surface-light)",
          borderColor:
            "color-mix(in srgb, var(--color-text-secondary) 30%, transparent)",
          color: "var(--color-text-primary)",
          cursor: "pointer",
        }}
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full"
            style={{
              boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-50 py-2 animate-fade-in text-sm"
          style={{
            backgroundColor: "var(--color-surface)",
            border:
              "1px solid color-mix(in srgb, var(--color-text-secondary) 25%, transparent)",
            color: "var(--color-text-primary)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center px-3 py-2"
            style={{
              borderBottom:
                "1px solid color-mix(in srgb, var(--color-text-secondary) 25%, transparent)",
            }}
          >
            <span className="font-semibold">Notificaciones</span>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  onClearAll?.();
                  setOpen(false);
                }}
                className="transition text-sm"
                style={{
                  color: "var(--color-text-secondary)",
                  transition: "color 0.2s ease, background-color 0.2s ease",
                  borderRadius: "6px",
                  padding: "4px 6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-alert-error-dark)";
                  e.currentTarget.style.backgroundColor =
                    "color-mix(in srgb, var(--color-text-secondary) 15%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                title="Borrar todas"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-64 overflow-y-auto custom-scroll">
            {notifications.length === 0 ? (
              <p
                className="text-center py-6"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Sin notificaciones
              </p>
            ) : (
              notifications.map((n, idx) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onNotificationClick?.(n);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex flex-col border-b transition`}
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--color-text-secondary) 15%, transparent)",
                    color: n.read
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-primary)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "color-mix(in srgb, var(--color-primary) 15%, transparent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span className="font-medium">{n.title}</span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {n.message}
                  </span>
                  {n.date && (
                    <span
                      className="text-[10px] mt-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {timeAgo(n.date)}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Ver todas */}
          {notifications.length > 0 && (
            <div
              className="text-center py-2 mt-1 border-t text-sm font-medium cursor-pointer"
              onClick={() => {
                onViewAll?.();
                setOpen(false);
              }}
              style={{
                borderColor:
                  "color-mix(in srgb, var(--color-text-secondary) 25%, transparent)",
                color: "var(--color-primary)",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color =
                  "color-mix(in srgb, var(--color-primary) 70%, white)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
            >
              Ver todas las notificaciones
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
