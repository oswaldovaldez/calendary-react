
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/__root"; // lo armamos con tus rutas
  

// const queryClient = new QueryClient();



function App() {

  

  return (
   
      <RouterProvider router={router} />
    //   <QueryClientProvider client={queryClient}>
    // </QueryClientProvider>
  )
}

export default App
