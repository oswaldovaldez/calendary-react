// import { useEffect, useState } from "react";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
// import { useN  avigate } from "@tanstack/react-router";
import FormSchedule, { type ScheduleFormValues } from "./FormSchedule";
import { useNotificationStore } from "../../store/notification.store";

const CreateSchedule = ({ userId, onClosex, reload }: any) => {
  const token = useAuthStore((s) => s.token);
  // const user = useAuthStore((s) => s.user);
  // const navigate = useNavigate();
  const notify = useNotificationStore((state) => state.notify);
  const currentCommerce = useAuthStore((s) => s.commerce);
  const commerceId = currentCommerce?.id ?? 0;

  // const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await Api.readUsers({
  //         _token: `${token}`,
  //         query: {},
  //       });
  //       const filtered = res.data
  //         .filter((u: any) =>
  //           u.commerces?.some((c: any) => c.id === commerceId)
  //         )
  //         .map((u: any) => ({ id: u.id, name: u.name }));
  //       setUsers(filtered);
  //     } catch (error) {
  //       console.error("Error al cargar usuarios:", error);
  //     }
  //   };
  //   fetchUsers();
  // }, [commerceId, token]);

  const initialValues: ScheduleFormValues = {
    commerce_id: commerceId,
    user_id: userId,
    day_of_week: "",
    start_time: "",
    end_time: "",
    breaks: [],
  };

  const handleSubmit = async (values: ScheduleFormValues) => {
    onClosex();
    // console.log(values);
    // return;
    try {
      await Api.createSchedule({
        ...values,
        _token: `${token}`,
      });
      notify("success", "Horario creado con éxito");
      reload();
      // navigate({ to: "/schedules" });
    } catch (error) {
      console.error(error);
      notify("error", "Error al crear el horario");
    }
  };

  return (
    <FormSchedule
      initialValues={initialValues}
      onSubmit={handleSubmit}
      userId={userId}
      
    />
  );
};

export default CreateSchedule;
