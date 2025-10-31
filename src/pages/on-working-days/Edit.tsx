// ============================================
// non-working-days/Edit.tsx
// ============================================
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import type { NonWorkingDayType } from "../../types";
import { useNotificationStore } from "../../store/notification.store";
import FormNonWorkingDay from "./FormNonWorkingDay";

const EditNonWorkingDay = ({
  nonWorkingDayId,
  userId,
  onClosex,
  reload,
}: any) => {
  const notify = useNotificationStore((state) => state.notify);
  const [formData, setFormData] = useState<NonWorkingDayType>({
    commerce_id: 0,
    user_id: 0,
    type: "day_off",
    start_date: "",
    end_date: null,
    notes: null,
  });
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (values: any) => {
    onClosex();
    Api.updateNonWorkingDay({
      ...values,
      non_working_day_id: nonWorkingDayId,
      _token: `${token}`,
    })
      .then((res) => {
        notify(
          "success",
          res.message || "Día no laborable actualizado correctamente"
        );
        reload();
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };

  useEffect(() => {
    Api.showNonWorkingDay({
      _token: `${token}`,
      non_working_day_id: nonWorkingDayId,
    })
      .then((res) => {
        setFormData({
          commerce_id: 0,
          user_id: res.user_id,
          type: res.type,
          start_date: res.start_date,
          end_date: res.end_date || "",
          notes: res.notes || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, nonWorkingDayId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {formData && (
        <FormNonWorkingDay
          initialValues={formData}
          isEdit={true}
          onSubmit={handleSubmit}
          userId={userId}
        />
      )}
    </div>
  );
};

export default EditNonWorkingDay;
