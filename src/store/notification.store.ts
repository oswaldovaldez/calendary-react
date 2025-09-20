// stores/notification.store.ts
import { create } from "zustand";
import toast from "react-hot-toast";

type NotificationType = "success" | "error" | "loading" | "info";

interface NotificationStore {
  notify: (type: NotificationType, message: string) => void;
}

export const useNotificationStore = create<NotificationStore>(() => ({
  notify: (type, message) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "loading":
        toast.loading(message);
        break;
      case "info":
      default:
        toast(message);
        break;
    }
  },
}));
