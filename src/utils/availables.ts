import type { UserType, ServiceType, ScheduleType, AppointmentType } from '../types/index';


interface SlotType {
  start: string;
  end: string;
}

interface AvailabilityResponse {
  fecha: string;
  disponibles: SlotType[];
  hora?: string;
  error?: string;
  message?: string;
}

/**
 * Verifica si existe disponibilidad (TRUE/FALSE) para un usuario/comercio, servicio y hora específicos.
 *
 * @param user Usuario o comercio
 * @param service Servicio (o null para la duración base)
 * @param startAt Fecha y hora específica a verificar (ej: '2025-10-27 15:00:00')
 * @returns Retorna TRUE si el slot exacto está disponible, FALSE en caso contrario
 */
export function isAvailableUser(
  user: UserType,
  service: ServiceType | null,
  startAt: string
): boolean {
  // 1. Obtener la disponibilidad usando la función existente
  // Usamos withHours = false porque solo nos interesa la lista de slots disponibles
  const availabilityData = calculateAvailability(user, service, startAt, false);

  // 2. Manejo de Errores/Excepciones iniciales (Usuario, Horario)
  // Si hay un error de usuario/comercio o si no hay horario configurado, no está disponible
  if (availabilityData.error || availabilityData.message) {
    return false;
  }

  // 3. Obtener la hora de inicio a verificar
  const targetDate = new Date(startAt);
  const targetTime = `${targetDate.getHours().toString().padStart(2, '0')}:${targetDate.getMinutes().toString().padStart(2, '0')}`;

  // 4. Buscar si la hora exacta solicitada está en la lista de slots disponibles
  const isSlotAvailable = availabilityData.disponibles.some(
    (slot) => slot.start === targetTime
  );

  return isSlotAvailable;
}

/**
 * Método centralizado para calcular disponibilidad
 */
function calculateAvailability(
  user: UserType,
  service: ServiceType | null,
  startAt: string,
  withHours: boolean = false
): AvailabilityResponse {
  const startDate = new Date(startAt);
  
  // Obtener el día de la semana en inglés (lowercase)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[startDate.getDay()];

  // Buscar el horario del usuario para ese día
  const schedule = user.schedules?.find((s) => s.day_of_week === day);

  if (!schedule) {
    return { 
      fecha: startDate.toISOString().split('T')[0],
      disponibles: [], 
      message: 'Sin horario configurado para este día' 
    };
  }

  // Duración base
  let duration = 30;
  let durationType = 'minutes';

  // Si hay servicio, usamos su duración
  if (service) {
    duration = service.duration;
    durationType = service.duration_type;
  }

  // Obtener citas existentes del usuario para esa fecha
  // NOTA: En una app real, estas citas vendrían de una API o base de datos
  // Aquí asumimos que vienen como parámetro o de un store/context
  const appointments: Array<{ start: Date; end: Date }> = [];
  // TODO: Implementar obtención de citas según tu arquitectura
  // Por ejemplo: const appointments = await fetchAppointments(user.id, startDate);

  // Generar todos los bloques disponibles
  const slots = getAvailableSlots(
    schedule,
    startDate.toISOString().split('T')[0],
    duration,
    durationType
  );

  // Filtrar los ocupados
  const availableSlots = slots.filter((slot) => {
    const slotStart = new Date(`${startDate.toISOString().split('T')[0]} ${slot.start}`);
    const slotEnd = new Date(`${startDate.toISOString().split('T')[0]} ${slot.end}`);

    for (const appt of appointments) {
      if (slotStart < appt.end && slotEnd > appt.start) {
        return false;
      }
    }
    return true;
  });

  const response: AvailabilityResponse = {
    fecha: startDate.toISOString().split('T')[0],
    disponibles: availableSlots,
  };

  if (withHours) {
    response.hora = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
  }

  return response;
}

/**
 * Genera los bloques de tiempo (slots) entre el horario del usuario
 */
function getAvailableSlots(
  schedule: ScheduleType,
  date: string,
  duration: number,
  durationType: string
): SlotType[] {
  const slots: SlotType[] = [];
  
  const current = new Date(`${date} ${schedule.start_time}`);
  const end = new Date(`${date} ${schedule.end_time}`);

  while (current < end) {
    const next = generateEndAt(current, duration, durationType);
    if (next > end) break;

    slots.push({
      start: `${current.getHours().toString().padStart(2, '0')}:${current.getMinutes().toString().padStart(2, '0')}`,
      end: `${next.getHours().toString().padStart(2, '0')}:${next.getMinutes().toString().padStart(2, '0')}`,
    });

    current.setTime(next.getTime());
  }

  return slots;
}

/**
 * Genera la hora de finalización basada en la duración
 */
function generateEndAt(
  startDate: Date,
  duration: number,
  durationType: string
): Date {
  const endDate = new Date(startDate);
  
  switch (durationType) {
    case 'minutes':
      endDate.setMinutes(endDate.getMinutes() + duration);
      break;
    case 'hours':
      endDate.setHours(endDate.getHours() + duration);
      break;
    case 'days':
      endDate.setDate(endDate.getDate() + duration);
      break;
    default:
      endDate.setMinutes(endDate.getMinutes() + duration);
  }
  
  return endDate;
}

// Ejemplo de uso:
// const user: UserType = { ... };
// const service: ServiceType = { ... };
// const isAvailable = isAvailableUser(user, service, '2025-10-27 15:00:00');
// console.log(isAvailable); // true o false