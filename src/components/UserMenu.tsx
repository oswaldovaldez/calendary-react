import { ShieldUser } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FaCog, FaUser, FaSun } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useAuthStore } from "../store/auth.store";

interface UserMenuProps {
	onProfile?: () => void;
	onSettings?: () => void;
	onLogout?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
	onProfile,
	onSettings,
	onLogout,
}) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isDark, setIsDark] = useState(false);

	const user = useAuthStore((state) => state.user);
	const clearAuth = useAuthStore((state) => state.clearAuth);

	//
	const getShortName = (fullName: string): string => {
		if (!fullName) return "Administrador";
		const parts = fullName.trim().split(" ");
		if (parts.length === 1) return parts[0]; // solo un nombre
		return `${parts[0]} ${parts[1]}`; // primer nombre y primer apellido
	};

	const username = getShortName(
		user?.name || user?.userName || "Administrador"
	);
	const userEmail = user?.email || "usuario@correo.com";

	// Detectar modo actual según la clase en <html>
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
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
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

	const handleLogout = () => {
		clearAuth();
		onLogout?.();
		setOpen(false);
	};

	return (
		<div className="relative inline-block text-left" ref={dropdownRef}>
			{/* Botón principal */}
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
				<ShieldUser
					style={{
						color: "var(--color-text-secondary)",
					}}
				/>
				<span className="hidden md:inline font-medium">{username}</span>
			</button>

			{open && (
				<div
					className="absolute right-0 mt-2 w-64 rounded-2xl z-50 py-3 text-sm animate-fade-in"
					style={{
						backgroundColor: "var(--color-surface)",
						border: "1px solid color-mix(in srgb, var(--color-text-secondary) 20%, transparent)",
						backdropFilter: "blur(8px)",
						boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
						color: "var(--color-text-primary)",
					}}
				>
					{/* Header */}
					<div className="px-4 pb-2">
						<h3
							className="text-base font-semibold truncate"
							style={{ color: "var(--color-text-primary)" }}
						>
							{username}
						</h3>
						<p
							className="text-xs truncate"
							style={{ color: "var(--color-text-secondary)" }}
						>
							{userEmail}
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
						<button
							onClick={() => {
								onProfile?.();
								setOpen(false);
							}}
							className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-md transition"
							style={{
								backgroundColor: "transparent",
								color: "var(--color-text-primary)",
								transition:
									"background-color 0.2s ease, color 0.2s ease",
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
							<FaUser /> Perfil
						</button>

						{/* CONFIGURACIÓN */}
						<button
							onClick={() => {
								onSettings?.();
								setOpen(false);
							}}
							className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-md transition"
							style={{
								backgroundColor: "transparent",
								color: "var(--color-text-primary)",
								transition:
									"background-color 0.2s ease, color 0.2s ease",
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
						</button>

						{/* CAMBIO DE TEMA */}
						<div
							className="flex items-center justify-between px-4 py-2 rounded-md mt-1 transition"
							style={{
								backgroundColor: "transparent",
								color: "var(--color-text-primary)",
								transition: "background-color 0.2s ease",
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
							<div className="flex items-center gap-2">
								<FaSun
									style={{
										color: "var(--color-text-secondary)",
										opacity: 0.8,
									}}
								/>
								<span>Tema</span>
							</div>

							{/* Toggle según color del comercio */}
							<div
								className="w-12 h-6 rounded-full relative transition cursor-pointer"
								onClick={toggleTheme}
								style={{
									backgroundColor: isDark
										? "color-mix(in srgb, var(--color-primary) 80%, black)"
										: "var(--color-primary)",
									transition: "background-color 0.3s ease",
								}}
							>
								<div
									className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300"
									style={{
										transform: isDark
											? "translateX(1.5rem)"
											: "translateX(0)",
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
						onClick={handleLogout}
						className="w-[90%] mx-auto flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition"
						style={{
							color: "var(--color-alert-error-dark)",
							backgroundColor: "transparent",
							transition:
								"background-color 0.25s ease, color 0.25s ease",
						}}
						onMouseEnter={(e) =>
							(e.currentTarget.style.backgroundColor =
								"color-mix(in srgb, var(--color-alert-error-dark) 20%, transparent)")
						}
						onMouseLeave={(e) =>
							(e.currentTarget.style.backgroundColor =
								"transparent")
						}
					>
						<IoMdClose /> Cerrar sesión
					</button>
				</div>
			)}
		</div>
	);
};

export default UserMenu;
