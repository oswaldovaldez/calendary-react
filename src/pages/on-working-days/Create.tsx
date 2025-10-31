// ============================================
// non-working-days/Create.tsx
// ============================================
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import FormNonWorkingDay, {
  type NonWorkingDayFormValues,
} from "./FormNonWorkingDay";
import { useNotificationStore } from "../../store/notification.store";

const CreateNonWorkingDay = ({ userId, onClosex, reload }: any) => {
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const currentCommerce = useAuthStore((s) => s.commerce);
  const commerceId = currentCommerce?.id ?? 0;

  const initialValues: NonWorkingDayFormValues = {
    commerce_id: commerceId,
    user_id: userId,
    type: "",
    start_date: "",
    end_date: "",
    notes: "",
  };

  const handleSubmit = async (values: NonWorkingDayFormValues) => {
    onClosex();
    Api.createNonWorkingDay({
      ...values,
      type: values.type === "" ? "day_off" : values.type,
      _token: `${token}`,
    })
      .then((res) => {
        notify(
          "success",
          res.message || "Día no laborable registrado correctamente"
        );
        reload();
      })
      .catch((error: any) => {
        console.error(error);
        notify("error", error.message || "Error al crear día no laborable");
      });
  };

  return (
    <FormNonWorkingDay
      initialValues={initialValues}
      onSubmit={handleSubmit}
      userId={userId}
    />
  );
};

export default CreateNonWorkingDay;
