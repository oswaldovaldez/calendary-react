import React, { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import {
	ShieldUser,
	Mail,
	CalendarDays,
	Building2,
	Lock,
	Palette,
	Bell,
	BellOff,
} from "lucide-react";

const Profile: React.FC = () => {
	const user = useAuthStore((s) => s.user);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	if (!user) {
		return (
			<div className="text-center mt-10 text-[var(--color-text-secondary)]">
				Cargando información...
			</div>
		);
	}

	const handleChangePassword = (e: React.FormEvent) => {
		e.preventDefault();
		console.log({ currentPassword, newPassword, confirmPassword });
	};

	const iconClass =
		"text-[var(--color-primary)] dark:text-[hsl(145,85%,85%)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]";

	return (
		<main className="w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col gap-8 p-4 md:p-8">
			{/* === ENCABEZADO === */}
			<section className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6 border-b border-gray-200 dark:border-gray-700 pb-6">
				<div className="flex items-center gap-6 w-full">
					{/* Avatar */}
					<div className="w-28 h-28 rounded-full flex items-center justify-center bg-[var(--color-primary)/10]">
						<ShieldUser
							size={56}
							className={`${iconClass} opacity-90 dark:opacity-100`}
						/>
					</div>

					{/* Nombre y detalles */}
					<div>
						<h1 className="text-3xl md:text-4xl font-bold capitalize">
							{user.name}
						</h1>
						<p className="text-[var(--color-text-secondary)] text-sm font-medium">
							{user.roles?.[0]?.name || "Usuario"}
						</p>
						<div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[var(--color-text-secondary)]">
							<div className="flex items-center gap-1.5">
								<Mail size={14} className={iconClass} />
								<span>{user.email}</span>
							</div>
							<div className="flex items-center gap-1.5">
								<CalendarDays size={14} className={iconClass} />
								<span>
									Registrado el{" "}
									{new Date(
										user.created_at
									).toLocaleDateString("es-MX")}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Botón Editar perfil */}
				<button
					className="px-6 py-2 bg-[var(--color-primary)] text-white font-semibold rounded-full shadow-sm
					hover:scale-[1.03] active:scale-[0.98] whitespace-nowrap transition-all duration-200"
				>
					Editar perfil
				</button>
			</section>

			{/* === SECCIONES PRINCIPALES === */}
			<section className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
				{/* COLUMNA IZQUIERDA */}
				<div className="space-y-6">
					{/* INFORMACIÓN GENERAL */}
					<div className="card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
						<h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
							<ShieldUser size={20} className={iconClass} />
							Información general
						</h2>
						<p>
							<strong>Correo electrónico:</strong> {user.email}
						</p>
						<p className="flex items-center gap-2 mt-2">
							<strong>Color de calendario:</strong>
							<span
								className="inline-block rounded-full w-5 h-5 border shadow-sm"
								style={{
									backgroundColor:
										user.data?.calendar_color || "#ccc",
								}}
								title={user.data?.calendar_color}
							></span>
							<span className="text-sm text-[var(--color-text-secondary)]">
								{user.data?.calendar_color ||
									"Sin color definido"}
							</span>
						</p>
						<p className="mt-2">
							<strong>Roles:</strong>{" "}
							{user.roles?.map((r: any) => (
								<span
									key={r.id}
									className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs font-semibold mr-1"
								>
									{r.name}
								</span>
							))}
						</p>
					</div>

					{/* CAMBIO DE CONTRASEÑA */}
					<div className="card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
						<h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
							<Lock size={20} className={iconClass} />
							Cambiar Contraseña
						</h2>
						<form
							onSubmit={handleChangePassword}
							className="flex flex-col gap-4"
						>
							<div>
								<label className="text-sm font-semibold">
									Contraseña actual
								</label>
								<input
									type="password"
									className="input w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent"
									value={currentPassword}
									onChange={(e) =>
										setCurrentPassword(e.target.value)
									}
									required
								/>
							</div>
							<div>
								<label className="text-sm font-semibold">
									Nueva contraseña
								</label>
								<input
									type="password"
									className="input w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent"
									value={newPassword}
									onChange={(e) =>
										setNewPassword(e.target.value)
									}
									required
								/>
							</div>
							<div>
								<label className="text-sm font-semibold">
									Confirmar nueva contraseña
								</label>
								<input
									type="password"
									className="input w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
									required
								/>
							</div>
							<button
								type="submit"
								className="btn btn-add mt-2 w-full hover:scale-[1.02] transition-transform"
							>
								Actualizar contraseña
							</button>
						</form>
					</div>
				</div>

				{/* COLUMNA DERECHA */}
				<div className="space-y-6">
					{/* COMERCIOS ASOCIADOS */}
					<div className="card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
						<h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
							<Building2 size={20} className={iconClass} />
							Comercios asociados
						</h2>
						{user.commerces?.length ? (
							user.commerces.map((c: any) => (
								<div
									key={c.id}
									className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 last:border-0 last:mb-0"
								>
									<h3 className="font-semibold text-base">
										{c.name}
									</h3>
									<p className="text-[var(--color-text-secondary)] text-sm">
										{c.email}
									</p>
									<p className="text-sm">{c.address}</p>
									{c.data?.website && (
										<a
											href={c.data?.website}
											target="_blank"
											rel="noopener noreferrer"
											className="font-semibold text-[var(--color-primary)] hover:underline transition-colors"
										>
											{c.data?.website}
										</a>
									)}
								</div>
							))
						) : (
							<p className="text-[var(--color-text-secondary)]">
								No está asociado a ningún comercio.
							</p>
						)}
					</div>

					{/* PREFERENCIAS */}
					<div className="card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
						<h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
							<Palette size={20} className={iconClass} />
							Preferencias
						</h2>
						<div className="space-y-3">
							<p>
								<strong>Modo de interfaz:</strong>{" "}
								<span className="text-[var(--color-text-secondary)]">
									Automático (según sistema)
								</span>
							</p>
							<div className="flex items-center justify-between">
								<div>
									<strong>Notificaciones:</strong>{" "}
									<span className="text-[var(--color-text-secondary)]">
										{notificationsEnabled
											? "Activadas"
											: "Desactivadas"}
									</span>
								</div>
								<button
									type="button"
									onClick={() =>
										setNotificationsEnabled(
											!notificationsEnabled
										)
									}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
										notificationsEnabled
											? "text-[var(--color-primary)] hover:opacity-80"
											: "text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)]"
									}`}
								>
									{notificationsEnabled ? (
										<>
											<Bell size={16} /> Desactivar
										</>
									) : (
										<>
											<BellOff size={16} /> Activar
										</>
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Profile;
