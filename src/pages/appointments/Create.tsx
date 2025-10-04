import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import type { AppointmentType } from "../../types";
import FormAppointment from "./FormAppointment";

export const toLaravelTimestamp = (date:string, time:string) => {
// Si la hora no tiene segundos, agregamos :00
const fullTime = time.length === 5 ? `${time}:00` : time;

// Unimos fecha y hora con un espacio
return `${date} ${fullTime}`;
};

export const extractId=(value: string): number=> {
  console.log(value);
  const idPart = value.split(" - ")[0]; // Toma lo que está antes del " - "
  const id = Number(idPart); // Convierte a número
  return isNaN(id) ? 0 : id; // Retorna 0 si no es un número válido
}


const AppointmentsCreate = ({onClosex}:any) => {
  const initialValues = {};
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);
  const token = useAuthStore((s) => s.token);


  const onSubmit = (values: any) => {
//console.log(values);
    const data:AppointmentType={
      commerce_id:commerce?.id??0,
      user_id:extractId(values.user_id),
      service_id:extractId(values.service_id),
      patient_id:extractId(values.patient_id),
      description:values.description,
      status:'scheduled',
      start_at:toLaravelTimestamp(values.date,values.start_time),
      end_at:toLaravelTimestamp(values.date,values.end_time),
      name:values.name,
      notes:""
    }
    //console.log(data);
    Api.createAppointment({
      ...data,
      _token: `${token}`,
    }).then((res)=>{
      onClosex(true);
      setTimeout(() => {        
        notify('success',res.message);
      }, 200);
    })
    .catch((error)=>{
      console.error(error);
    })
    //console.log(data);
  };
  return <FormAppointment initialValues={initialValues} onSubmit={onSubmit} />;
};

export default AppointmentsCreate;
