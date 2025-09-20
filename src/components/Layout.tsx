// Layout.tsx
import { Sidebar } from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import { useLocation } from "@tanstack/react-router";
import { useSidebarStore } from "../store/sidebar.store";
import { TiThMenu } from "react-icons/ti";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isNotRootPath = location.pathname !== "/";
  // console.log(isNotRootPath)
  const { toggle, isOpen } = useSidebarStore();
  
  
  return (
    <div className="flex h-screen">
      {isNotRootPath ? <Sidebar /> : <></>}
      <main className="flex-1 overflow-y-auto overflow-hidden relative z-0">
        <div
          className={`w-full h-[40px] flex flex-row justify-between px-4 py-2 gap-3 ${isOpen && "sm:pl-64"}`}
        >
          <button onClick={toggle} className="ml-2 btn neumo btn-secondary">
            <TiThMenu />
          </button>
          <ThemeSwitch />
        </div>
        <div className={`p-6 ${isOpen && "sm:ml-64"}`}>{children}</div>
      </main>
    </div>
  );
}
