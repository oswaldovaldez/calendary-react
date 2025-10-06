import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import type { AppointmentType } from "../../types";
import { extractId, toLaravelTimestamp } from "./Create";
import FormAppointment from "./FormAppointment";

interface EditProps {
  event: AppointmentType | null;
  reload: () => void;
  onClosex: (status: boolean) => void;
}

const TARGET_TIMEZONE = "America/Mexico_City";

/**
 * Extrae y formatea la fecha o la hora de un string UTC (ISO 8601),
 * convirtiéndola a la hora local deseada.
 * * @param dateTimeString - El string de fecha y hora UTC (ej. "2025-10-13T19:08:00.000000Z").
 * @param formatType - Especifica si quieres la 'date' (YYYY-MM-DD para input) o la 'time' (HH:MM).
 * @returns La fecha o la hora extraída en la zona horaria local.
 */
function extractDateTime(
  dateTimeString: string,
  formatType: "date" | "time"
): string {
  // 1. Validaciones
  if (!dateTimeString || typeof dateTimeString !== "string") {
    return "Error: String de fecha/hora inválido.";
  }

  // 2. Crear el objeto Date (interpreta la 'Z' como UTC)
  const dateObject = new Date(dateTimeString);

  if (isNaN(dateObject.getTime())) {
    return "Error: Formato de fecha/hora inválido.";
  }

  // 3. Lógica de formateo
  if (formatType === "date") {
    // --- CAMBIO CLAVE PARA OBTENER YYYY-MM-DD ---

    // Usamos el locale 'en-CA' (Inglés canadiense) porque su toLocaleDateString()
    // produce de manera confiable el formato ISO 8601 (YYYY-MM-DD) sin la hora.
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: TARGET_TIMEZONE,
    };

    // El resultado directo es YYYY-MM-DD, que es lo que el input date espera.
    return dateObject.toLocaleDateString("en-CA", options);

    // --- FIN DEL CAMBIO ---
  } else if (formatType === "time") {
    // La lógica de la hora sigue siendo la misma.
    const options: Intl.DateTimeFormatOptions = {
      timeZone: TARGET_TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Usar formato 24 horas (HH:MM)
    };
    // Devolver la hora formateada (ej: 13:08)
    return dateObject.toLocaleTimeString("es-MX", options);
  }

  return 'Error: Parámetro formatType debe ser "date" o "time".';
}

const AppointmentsEdit = ({ event, reload, onClosex }: EditProps) => {
  // console.log(event, extractDateTime(event.start_at, "date"));
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);
  const token = useAuthStore((s) => s.token);
  if (!event) return <div>No event selected</div>;
  const initialValues = {
    name: event.name,
    user_id: event.user_id ? `${event.user_id} - ${event.user?.name}` : "",
    service_id: event.service_id
      ? `${event.service_id} - ${event.service?.name}`
      : "",
    patient_id: event.patient_id
      ? `${event.patient_id} - ${event.patient?.first_name} ${event.patient?.last_name}`
      : "",
    description: event.description,
    status: event.status,
    date: event.start_at ? extractDateTime(event.start_at, "date") : "",
    start_time: event.start_at ? extractDateTime(event.start_at, "time") : "",
    end_time: event.end_at ? extractDateTime(event.end_at, "time") : "",
    notes: event.notes || "",
  };

  const onSubmit = (values: any) => {
    //console.log(values);
    const data: AppointmentType = {
      id: event.id,
      commerce_id: commerce?.id ?? 0,
      user_id: extractId(values.user_id),
      service_id: extractId(values.service_id),
      patient_id: extractId(values.patient_id),
      description: values.description,
      status: values.status,
      start_at: toLaravelTimestamp(values.date, values.start_time),
      end_at: toLaravelTimestamp(values.date, values.end_time),
      name: values.name,
      notes: values.notes ?? null,
    };

    // console.log(data);
    Api.updateAppointment({
      ...data,
      appointment_id: event.id ?? 0,
      notes: data.notes === undefined ? null : data.notes,
      _token: `${token}`,
    })
      .then((res) => {
        reload();
        onClosex(true);
        setTimeout(() => {
          notify("success", res.message);
        }, 200);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <FormAppointment
      isEdit={true}
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
};

export default AppointmentsEdit;
