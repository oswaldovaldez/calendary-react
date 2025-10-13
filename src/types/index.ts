export interface UserType {
 commerces?:         CommerceType[]|null;
 created_at?:        string;
 data?:              any[]|null;
 password?:         string|null;
 deleted_at?:        Date|null;
 email:             string;
 email_verified_at?: string;
 id?:                number;
 name:              string;
 permissions?:       any[];
 record_templates?:  RecordTemplateType[];
 services?:  ServiceType[];
 roles?:             RoleType|any[];
 role?:               number;
 schedules?:          ScheduleType[];
 updated_at?:        string;
}


export interface RecordTemplateType {
 commerce_id: number;
 created_at?:  string;
 deleted_at?:  null;
 fields:      FieldType[]|null;
 id?:          number;
 name:        string;
 pivot?:       RecordTemplatePivotType;
 updated_at?:  string;
}

export interface FieldType {
 label:    string;
 max?:     number;
 min?:     number;
 options?: string[];
 pattern?: string;
 required: boolean;
 type:     string;
}

export interface RecordTemplatePivotType {
 model_id:           number;
 model_type:         string;
 record_template_id: number;
}



export interface CommerceType {
 address:     string|null;
 created_at?:  string;
 data:        any[]|null;
 deleted_at?:  Date|null;
 description: string|null;
 email:       string|null;
 id?:          number;
 image?:       string|null;
 name:        string;
 phone:       string|null;
 pivot?:       CommercePivotType;
 record_templates?: RecordTemplateType[];
 slug?:        string;
 updated_at?:  string;
 user?:        UserType;
 users?:       any;
}

export interface CommercePivotType {
 commerce_id: number;
 created_at?:  string;
 is_active:   boolean;
 permissions: PermissionsType;
 role:        string;
 updated_at?:  string;
 user_id:     number;
}
export interface PermissionsType {
 appointments: boolean;
 billing:      boolean;
 patients:     boolean;
 reports:      boolean;
}

export interface RoleType {
 created_at?: string;
 guard_name: string;
 id:         number;
 name:       string;
 pivot:      RolePivotType;
 updated_at?: string;
}

export interface RolePivotType {
 model_id:   number;
 model_type: string;
 role_id:    number;
}

export interface CategoryType {
 _lft:        number;
 _rgt:        number;
 children:    any[];
 commerce_id: number;
 created_at?:  string;
 deleted_at?:  Date|null;
 description: string|null;
 id:          number;
 name:        string;
 parent_id:   number|null;
 slug:        string;
 status:      boolean;
 updated_at?:  string;
}


export interface PatientType {
 birth_date:  string;
 commerce_id?: number;
 created_at?:  string;
 data:        any;
 deleted_at?:  Date|null;
 email:       string;
 first_name:  string;
 gender:      string;
 id?:          number;
 last_name:   string;
 phone:       string;
 records?:     any[];
 record_templates?: RecordTemplateType[];
  updated_at?: string;
  wallet?:      any;
}

export interface PatientDataType {
 alcohol_use:         string;
 allergies:           string[];
 blood_type:          string;
 chronic_conditions:  any[];
 current_medications: string[];
 emergency_contact:   EmergencyContactType;
 insurance:           InsuranceType;
 smoker:              boolean;
 vaccination_status:  object;
}

export interface EmergencyContactType {
 name:         string;
 phone:        string;
 relationship: string;
}

export interface InsuranceType {
 policy_number: string;
 provider:      string;
}

export interface ProductType {
 active:              boolean;
 barcode?:             string|null;
 brand:               string;
 categories:            Array<CategoryType|number>|null;
 category_id?:         number|null;
 commission:          string;
 cost:                string;
 created_at?:          string;
 deleted_at?:          Date|null;
 description:         string;
 format:              string;
 id?:                  number;
 image:               string|null;
 iva:                 number;
 name:                string;
 price:               string;
 price_with_discount: string;
 sku:                 string;
 slug?:                string;
 status:              boolean;
 stock:               number;
 stock_alert:         number;
 updated_at?:          string;
}


