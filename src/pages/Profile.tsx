import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import {
  ShieldUser,
  Mail,
  CalendarDays,
  Building2,
  // Lock,
} from "lucide-react";
// Palette,
// Bell,
// BellOff,
import UserServicesComponent from "../components/UserServicesComponent";
import { Api } from "../services/api";
import { useNotificationStore } from "../store/notification.store";
import { Link } from "@tanstack/react-router";
import { NonWorkingDaysIndex } from "./on-working-days";
import { SchedulesIndex } from "./schedules";

const Profile: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  // const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // const [currentPassword, setCurrentPassword] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [services, setServices] = useState([]);
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const commerce = useAuthStore((s) => s.commerce);
  const syncService = (values: any) => {
    console.log("sync", values);
    Api.syncServices({
      _token: `${token}`,
      userId: user.id,
      services: values,
    })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    Api.readServices({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}`, all: "true" },
    })
      .then((res: any) => {
        setServices(res);
      })
      .catch(console.log);
  }, []);
  if (!user) {
    return (
      <div className="text-center mt-10 text-[var(--color-text-secondary)]">
        Cargando información...
      </div>
    );
  }

  // const handleChangePassword = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log({ currentPassword, newPassword, confirmPassword });
  // };

  // const iconClass =
  //   "text-[var(--color-primary)] dark:text-[hsl(145,85%,85%)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]";

  return (
    <main className="w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col gap-8 p-4 md:p-8">
      {/* === ENCABEZADO === */}
      <section className="flex flex-col md:flex-row items-center md:items-end md:justify-between gap-6 pb-6">
        <div className="flex items-center gap-6 w-full">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center bg-[var(--color-primary)/10]">
            <ShieldUser
              size={56}
              className={`opacity-90 dark:opacity-100`}
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
                <Mail size={14}  />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays size={14}  />
                <span>
                  Registrado el{" "}
                  {new Date(user.created_at).toLocaleDateString("es-MX")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Botón Editar perfil */}
        <Link
          to={`/users/${user.id}`}
          className="btn btn-add mt-2 hover:scale-[1.02] transition-transform whitespace-nowrap"
        >
          Editar perfil
        </Link>
        {/* <button
          className=""
        >
          Editar perfil
        </button> */}
      </section>

      {/* === SECCIONES PRINCIPALES === */}
      <section className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8">
        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-6">
          {/* INFORMACIÓN GENERAL */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <ShieldUser size={20}  />
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
                  backgroundColor: user.data?.calendar_color || "#ccc",
                }}
                title={user.data?.calendar_color}
              ></span>
              <span className="text-sm text-[var(--color-text-secondary)]">
                {user.data?.calendar_color || "Sin color definido"}
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
          {/* <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Lock size={20}  />
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
                  onChange={(e) => setCurrentPassword(e.target.value)}
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
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-row justify-end">
                <button
                  type="submit"
                  className="btn btn-add mt-2 hover:scale-[1.02] transition-transform"
                >
                  Actualizar contraseña
                </button>
              </div>
            </form>
          </div> */}
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          {/* COMERCIOS ASOCIADOS */}
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Building2 size={20}  />
              Comercios asociados
            </h2>
            {user.commerces?.length ? (
              user.commerces.map((c: any) => (
                <div
                  key={c.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 last:border-0 last:mb-0"
                >
                  <h3 className="font-semibold text-base">{c.name}</h3>
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
          {/* <div className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Palette size={20}  />
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
                    {notificationsEnabled ? "Activadas" : "Desactivadas"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
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
          </div> */}
        </div>
      </section>
      <UserServicesComponent
        user={user}
        services={services}
        handleOnSubmit={syncService}
      />
      <div className="card neumo mt-4">
                <div className="card-header">
                  <h3>Horarios</h3>
                </div>
                <div className="card-body">
                  <SchedulesIndex
                    userId={user.id}
                    scheduleArray={user.schedules??[]}
                  />
                </div>
              </div>
      <div className="card">
              <div className="card-header">
                <h2> Dias No Laborables</h2>
              </div>
              <div className="card-body">
                <NonWorkingDaysIndex userId={user.id} />
              </div>
            </div>
    </main>
  );
};

export default Profile;
