import { ShieldUser } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {  FaCog, FaUser } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

interface UserMenuProps {
  username?: string;
  onProfile?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  username = "Administrador",
  onProfile,
  onSettings,
  onLogout,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="flex align-items-center gap-2 px-3 py-2 rounded-md 
                   transition duration-200"
        onClick={() => setOpen(!open)}
      >
        <ShieldUser />
        <span className="hidden md:inline">{username}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 py-2
                     animate-fade-in text-sm border"
        >
          <button
            onClick={() => {
              onProfile?.();
              setOpen(false);
            }}
            className="dropdown-item cursor-pointer w-full text-left flex items-center gap-2 px-3 py-2"
          >
            <FaUser /> Perfil
          </button>

          <button
            onClick={() => {
              onSettings?.();
              setOpen(false);
            }}
            className="dropdown-item cursor-pointer w-full text-left flex items-center gap-2 px-3 py-2"
          >
            <FaCog /> Configuración
          </button>

          <div className="dropdown-divider border-gray-700 my-1" />

          <button
            onClick={() => {
              onLogout?.();
              setOpen(false);
            }}
            className="dropdown-item cursor-pointer w-full text-left flex items-center gap-2 px-3 py-2 text-red-400 "
          >
            <IoMdClose /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
