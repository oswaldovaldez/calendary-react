/* eslint-disable @typescript-eslint/no-explicit-any */
// api.ts
const API_URL = import.meta.env.API_URL || "http://168.231.69.210:9998/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"| "PATCH";

interface RequestOptions<T> {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
  query?: Record<string, string>;
}
interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}


function buildQueryParams(query?: Record<string, string>): string {
  if (!query) return "";
  const params = new URLSearchParams(query);
  return `?${params.toString()}`;
}

export async function apiFetch<T = any, B = any>(
  endpoint: string,
  options: RequestOptions<B> = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, query = {} } = options;
  const params = buildQueryParams(query);
  const res = await fetch(`${API_URL}${endpoint}${params}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}



//create,read,update,delete,show
// Ejemplos de consultas
export const Api = {
  existUser:()=> apiFetch("/exist-user"),
  registerUser:(data:{name:string,email:string,password:string,commerce:string})=> apiFetch("/register",{method:"POST",body:data}),
  login:(data:{email:string,password:string})=>apiFetch('/login',{method:'POST',body:data}),
  logout: (data: { user_id: number,_token:string }) => apiFetch('/auth/logout', { method: 'POST', body: data,headers: {Authorization:`Bearer ${data._token}`} }),

  //crud usuarios
  createUser:(data:{name:string,email:string,password:string,role:string,commerce_id:number|null,_token:string})=>apiFetch('/users',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readUsers: (data: { _token: string,query:Record<string, string> }) => apiFetch(`/users`, { method: 'GET', headers: {Authorization:`Bearer ${data._token}`},query:data.query }),
  updateUser:(data:{name:string,email:string,password?:string,role:string,commerce_id?:number|null,user_id:number,_token: string})=>apiFetch(`/users/${data.user_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteUser:(data:{user_id:number,_token: string})=>apiFetch(`/users/${data.user_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showUser:(data:{user_id:number,_token:string,})=>apiFetch(`/users/${data.user_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  
  //crud comercios
  createCommerce:(data:{name:string,email:string,phone:string,data:object,_token:string})=>apiFetch('/commerces',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readCommerces:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/commerces`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateCommerce:(data:{name:string,email:string,phone:string,data:object,commerce_id:number,_token: string})=>apiFetch(`/commerces/${data.commerce_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteCommerce:(data:{name:string,email:string,password:string,role:string,commerce_id:number,_token: string})=>apiFetch(`/commerces/${data.commerce_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showCommerce:(data:{commerce_id:number,_token:string,})=>apiFetch(`/commerces/${data.commerce_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  attachUserCommerce:(data:{user_id:number,commerce_id:number,_token:string})=>apiFetch(`/commerces/${data.commerce_id}`,{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  detachUserCommerce:(data:{user_id:number,commerce_id:number,_token:string})=>apiFetch(`/commerces/${data.commerce_id}`,{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),

  //crud categorias
  createCategory:(data:{name:string,description:string,parent_id:number|null,commerce_id:number,_token:string})=>apiFetch('/categories',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readCategories:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/categories`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateCategory:(data:{name:string,description:string,parent_id:number|null,commerce_id:number,category_id:number,_token: string})=>apiFetch(`/categories/${data.category_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteCategory:(data:{category_id:number,_token: string})=>apiFetch(`/categories/${data.category_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showCategory:(data:{category_id:number,_token:string,})=>apiFetch(`/categories/${data.category_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud servicios
  createService:(data:{name:string,description:string,commerce_id:number,duration:number,price:number,price_offer:number,_token:string})=>apiFetch('/services',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readServices:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/services`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateService:(data:{name:string,description:string,commerce_id:number,duration:number,price:number,price_offer:number,service_id:number,_token: string})=>apiFetch(`/services/${data.service_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteService:(data:{service_id:number,_token: string})=>apiFetch(`/services/${data.service_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showService:(data:{service_id:number,_token:string,})=>apiFetch(`/services/${data.service_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud Productos
  createProduct:(data:{name:string,description:string,commerce_id:number,_token:string})=>apiFetch('/products',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readProducts:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/products`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateProduct:(data:{name:string,description:string,commerce_id:number,product_id:number,_token: string})=>apiFetch(`/products/${data.product_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteProduct:(data:{product_id:number,_token: string})=>apiFetch(`/products/${data.product_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showProduct:(data:{product_id:number,_token:string,})=>apiFetch(`/products/${data.product_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud Pacientes
  createPatient:(data:{first_name:string,last_name:string,email:string|null,phone:string|null,birth_date:string|null,gender:string|null,_token:string})=>apiFetch('/patients',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readPatients:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/patients`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updatePatient:(data:{first_name:string,last_name:string,email:string|null,phone:string|null,birth_date:string|null,gender:string|null,patient_id:number,_token: string})=>apiFetch(`/patients/${data.patient_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deletePatient:(data:{patient_id:number,_token: string})=>apiFetch(`/patients/${data.patient_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showPatient:(data:{patient_id:number,_token:string,})=>apiFetch(`/patients/${data.patient_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud  plantillas de registro
  createRecordTemplate:(data:{name:string,fields:object,_token:string})=>apiFetch('/record-templates',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readRecordTemplates:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/record-templates`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateRecordTemplate:(data:{name:string,fields:object,recordTemplate_id:number,_token: string})=>apiFetch(`/record-templates/${data.recordTemplate_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteRecordTemplate:(data:{recordTemplate_id:number,_token: string})=>apiFetch(`/record-templates/${data.recordTemplate_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showRecordTemplate:(data:{recordTemplate_id:number,_token:string,})=>apiFetch(`/record-templates/${data.recordTemplate_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud registros
  createRecord:(data:{patient_id:number,commerce_id:number,record_template_id:number|null,type:string|null,data:object|null,_token:string})=>apiFetch('/records',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readRecords:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/records`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateRecord:(data:{patient_id:number,commerce_id:number,record_template_id:number|null,type:string|null,data:object|null,record_id:number,_token: string})=>apiFetch(`/records/${data.record_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteRecord:(data:{record_id:number,_token: string})=>apiFetch(`/records/${data.record_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showRecord:(data:{record_id:number,_token:string,})=>apiFetch(`/records/${data.record_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud horarios
  createSchedule:(data:{day_of_week:string,start_time:string,end_time:string,breaks:object|null,_token:string})=>apiFetch('/schedules',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readSchedules:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/schedules`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateSchedule:(data:{day_of_week:string,start_time:string,end_time:string,breaks:object|null,schedule_id:number,_token: string})=>apiFetch(`/schedules/${data.schedule_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteSchedule:(data:{schedule_id:number,_token: string})=>apiFetch(`/schedules/${data.schedule_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showSchedule:(data:{schedule_id:number,_token:string,})=>apiFetch(`/schedules/${data.schedule_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //crud citas
  createAppointment:(data:{start_at:string,end_at:string,status:string|null,commerce_id:number|null,patient_id:number,schedule_id:number|null,user_id:number,notes:string|null,name:string|null,description:string|null,_token:string})=>apiFetch('/appointments',{method:'POST',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  readAppointments:(data:{_token:string,query:Record<string, string>})=>apiFetch(`/appointments`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`},query:data.query}),
  updateAppointment:(data:{start_at:string,end_at:string,status:string|null,commerce_id:number|null,patient_id:number,schedule_id:number|null,user_id:number,notes:string|null,name:string|null,description:string|null,appointment_id:number,_token: string})=>apiFetch(`/appointments/${data.appointment_id}`,{method:'PATCH',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  deleteAppointment:(data:{appointment_id:number,_token: string})=>apiFetch(`/appointments/${data.appointment_id}`,{method:'DELETE',body:data,headers: {Authorization:`Bearer ${data._token}`}}),
  showAppointment:(data:{appointment_id:number,_token:string,})=>apiFetch(`/appointments/${data.appointment_id}`,{method:'GET',headers: {Authorization:`Bearer ${data._token}`}}),
  
  //disponibilidad
  availability:(data:{user_id:number,start_at:string,end_at:string,_token:string,})=>apiFetch(`/availability?user_id=${data.user_id}&start_at=${data.start_at}&end_at=${data.end_at}`,{method:'GET'}),
  
  //disponibilidad dinamica
  dynamicAvailability:(data:{user_id:number,date:string,duration:number,_token:string,})=>apiFetch(`/dynamic-availability?user_id=${data.user_id}&date=${data.date}&duration=${data.duration}`,{method:'GET'}),
  
  //disponibilidad optimizada
  optimizedAvailability:(data:{user_id:number,date:string,duration:number,_token:string,})=>apiFetch(`/optimized-availability?user_id=${data.user_id}&date=${data.date}&duration=${data.duration}`,{method:'GET'}),
};
