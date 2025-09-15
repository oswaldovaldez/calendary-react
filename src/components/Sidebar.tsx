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

export function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md h-screen flex flex-col">
      <div className="p-4 text-lg font-bold">Dashboard</div>
      <nav className="flex flex-col gap-2 p-2 overflow-y-auto">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
