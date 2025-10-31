import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import FormOrder, { type OrderFormValues } from "./FormOrder";
import toast from "react-hot-toast";
import { useNotificationStore } from "../../store/notification.store";

const EditOrder = () => {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const { orderId } = useParams({ from: "/orders/$orderId/edit" });
  const notify = useNotificationStore((state) => state.notify);

  const [formData, setFormData] = useState<OrderFormValues>({
    appointment_id: 0,
    subtotal: 0,
    total: 0,
    consultation_fee: 0,
    payment_method: "",
    folio: "",
    status: "",
    tax_rate: 0,
    discount_type: "",
    discount_value: 0,
    wallet_amount: 0,
    adjustment_mode: "",
    adjustment_concept: "",
    items: null,
  });

  const [loading, setLoading] = useState(true);

  const handleSubmit = async (values: OrderFormValues) => {
    Api.updateOrder({
      ...values,
      _token: `${token}`,
      order_id: orderId,
    })
      .then((res) => {
        notify("success", res.message || "Orden actualizada correctamente");
        navigate({ to: "/orders" });
      })
      .catch((error: any) => {
        console.error(error);
        toast.error(error.message || "Error al actualizar orden", {
          duration: 5000,
        });
      });
  };

  useEffect(() => {
    Api.showOrder({
      _token: `${token}`,
      order_id: orderId,
    })
      .then((res) => {
        setFormData({
          appointment_id: res.appointment_id,
          subtotal: Number(res.subtotal),
          total: Number(res.total),
          consultation_fee: Number(res.consultation_fee),
          payment_method: res.payment_method || "",
          folio: res.folio || "",
          status: res.status || "",
          tax_rate: res.tax_rate || 0,
          discount_type: res.discount_type || "",
          discount_value: Number(res.discount_value),
          wallet_amount: Number(res.wallet_amount),
          adjustment_mode: res.adjustment_mode || "",
          adjustment_concept: res.adjustment_concept || "",
          items: res.items,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al cargar la orden");
        setLoading(false);
      });
  }, [token, orderId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <FormOrder initialValues={formData} onSubmit={handleSubmit} isEdit={true} />
  );
};

export default EditOrder;
