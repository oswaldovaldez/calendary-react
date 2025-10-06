import { useState, useEffect, useRef } from "react";
import { FaBell, FaTrashAlt } from "react-icons/fa";

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
}

const NotificationMenu: React.FC<NotificationMenuProps> = ({
  notifications = [],
  onNotificationClick,
  onClearAll,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
    <div className="relative inline-block text-left mr-2" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center justify-center px-3 py-2 
                   rounded-md hover:bg-gray-700 transition duration-200 bg-gray-800 text-white border border-gray-700"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold 
                           px-1.5 py-0.5 rounded-full"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 
                     py-2 animate-fade-in text-sm"
        >
          <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
            <span className="font-semibold text-gray-200">Notificaciones</span>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  onClearAll?.();
                  setOpen(false);
                }}
                className="text-gray-400 hover:text-red-400 transition"
                title="Borrar todas"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto custom-scroll">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center py-6">
                Sin notificaciones
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    onNotificationClick?.(n);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex flex-col border-b border-gray-800 hover:bg-gray-800 
                              transition ${n.read ? "text-gray-400" : "text-gray-200"}`}
                >
                  <span className="font-medium">{n.title}</span>
                  <span className="text-xs text-gray-500">{n.message}</span>
                  {n.time && (
                    <span className="text-[10px] text-gray-500 mt-1">
                      {n.time}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
