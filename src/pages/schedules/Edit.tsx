import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import type { ScheduleType, UserType } from "../../types";
import { useNotificationStore } from "../../store/notification.store";
import FormSchedule from "./FormSchedule";
//  import toast, { Toaster } from "react-hot-toast";

const Edit = ({ scheduleId, userId, commerceId }) => {
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

  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: any) => {
    Api.updateSchedule({
      ...values,
      schedule_id: scheduleId,
      _token: token ?? "",
    })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  useEffect(() => {
    Api.showSchedule({ _token: token ?? "", schedule_id: scheduleId })
      .then((res) => {
        setFormData({ ...res, role: res.roles[0].id });

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
