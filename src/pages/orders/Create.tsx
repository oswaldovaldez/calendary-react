import FormOrder, { type OrderFormValues } from "./FormOrder";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";

const CreateOrder = () => {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const notify = useNotificationStore((state) => state.notify);

  const initialValues: OrderFormValues = {
    appointment_id: 0,
    subtotal: 0,
    total: 0,
    consultation_fee: 0,
    payment_method: "",
    folio: "",
    status: "",
    tax_rate: 16,
    discount_type: "",
    discount_value: 0,
    wallet_amount: 0,
    adjustment_mode: "",
    adjustment_concept: "",
    items: null,
  };

  const handleSubmit = async (values: OrderFormValues) => {
    const res = await Api.createOrder({
      ...values,
      _token: `${token}`,
    });
    console.log(res);
    notify("success", "Orden creada correctamente");
    navigate({ to: "/orders" });
  };

  return <FormOrder initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateOrder;
