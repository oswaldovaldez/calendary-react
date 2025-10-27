
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/__root"; // lo armamos con tus rutas
import { Toaster } from "react-hot-toast";
import { startAuthChecker } from "./store/initAuthChecker";
//import "react-toastify/dist/ReactToastify.css";

// const queryClient = new QueryClient();



function App() {

  startAuthChecker();

  return (
    <>
      
      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
    //   <QueryClientProvider client={queryClient}>
    // </QueryClientProvider>
  );
}

export default App
/**
 * Pendientes:
 * - saldo de pacientes
 * - boton y vista para recargar saldo
 * - boton y vista para redimir saldo
 * - historial de recargas y redenciones
 * - servidor elimininar cita staus cancel
 * - mensaje de erroes en todos los formularios
 * - formulario de orden de cita 50%
 * - otros puntos del dashboard
 * - crear tabla de dias de asueto en el backend y formulario para gestionarlo
*/