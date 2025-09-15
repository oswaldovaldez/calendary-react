// Layout.tsx
import { Sidebar } from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import { useLocation } from "@tanstack/react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isNotRootPath = location.pathname !== "/";
  // console.log(isNotRootPath)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {isNotRootPath ? <Sidebar /> : <></>}
      <main className="flex-1 overflow-y-auto overflow-hidden">
        <div className="w-full h-[40px] shadow-xs shadow-gray-500 dark:shaddow-gray-100 flex flex-row-reverse px-4 py-2">
          <ThemeSwitch />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
