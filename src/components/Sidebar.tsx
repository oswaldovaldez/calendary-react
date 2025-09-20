// Sidebar.tsx
import { Link } from "@tanstack/react-router"

// { to: "/records_templates", label: "Records Templates" },
const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/appointments", label: "Appointments" },
  { to: "/categories", label: "Categories" },
  { to: "/commerces", label: "Commerces" },
  { to: "/patients", label: "Patients" },
  { to: "/products", label: "Products" },
  { to: "/records", label: "Records" },
  { to: "/schedules", label: "Schedules" },
  { to: "/services", label: "Services" },
  { to: "/users", label: "Users" },
]
import { useSidebarStore } from "../store/sidebar.store";
export function Sidebar() {

   const { isOpen } = useSidebarStore();
  return (
    <>
      

      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 shadow-md flex flex-col 
          bg-content transition-transform duration-300 neumo z-50
          ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="p-4 text-lg font-bold">Dashboard</div>
        <nav className="flex flex-col gap-2 p-2 overflow-y-auto">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-3 py-2 rounded-lg">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
