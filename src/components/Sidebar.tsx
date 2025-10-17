import { Link } from "@tanstack/react-router";
import { useSidebarStore } from "../store/sidebar.store";
import { CommerceSelector } from "./CommerceSelector";
import { IoMdClose } from "react-icons/io";
import {
  CalendarDays,
  ChartBarStacked,
  LayoutDashboard,
  LayoutTemplate,
  Package,
  ShieldUser,
  Store,
  Truck,
  User,
} from "lucide-react";
import { RouteGuard } from "./RouteGuard";

const links = [
  {
    permission: "dashboard.view",
    icon: <LayoutDashboard />,
    to: "/dashboard",
    label: "Dashboard",
  },
  {
    permission: "appointments.view",
    icon: <CalendarDays />,
    to: "/appointments",
    label: "Citas",
  },
  {
    permission: "categories.view",
    icon: <ChartBarStacked />,
    to: "/categories",
    label: "Categorías",
  },
  {
    permission: "commerces.view",
    icon: <Store />,
    to: "/commerces",
    label: "Comercios",
  },
  {
    permission: "patients.view",
    icon: <User />,
    to: "/patients",
    label: "Pacientes",
  },
  {
    permission: "products.view",
    icon: <Package />,
    to: "/products",
    label: "Productos",
  },
  {
    permission: "services.view",
    icon: <Truck />,
    to: "/services",
    label: "Servicios",
  },
  {
    permission: "users.view",
    icon: <ShieldUser />,
    to: "/users",
    label: "Usuarios",
  },
  {
    permission: "templates.view",
    icon: <LayoutTemplate />,
    to: "/templates",
    label: "Plantillas",
  },
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
        className={`fixed top-0 left-0 h-screen w-72 md:w-64 flex flex-col 
          bg-content transition-transform duration-300 neumo z-40
          shadow-sm lg:shadow-md
          rounded-r-2xl lg:rounded-none
          ${isOpen ? "translate-x-0" : "-translate-x-72 md:-translate-x-64"}`}
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
            <RouteGuard key={l.to} permission={l.permission}>
              <Link
                key={l.to}
                to={l.to}
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150 
hover:bg-[color-mix(in_oklab,var(--color-primary)_15%,transparent)] 
dark:hover:bg-[color-mix(in_oklab,var(--color-primary)_25%,black)]
hover:text-[var(--color-primary)] 
dark:hover:text-[hsl(145,85%,85%)] 
active:scale-[0.98]"
                activeProps={{ className: "sidebar-active" }}
              >
                <span className="inline-block mr-2 align-middle">{l.icon}</span>
                {l.label}
              </Link>
            </RouteGuard>
          ))}
        </nav>
      </aside>
    </>
  );
}
