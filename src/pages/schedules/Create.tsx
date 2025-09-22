import { useEffect, useState } from "react";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import FormSchedule, { type ScheduleFormValues } from "./FormSchedule";

const CreateSchedule = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const currentCommerce = user?.commerces?.[0] ?? null;
  const commerceId = currentCommerce?.id ?? 0;

  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await Api.readUsers({
          _token: token ?? "",
          query: {},
        });
        const filtered = res.data
          .filter((u: any) =>
            u.commerces?.some((c: any) => c.id === commerceId)
          )
          .map((u: any) => ({ id: u.id, name: u.name }));
        setUsers(filtered);
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    };
    fetchUsers();
  }, [commerceId, token]);

  const initialValues: ScheduleFormValues = {
    commerce_id: commerceId,
    user_id: 0,
    day_of_week: "",
    start_time: "",
    end_time: "",
    breaks: [],
  };

  const handleSubmit = async (values: ScheduleFormValues) => {
    try {
      await Api.createSchedule({
        commerce_id: values.commerce_id,
        user_id: values.user_id,
        day_of_week: values.day_of_week,
        start_time: values.start_time,
        end_time: values.end_time,
        breaks: values.breaks,
        _token: token ?? "",
      });
      alert("Horario creado con éxito");
      navigate({ to: "/schedules" });
    } catch (error) {
      console.error(error);
      alert("Error al crear el horario");
    }
  };

  return (
    <FormSchedule
      initialValues={initialValues}
      onSubmit={handleSubmit}
      users={users}
    />
  );
};

export default CreateSchedule;
