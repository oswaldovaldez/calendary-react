import { useParams } from "@tanstack/react-router";
import { useAuthStore } from "../../store/auth.store";
import type { AppointmentType } from "../../types";
import { useEffect, useState } from "react";
import { Api } from "../../services/api";
// import { useNotificationStore } from "../../store/notification.store";

import { RecordsIndex } from "../records";

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

const Show = () => {
  const { appointmentId } = useParams({ from: "/appointments/$appointmentId" });
  const token = useAuthStore((state) => state.token);

  const [appointment, setappointment] = useState<AppointmentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);
  // const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    // Función para obtener los datos de la cita
    Api.showAppointment({
      _token: `${token}`,
      appointment_id: Number(appointmentId),
    })
      .then((response) => {
        if (!isMounted) return;
        setappointment(response as AppointmentType);
        setError(null);
      })
      .catch((err) => {
        console.error("Error cargando la cita", err);
        if (!isMounted) return;
        setError("No pudimos cargar la cita");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      setIsMounted(false);
    };
  }, [appointmentId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando cita...</div>;
  }

  if (error || !appointment) {
    return (
      <div className="card neumo p-6">{error ?? "Cita no encontrada"}</div>
    );
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h4 className="mb-0">Detalles de la Cita #{appointment.id}</h4>
      </div>
      <div className="card-body">
        <div className="row mb-3">
          <div className="col-md-6">
            <h5 className="fw-bold text-secondary">Información general</h5>
            <p>
              <strong>Nombre:</strong> {appointment.name}
            </p>
            <p>
              <strong>Descripción:</strong>
              {appointment.description || "Sin descripción"}
            </p>
            <p>
              <strong>Estado:</strong>
              <span
                className={`badge ms-2 ${
                  appointment.status === "completed"
                    ? "bg-success"
                    : appointment.status === "pending"
                      ? "bg-warning"
                      : "bg-secondary"
                }`}
              >
                {appointment.status}
              </span>
            </p>
            {appointment.notes && (
              <p>
                <strong>Notas:</strong> {appointment.notes}
              </p>
            )}
          </div>

          <div className="col-md-6">
            <h5 className="fw-bold text-secondary">Horario</h5>
            <p>
              <strong>Inicio:</strong> {formatDateTime(appointment.start_at)}
            </p>
            <p>
              <strong>Fin:</strong> {formatDateTime(appointment.end_at)}
            </p>
            <p>
              <strong>Día laboral:</strong> {appointment.schedule?.day_of_week}
            </p>
            <p>
              <strong>Horario del día:</strong>
              {appointment.schedule?.start_time} -
              {appointment.schedule?.end_time}
            </p>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h5 className="fw-bold text-secondary">
              Profesional / Responsable
            </h5>
            <div className="card border-0 bg-light">
              <div className="card-body">
                <p>
                  <strong>Nombre:</strong> {appointment.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {appointment.user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <h5 className="fw-bold text-secondary">Cliente / Paciente</h5>
            <div className="card border-0 bg-light">
              <div className="card-body">
                <p>
                  <strong>Nombre:</strong> {appointment.patient?.first_name}
                  {appointment.patient?.last_name}
                </p>
                <p>
                  <strong>Saldo a favor:</strong>{" "}
                  {appointment.patient?.wallet?.balance}
                </p>
                <p>
                  <strong>Correo:</strong> {appointment.patient?.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {appointment.patient?.phone}
                </p>
                <p>
                  <strong>Edad aprox.:</strong>
                  {new Date().getFullYear() -
                    new Date(
                      appointment.patient?.birth_date ?? ""
                    ).getFullYear()}
                  años
                </p>
                <p>
                  <strong>Tipo de sangre:</strong>
                  {appointment.patient?.data?.blood_type}
                </p>
                {appointment.patient && (
                  <RecordsIndex patient={appointment.patient} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <h5 className="fw-bold text-secondary">Servicio</h5>
            <div className="card border-0 bg-light">
              <div className="card-body">
                <p>
                  <strong>Nombre:</strong> {appointment.service?.name}
                </p>
                <p>
                  <strong>Duración:</strong> {appointment.service?.duration}
                  {appointment.service?.duration_type}
                </p>
                <p>
                  <strong>Precio:</strong> ${appointment.service?.price}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <h5 className="fw-bold text-secondary">Comercio / Sucursal</h5>
            <div className="card border-0 bg-light">
              <div className="card-body">
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
        </div>

        <div className="text-end">
          <button className="btn btn-outline-primary me-2">
            Generar Orden
          </button>
        </div>
      </div>
    </div>
  );
};

export default Show;
