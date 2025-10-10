import { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoCheckmark } from "react-icons/io5";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "@tanstack/react-router";

export function CommerceSelector() {
  const role = useAuthStore((s) => s.user?.roles[0] ?? []);
  const commerces = useAuthStore((s) =>
    role.name === "superadmin"
      ? s.commerces !== null
        ? s.commerces
        : []
      : s.user?.commerces !== null
        ? s.user?.commerces
        : []
  );

  const currentCommerce = useAuthStore((s) => s.commerce);
  const setCommerce = useAuthStore((s) => s.setCommerce);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inicializa commerce desde localStorage o primer commerce
  useEffect(() => {
    if (commerces.length > 0) {
      const saved = localStorage.getItem("selected_commerce");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validamos que el commerce guardado exista todavía
        const stillExists = commerces.find((c: any) => c.id === parsed.id);
        if (stillExists) {
          setCommerce(parsed);
          // navigate({ to: "/dashboard" });
        } else {
          setCommerce(commerces[0]);
          navigate({ to: "/dashboard" });
        }
      } else {
        setCommerce(commerces[0]);
        navigate({ to: "/dashboard" });
      }
    }

    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [commerces, setCommerce]);

  // 👉 Guardar en localStorage y setear atributo en <html>
  useEffect(() => {
    if (currentCommerce) {
      localStorage.setItem(
        "selected_commerce",
        JSON.stringify(currentCommerce)
      );
      if (currentCommerce?.slug) {
        document.documentElement.setAttribute(
          "data-commerce",
          currentCommerce.slug
        );
      }
    }
  }, [currentCommerce]);

  const handleSelect = (commerce: any) => {
    setCommerce(commerce);

    const root = document.documentElement;
    //console.log(root,commerce);
    root.style.removeProperty("--color-primary");
    root.style.removeProperty("--color-primary-hover");
    if (commerce.data.hasOwnProperty("colors")) {
      if (commerce.data.colors.hasOwnProperty("background")) {
        root.style.setProperty(
          "--color-primary",
          commerce.data.colors.background
        );
      }
      if (commerce.data.colors.hasOwnProperty("active")) {
        root.style.setProperty(
          "--color-primary-hover",
          commerce.data.colors.active
        );
      }
    }
    setIsOpen(false);
    navigate({ to: "/dashboard" });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal que muestra el commerce actual */}
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent neumo"
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {/* Avatar/Imagen */}
          <div className="flex-shrink-0">
            {currentCommerce?.image ? (
              <img
                src={currentCommerce.image}
                alt={currentCommerce.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {currentCommerce?.name?.charAt(0).toUpperCase() || "C"}
                </span>
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {currentCommerce?.name || "Seleccionar Commerce"}
            </p>
            {currentCommerce?.description && (
              <p className="text-xs truncate">{currentCommerce.description}</p>
            )}
          </div>
        </div>

        {/* Chevron */}
        <IoChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-64 overflow-y-auto commerce-dropdown">
          <div className="py-1">
            {commerces.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No hay commerces disponibles
              </div>
            ) : (
              commerces.map((commerce: any) => (
                <button
                  key={commerce.id}
                  onClick={() => handleSelect(commerce)}
                  className="w-full flex items-center px-3 py-2.5 transition-colors duration-150 text-left"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Avatar/Imagen */}
                    <div className="flex-shrink-0">
                      {commerce.image ? (
                        <img
                          src={commerce.image}
                          alt={commerce.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {commerce.name?.charAt(0).toUpperCase() || "C"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Información */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {commerce.name}
                      </p>
                      {commerce.description && (
                        <p className="text-xs truncate">
                          {commerce.description}
                        </p>
                      )}
                    </div>

                    {/* Check si está seleccionado */}
                    {currentCommerce?.id === commerce.id && (
                      <IoCheckmark className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
