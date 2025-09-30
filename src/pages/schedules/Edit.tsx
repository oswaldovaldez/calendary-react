import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import type { ScheduleType } from "../../types";
import { useNotificationStore } from "../../store/notification.store";
import FormSchedule from "./FormSchedule";
//  import toast, { Toaster } from "react-hot-toast";

const Edit = ({ scheduleId, userId, onClosex, reload }: any) => {
  const notify = useNotificationStore((state) => state.notify);
  const [formData, setFormData] = useState<ScheduleType>({
    breaks: [],
    commerce_id: 0,
    day_of_week: "",
    end_time: "",
    id: 0,
    start_time: "",
    user_id: 0,
  });
  const currentCommerce = useAuthStore((s) => s.commerce);
  const commerceId = currentCommerce?.id ?? 0;
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: any) => {
    onClosex();
    Api.updateSchedule({
      ...values,
      schedule_id: scheduleId,
      _token: `${token}`,
    })
      .then((res) => {
        notify("success", res.message);
        reload();
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };

  const formatTimeToHHMM = (time: string): string => {
    if (!time) return "";
    // Si ya está en formato HH:MM, devolver tal como está
    if (time.length === 5) return time;
    // Si está en formato HH:MM:SS, quitar los segundos
    return time.substring(0, 5);
  };

  useEffect(() => {
    Api.showSchedule({ _token: `${token}`, schedule_id: scheduleId })
      .then((res) => {
        setFormData({
          ...res,
          start_time: formatTimeToHHMM(res.start_time),
          end_time: formatTimeToHHMM(res.end_time),
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {formData && (
        <FormSchedule
          initialValues={formData}
          isEdit={true}
          onSubmit={handleSubmit}
          userId={userId}
          commerceId={commerceId}
        />
      )}
    </div>
  );
};

export default Edit;
