// Layout.tsx
import { Sidebar } from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import { useLocation } from "@tanstack/react-router";
import { useSidebarStore } from "../store/sidebar.store";
import { TiThMenu } from "react-icons/ti";
import { AiOutlineLogout } from "react-icons/ai";
import { Api } from "../services/api";
import { useAuthStore } from "../store/auth.store";
import { router } from "../routes/__root";
export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const isNotRootPath = location.pathname !== "/";

  const { toggle, isOpen } = useSidebarStore();

  const logout = () => {
    Api.logout({ user_id: user.id, _token: token })
      .then((res) => {
        clearAuth();
        router.navigate({ to: "/" });
      })
      .catch((error) => {
        router.navigate({ to: "/" });
      });
  };

  return (
    <div className="flex h-screen">
      {isNotRootPath ? <Sidebar /> : <></>}
      <main
        className={`flex-1 ${isNotRootPath ? "overflow-y-auto" : ""} overflow-hidden relative z-0`}
      >
        {isNotRootPath && (
          <div
            className={`w-full h-[40px] flex flex-row justify-between px-4 py-2 gap-3 ${isOpen ? "sm:pl-64" : ""}`}
          >
            <button onClick={toggle} className="ml-2 btn neumo btn-secondary">
              <TiThMenu />
            </button>
            <div>
              <ThemeSwitch />
              <button onClick={logout} className="ml-2 btn neumo btn-danger">
                <AiOutlineLogout />
              </button>
            </div>
          </div>
        )}
        {isNotRootPath ? (
          <div className={`p-6 ${isOpen && "sm:ml-64"}`}>{children}</div>
        ) : (
          <div className={`p-6`}>{children}</div>
        )}
      </main>
    </div>
  );
}
