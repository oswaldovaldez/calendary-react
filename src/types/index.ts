export interface UserType {
 commerces?:         CommerceType[]|null;
 created_at?:        Date|string;
 data?:              any[]|null;
 password?:         string|null;
 deleted_at?:        Date|null;
 email:             string;
 email_verified_at?: Date|string;
 id?:                number;
 name:              string;
 permissions?:       any[];
 record_templates?: RecordTemplateType[];
 roles?:             RoleType|any[];
 updated_at?:        Date|string;
}


export interface RecordTemplateType {
 commerce_id: number;
 created_at:  Date;
 deleted_at:  null;
 fields:      FieldType[];
 id:          number;
 name:        string;
 pivot:       RecordTemplatePivotType;
 updated_at:  Date;
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
 created_at:  Date;
 data:        any[]|null;
 deleted_at:  Date|null;
 description: string|null;
 email:       string|null;
 id:          number;
 image:       string|null;
 name:        string;
 phone:       string|null;
 pivot:       CommercePivotType;
 record_templates?: RecordTemplateType[];
 slug:        string;
 updated_at:  Date;
}

export interface CommercePivotType {
 commerce_id: number;
 created_at:  Date;
 is_active:   boolean;
 permissions: PermissionsType;
 role:        string;
 updated_at:  Date;
 user_id:     number;
}
export interface PermissionsType {
 appointments: boolean;
 billing:      boolean;
 patients:     boolean;
 reports:      boolean;
}

export interface RoleType {
 created_at: Date;
 guard_name: string;
 id:         number;
 name:       string;
 pivot:      RolePivotType;
 updated_at: Date;
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
 created_at:  Date;
 deleted_at:  Date|null;
 description: string|null;
 id:          number;
 name:        string;
 parent_id:   number|null;
 slug:        string;
 status:      boolean;
 updated_at:  Date;
}


export interface PatientType {
 birth_date:  Date;
 commerce_id: number;
 created_at:  Date;
 data:        PatientDataType;
 deleted_at:  Date|null;
 email:       string;
 first_name:  string;
 gender:      string;
 id:          number;
 last_name:   string;
 phone:       string;
 records:     any[];
 record_templates?: RecordTemplateType[];
 updated_at:  Date;
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
 barcode:             string|null;
 brand:               string;
 category:            CategoryType|null;
 category_id:         number|null;
 commission:          string;
 cost:                string;
 created_at:          Date;
 deleted_at:          Date|null;
 description:         string;
 format:              string;
 id:                  number;
 image:               string|null;
 iva:                 number;
 name:                string;
 price:               string;
 price_with_discount: string;
 sku:                 string;
 slug:                string;
 status:              boolean;
 stock:               number;
 stock_alert:         number;
 updated_at:          Date;
}


export interface ServiceType {
 home_service:     boolean;
 category:         CategoryType;
 category_id:      number;
 created_at:       Date;
 deleted_at:       Date|null;
 description:      string;
 duration:         number;
 duration_type:    string;
 end_offer_at:     Date|null;
 id:               number;
 name:             string;
 options:          any[]|null;
 price:            string;
 price_offer:      string|null;
 session_number:   number;
 sessions:         boolean;
 slug:             string;
 start_offer_at:   null;
 updated_at:       Date;
}


export interface ScheduleType {
 breaks:      BreakType[];
 commerce_id: number;
 created_at:  Date;
 day_of_week: string;
 deleted_at:  Date|null;
 end_time:    string;
 id:          number;
 start_time:  string;
 updated_at:  Date;
 user:        UserType;
 user_id:     number;
}

export interface BreakType {
 end:   string;
 start: string;
}


export interface AppointmentType {
 commerce:    CommerceType;
 commerce_id: number;
 created_at:  Date;
 deleted_at:  Date|null;
 description: string;
 end_at:      Date;
 id:          number;
 name:        string;
 notes:       string|null;
 patient:     PatientType;
 patient_id:  number;
 schedule:    ScheduleType;
 schedule_id: number;
 service_id:  number;
 start_at:    Date;
 status:      string;
 updated_at:  Date;
 user:        UserType;
 user_id:     number;
}