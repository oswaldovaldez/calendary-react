import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import type { AppointmentType } from "../../types";
import FormAppointment from "./FormAppointment";

/**
 * Convierte una fecha y hora local (string) a un formato ISO 8601 con offset de zona horaria.
 * Esto asegura que el backend de Laravel sepa exactamente a qué hora local se refiere.
 *
 * @param date - String de fecha (ej. "2025-10-08")
 * @param time - String de hora (ej. "13:35" o "13:35:00")
 * @returns String en formato ISO con offset (ej. "2025-10-08T13:35:00-06:00")
 */
export const toLaravelTimestamp = (date: string, time: string): string => {
  // 1. Unir la fecha y la hora en un formato que Date() pueda entender
  // El formato "YYYY-MM-DD HH:MM:SS" se interpreta como hora local.
  const fullDateTime = `${date} ${time}`;

  // 2. Crear el objeto Date local
  const localDate = new Date(fullDateTime);

  // Verificamos si la fecha es válida
  if (isNaN(localDate.getTime())) {
    console.error("Fecha y hora inválidas:", fullDateTime);
    // Devuelve la cadena original o lanza un error
    return fullDateTime;
  }

  // 3. Obtener el offset de zona horaria en minutos
  // Nota: getTimezoneOffset() devuelve la diferencia en minutos entre UTC y la hora local.
  // En GMT-6, devuelve 360 (minutos)
  const offsetMinutes = localDate.getTimezoneOffset();

  // 4. Determinar el signo (+ o -) y formatear el offset (HH:MM)
  const sign = offsetMinutes < 0 ? "+" : "-";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMins = String(absOffset % 60).padStart(2, "0");

  const offsetString = `${sign}${offsetHours}:${offsetMins}`;

  // 5. Formatear la fecha y hora local (YYYY-MM-DDTHH:MM:SS)
  const localIso =
    localDate.getFullYear() +
    "-" +
    String(localDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(localDate.getDate()).padStart(2, "0") +
    "T" +
    String(localDate.getHours()).padStart(2, "0") +
    ":" +
    String(localDate.getMinutes()).padStart(2, "0") +
    ":" +
    String(localDate.getSeconds()).padStart(2, "0");

  // 6. Concatenar y devolver la cadena ISO 8601 con el offset
  return `${localIso}${offsetString}`;
};

export const extractId = (value: string): number => {
  // console.log(value);
  const idPart = value.split(" - ")[0]; // Toma lo que está antes del " - "
  const id = Number(idPart); // Convierte a número
  return isNaN(id) ? 0 : id; // Retorna 0 si no es un número válido
};

const AppointmentsCreate = ({ onClosex, reload }: any) => {
  const initialValues = {};
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);
  const token = useAuthStore((s) => s.token);

  const onSubmit = (values: any) => {
    //console.log(values);
    const data: AppointmentType = {
      commerce_id: commerce?.id ?? 0,
      user_id: extractId(values.user_id),
      service_id: extractId(values.service_id),
      patient_id: extractId(values.patient_id),
      description: values.description,
      status: "scheduled",
      start_at: toLaravelTimestamp(values.date, values.start_time),
      end_at: toLaravelTimestamp(values.date, values.end_time),
      name: values.name,
      notes: values.notes ?? null,
    };
    //console.log(data);
    Api.createAppointment({
      ...data,
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
    //console.log(data);
  };
  return <FormAppointment initialValues={initialValues} onSubmit={onSubmit} />;
};

export default AppointmentsCreate;
