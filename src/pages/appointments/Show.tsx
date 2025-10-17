import { useParams } from "@tanstack/react-router";
import { useAuthStore } from "../../store/auth.store";
import type { AppointmentType } from "../../types";
import { useEffect, useState } from "react";
import { Api } from "../../services/api";
import { RecordsIndex } from "../records";
import { Calendar, Clock, User, Briefcase } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Show = () => {
  const { appointmentId } = useParams({
    from: "/appointments/$appointmentId",
  });
  const token = useAuthStore((state) => state.token);

  const [appointment, setAppointment] = useState<AppointmentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    Api.showAppointment({
      _token: `${token}`,
      appointment_id: Number(appointmentId),
    })
      .then((response) => {
        if (!isMounted) return;
        setAppointment(response as AppointmentType);
        setError(null);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("No pudimos cargar la cita");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => setIsMounted(false);
  }, [appointmentId, token]);

  if (isLoading)
    return (
      <div className="card p-6 text-center text-[var(--color-text-secondary)]">
        Cargando cita...
      </div>
    );

  if (error || !appointment)
    return (
      <div className="card p-6 text-center text-[var(--color-text-secondary)]">
        {error ?? "Cita no encontrada"}
      </div>
    );

  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "confirmada":
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
      case "pendiente":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "confirmed":
        return "CONFIRMADO";
      case "pending":
        return "PENDIENTE";
      case "cancelled":
        return "CANCELADO";
      default:
        return status?.toUpperCase() || "SIN ESTADO";
    }
  };

  // 🎨 Íconos con contraste fuerte en dark mode
  const iconClass =
    "text-[var(--color-primary)] dark:text-[hsl(210,100%,95%)] dark:drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]";

  return (
    <main className="w-full bg-[var(--color-background)] text-[var(--color-text-primary)] flex flex-col gap-8 p-6 md:p-10">
      {/* === Encabezado principal === */}
      <section className="flex flex-col gap-3">
        {/* Nombre y descripción */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {appointment.name}
          </h1>
          {appointment.description && (
            <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-3xl">
              {appointment.description}
            </p>
          )}
        </div>

        {/* Fecha, hora, estado y botón compactos */}
        <div className="flex flex-wrap items-center justify-between mt-3 gap-3 border-b border-gray-200 pb-3">
          {/* Fecha y hora */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-secondary)] capitalize">
              <Calendar size={18} className={iconClass} />
              <span>{formatDate(appointment.start_at)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[var(--color-text-secondary)]">
              <div className="flex items-center gap-1.5">
                <Clock size={16} className={iconClass} />
                <span className="font-medium">
                  {formatTime(appointment.start_at)} –{" "}
                  {formatTime(appointment.end_at)}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(
                  appointment.status
                )}`}
              >
                {getStatusLabel(appointment.status)}
              </span>
            </div>
          </div>

          {/* Botón al nivel derecho */}
          <button className="btn btn-add px-4 py-2 text-sm hover:scale-[1.02] transition-transform">
            Generar orden
          </button>
        </div>
      </section>

      {/* === grid principal === */}
      <div className="grid lg:grid-cols-3 gap-8 mt-2">
        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paciente */}
          <div className="card p-6 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className={iconClass} />
              <h2 className="font-semibold text-lg">Paciente</h2>
            </div>
            <p>
              <strong>Nombre:</strong> {appointment.patient?.first_name}{" "}
              {appointment.patient?.last_name}
            </p>
            <p>
              <strong>Saldo a favor:</strong>{" "}
              {appointment.patient?.wallet?.balance ?? 0}
            </p>
            <p>
              <strong>Correo:</strong> {appointment.patient?.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {appointment.patient?.phone}
            </p>
            {appointment.patient?.birth_date && (
              <p>
                <strong>Edad:</strong>{" "}
                {new Date().getFullYear() -
                  new Date(appointment.patient.birth_date).getFullYear()}{" "}
                años
              </p>
            )}
            <p>
              <strong>Tipo de sangre:</strong>{" "}
              {appointment.patient?.data?.blood_type ?? "No especificado"}
            </p>

            {appointment.patient && (
              <div className="border-t border-gray-200 mt-4 pt-4">
                <RecordsIndex patient={appointment.patient} />
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          {/* Servicio */}
          <div className="card p-6 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={20} className={iconClass} />
              <h2 className="font-semibold text-lg">Servicio</h2>
            </div>
            <p>
              <strong>Nombre:</strong> {appointment.service?.name}
            </p>
            <p>
              <strong>Duración:</strong> {appointment.service?.duration}{" "}
              {appointment.service?.duration_type}
            </p>
            <p>
              <strong>Precio:</strong> ${appointment.service?.price}
            </p>
          </div>

          {/* Profesional */}
          <div className="card p-6 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className={iconClass} />
              <h2 className="font-semibold text-lg">
                Profesional / Responsable
              </h2>
            </div>
            <p>
              <strong>Nombre:</strong> {appointment.user?.name}
            </p>
            <p>
              <strong>Email:</strong> {appointment.user?.email}
            </p>
          </div>

          {/* Comercio */}
          <div className="card p-6 shadow-sm rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={20} className={iconClass} />
              <h2 className="font-semibold text-lg">Comercio / Sucursal</h2>
            </div>
            <p>
              <strong>Nombre:</strong> {appointment.commerce?.name}
            </p>
            <p>
              <strong>Email:</strong> {appointment.commerce?.email}
            </p>
            <p>
              <strong>Teléfono:</strong> {appointment.commerce?.phone}
            </p>
            <p>
              <strong>Dirección:</strong> {appointment.commerce?.address}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Show;
