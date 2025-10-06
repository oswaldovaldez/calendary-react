import { Link } from "@tanstack/react-router";
import { useSidebarStore } from "../store/sidebar.store";
import { CommerceSelector } from "./CommerceSelector";
import { IoMdClose } from "react-icons/io";
import { CalendarDays, ChartBarStacked, LayoutDashboard, LayoutTemplate, Package, ShieldUser, Store, Truck, User } from "lucide-react";

const links = [
  { icon: <LayoutDashboard />, to: "/dashboard", label: "Dashboard" },
  { icon: <CalendarDays />, to: "/appointments", label: "Citas" },
  { icon: <ChartBarStacked />, to: "/categories", label: "Categorías" },
  { icon: <Store />, to: "/commerces", label: "Comercios" },
  { icon: <User />, to: "/patients", label: "Pacientes" },
  { icon: <Package />, to: "/products", label: "Productos" },
  { icon: <Truck />, to: "/services", label: "Servicios" },
  { icon: <ShieldUser />, to: "/users", label: "Usuarios" },
  { icon: <LayoutTemplate />, to: "/templates", label: "Plantillas" },
];

export function Sidebar() {
  const { isOpen, close } = useSidebarStore();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      close();
    }
  };

  return (
    <>
      {/* Overlay solo en mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col 
          bg-content transition-transform duration-300 neumo z-40
          shadow-sm lg:shadow-md
          rounded-r-2xl lg:rounded-none
          ${isOpen ? "translate-x-0" : "-translate-x-64"}`}
      >
        {/* Header con selector + botón cerrar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="w-full max-w-[85%] lg:max-w-full">
            <CommerceSelector />
          </div>

          <button
            className="lg:hidden text-2xl ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={close}
            aria-label="Cerrar sidebar"
          >
            <IoMdClose />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-2 overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={handleLinkClick}
              className="px-3 py-2 rounded-lx transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg hover:text-white"
              activeProps={{ className: "sidebar-active" }}
            >
              <span className="inline-block mr-2 align-middle">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
