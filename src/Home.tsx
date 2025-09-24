/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Login from "./pages/Login.tsx";
import RegisterForm from "./pages/Register.tsx";
import { Api } from "./services/api.ts";
import { useAuthStore } from "./store/auth.store.ts";
import { useRouter } from "@tanstack/react-router";

const Home = () => {
  const [isRegister, setIsRegister] = useState(false);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user !== null) {
      router.navigate({ to: "/dashboard" });
      return;
    }

    Api.existUser()
      .then((res: any) => {
        // console.log(res);
        if (res.exist) {
          // console.log("Existe usuario, mostrar login");
          setIsRegister(false);
        } else {
          // console.log("No existe usuario, mostrar registro");
          setIsRegister(true);
        }
      })
      .catch(console.error);
  }, []);
  return (
    <section className="h-screen">
      <div className="container h-full px-6 py-24 flex justify-center items-center flex-col mx-auto">
        {isRegister ? <RegisterForm /> : <Login />}
      </div>
    </section>
  );
};

export default Home;