export interface ServiceType {
 home_service:     boolean;
 categories:         Array<CategoryType|number>;
 category_id?:      number;
 created_at?:       string;
 deleted_at?:       Date|null;
 description:      string;
 duration:         number;
 duration_type:    string;
 end_offer_at:     string|Date|null;
 id?:               number;
 name:             string;
  options: any[] | null;
  commerce_id:      number;
 price:            string|number;
 price_offer:      string|number|null;
 session_number:   number;
 sessions:         boolean;
 slug?:             string;
 start_offer_at:   string|Date|null;
 updated_at?:       string;
}


export interface ScheduleType {
 breaks:      BreakType[];
 commerce_id: number;
 created_at?:  string;
 day_of_week: string;
 deleted_at?:  Date|null;
 end_time:    string;
 id:          number;
 start_time:  string;
 updated_at?:  string;
 user?:        UserType;
 user_id:     number;
}

export interface BreakType {
 end:   string;
 start: string;
}


export interface AppointmentType {
 commerce?:    CommerceType;
 commerce_id: number;
 created_at?:  string;
 deleted_at?:  Date|null;
 description: string;
 end_at:      string;
 id?:          number;
 name:        string;
 notes?:       string;
 patient?:     PatientType;
 patient_id:  number;
 schedule?:    ScheduleType;
 schedule_id?: number;
 service?:     ServiceType;
 service_id:  number;
 start_at:    string;
 status:      string;
 updated_at?:  string;
 user?:        UserType;
  user_id: number;
  
}

export const diasES: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export const RECORD_TYPES = [
  // 🩺 Salud / Médico
  { value: "medico", label: "Consulta médica" },
  { value: "odontologia", label: "Tratamiento odontológico" },
  { value: "psicologia", label: "Sesión psicológica" },
  { value: "nutricion", label: "Consulta de nutrición" },
  { value: "fisioterapia", label: "Sesión de fisioterapia" },
  { value: "estetica", label: "Tratamiento estético" },
  { value: "laboratorio", label: "Estudio de laboratorio" },
  { value: "seguimiento_postquirurgico", label: "Seguimiento post quirúrgico" },
  { value: "control_paciente", label: "Control de paciente" },

  // 🏢 Empresa / Recursos Humanos / Administración
  { value: "recursos_humanos", label: "Recursos Humanos" },
  { value: "entrevista", label: "Entrevista laboral" },
  { value: "evaluacion_desempeno", label: "Evaluación de desempeño" },
  { value: "capacitacion", label: "Capacitación o entrenamiento" },
  { value: "cliente", label: "Seguimiento de cliente" },
  { value: "proveedor", label: "Gestión de proveedor" },
  { value: "reunion", label: "Reunión de trabajo" },
  { value: "ticket_soporte", label: "Ticket de soporte" },

  // 🏠 Inmobiliario
  { value: "inmobiliario", label: "Gestión inmobiliaria" },
  { value: "propiedad", label: "Ficha de propiedad" },
  { value: "visita", label: "Visita a propiedad" },
  { value: "contrato", label: "Contrato de renta o venta" },
  { value: "mantenimiento", label: "Registro de mantenimiento" },
  { value: "avaluo", label: "Avalúo o tasación" },

  // 🎓 Educación
  { value: "clase", label: "Clase o sesión" },
  { value: "curso", label: "Curso o programa" },
  { value: "alumno", label: "Ficha de alumno" },
  { value: "evaluacion", label: "Evaluación académica" },
  { value: "asistencia", label: "Registro de asistencia" },
  { value: "tutoria", label: "Sesión de tutoría" },

  // 💼 Servicios / Profesionales
  { value: "asesoria", label: "Asesoría profesional" },
  { value: "consultoria", label: "Consultoría" },
  { value: "cita_tecnica", label: "Cita técnica" },
  { value: "proyecto", label: "Proyecto o actividad" },
  { value: "servicio_cliente", label: "Atención al cliente" },
  { value: "instalacion", label: "Instalación o configuración" },

  // ⚙️ General / Otros
  { value: "agenda_general", label: "Agenda general" },
  { value: "tarea", label: "Tarea o pendiente" },
  { value: "seguimiento", label: "Seguimiento general" },
  { value: "nota", label: "Nota libre" },
  { value: "evento", label: "Evento o recordatorio" },
  { value: "reporte", label: "Reporte o bitácora" },
  { value: "otro", label: "Otro tipo de registro" },
];
