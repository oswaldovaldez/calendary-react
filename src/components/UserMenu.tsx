import { ShieldUser } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {  FaUser, FaSun } from "react-icons/fa";
// import { FaCog, FaUser, FaSun } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useAuthStore } from "../store/auth.store";
import { Link } from "@tanstack/react-router";
interface UserMenuProps {
  onProfile?: () => void;
  onLogout?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  onProfile,
  onLogout,
}) => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  const getDisplayName = (name?: string) => {
    if (!name) return "Usuario";
    const parts = name.trim().split(" ");
    return parts.slice(0, 2).join(" "); // Primer nombre y apellido
  };

  // Detectar modo actual
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    setIsDark(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Botón principal */}
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md transition duration-200 cursor-pointer select-none"
        style={{
          color: "var(--color-text-primary)",
          backgroundColor: "transparent",
          transition: "background-color 0.2s ease, opacity 0.2s ease",
        }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor =
            "color-mix(in srgb, var(--color-text-secondary) 15%, transparent)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <ShieldUser style={{ color: "var(--color-text-secondary)" }} />
        <span className="hidden md:inline font-medium">
          {getDisplayName(user?.name)}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded-2xl z-50 py-3 text-sm animate-fade-in"
          style={{
            backgroundColor: "var(--color-surface)",
            border:
              "1px solid color-mix(in srgb, var(--color-text-secondary) 20%, transparent)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            color: "var(--color-text-primary)",
          }}
        >
          {/* Header */}
          <div className="px-4 pb-2">
            <h3
              className="text-base font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              {getDisplayName(user?.name)}
            </h3>
            <p
              className="text-xs truncate"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {user?.email || "correo@usuario.com"}
            </p>
          </div>

          <div
            className="border-t my-3"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-text-secondary) 40%, transparent)",
            }}
          />

          {/* Opciones */}
          <div className="flex flex-col text-sm tracking-tight">
            {/* PERFIL */}
            <Link
              to={"/profile"}
              onClick={() => {
                onProfile?.();
                setOpen(false);
              }}
              className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-md transition"
              style={{
                color: "var(--color-text-primary)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <FaUser /> Perfil
            </Link>

            {/* CONFIGURACIÓN */}
            {/* <button
							onClick={() => {
								onSettings?.();
								setOpen(false);
							}}
							className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-md transition"
							style={{
								color: "var(--color-text-primary)",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.backgroundColor =
									"color-mix(in srgb, var(--color-primary) 15%, transparent)")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.backgroundColor =
									"transparent")
							}
						>
							<FaCog /> Configuración
						</button> */}

            {/* CAMBIO DE TEMA */}
            <div
              className="flex items-center justify-between px-4 py-2 rounded-md mt-1 transition"
              style={{
                color: "var(--color-text-primary)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "color-mix(in srgb, var(--color-primary) 15%, transparent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div className="flex items-center gap-2">
                <FaSun
                  style={{
                    color: "var(--color-text-secondary)",
                    opacity: 0.8,
                  }}
                />
                <span>Tema</span>
              </div>

              {/* Toggle dinámico */}
              <div
                className="w-12 h-6 rounded-full relative transition cursor-pointer"
                onClick={toggleTheme}
                style={{
                  backgroundColor: isDark
                    ? "color-mix(in srgb, var(--color-primary) 80%, black)"
                    : "var(--color-primary)",
                }}
              >
                <div
                  className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300"
                  style={{
                    transform: isDark ? "translateX(1.5rem)" : "translateX(0)",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="border-t my-3"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-text-secondary) 40%, transparent)",
            }}
          />

          {/* LOGOUT */}
          <button
            onClick={() => {
              onLogout?.();
              setOpen(false);
            }}
            className="w-[90%] mx-auto flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors"
            style={{
              color: "oklch(0.55 0.25 25)", // rojo sobrio (letras)
              backgroundColor: "transparent",
              transition: "background-color 0.25s ease, color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "color-mix(in srgb, var(--color-text-secondary) 10%, transparent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <IoMdClose /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
