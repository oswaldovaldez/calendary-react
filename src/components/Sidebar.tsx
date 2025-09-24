// Sidebar.tsx
import { Link } from "@tanstack/react-router";

// { to: "/records_templates", label: "Records Templates" },
const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/appointments", label: "Equipo" },
  { to: "/categories", label: "Categorías" },
  { to: "/commerces", label: "Tiendas" },
  { to: "/patients", label: "Pacientes" },
  { to: "/products", label: "Productos" },
  { to: "/records", label: "Registros" },
  { to: "/schedules", label: "Schedules" },
  { to: "/services", label: "Servicios" },
  { to: "/users", label: "Usuarios" },
  { to: "/templates", label: "Plantillas" },
];
import { useSidebarStore } from "../store/sidebar.store";
import { CommerceSelector } from "./CommerceSelector";

export function Sidebar() {
  const { isOpen } = useSidebarStore();
  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-64 shadow-md flex flex-col 
          bg-content transition-transform duration-300 neumo z-50
          ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        <div className="p-4 text-lg font-bold">
          <CommerceSelector />
        </div>
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
