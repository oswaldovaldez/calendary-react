// src/store/initAuthChecker.ts
import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "./auth.store";

export const startAuthChecker = () => {
    const store = useAuthStore.getState();
    // console.log("Auth checker started");
    
    // Validación inicial
    store.checkToken();
    
    // Validación cada 5 minutos
    const intervalId = setInterval(() => {
    store.checkToken();
  }, 60 * 1000);

  // Opcional: limpiar interval si el usuario hace logout
  const unsubscribe = useAuthStore.subscribe((token: any) => {
    if (!token) {
      clearInterval(intervalId);
        unsubscribe(); // deja de escuchar
        Navigate({ to: "/" });
    }
  });
};

// Llama esta función al iniciar tu app (por ejemplo en main.tsx o index.tsx)
startAuthChecker();
