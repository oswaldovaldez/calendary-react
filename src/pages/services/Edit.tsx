import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import FormService, { type ServiceFormValues } from "./FormService";
import toast from "react-hot-toast";
import { useNotificationStore } from "../../store/notification.store";

const EditService = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const { serviceId } = useParams({ from: "/services/$serviceId/edit" });
  const notify = useNotificationStore((state) => state.notify);
  const currentCommerceId = commerce?.id ?? 0;

  const [formData, setFormData] = useState<ServiceFormValues>({
    name: "",
    description: "",
    commerce_id: currentCommerceId,
    category_id: 0,
    duration: 0,
    duration_type: "minutes",
    price: 0,
    price_offer: 0,
    session_number: 1,
    sessions: false,
    home_service: false,
    start_offer_at: null,
    end_offer_at: null,
    options: [],
    _token: `${token}`,
  });

  const [loading, setLoading] = useState(true);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString().split("T")[0];
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    const payload = {
      name: values.name.trim(),
      description: values.description,
      commerce_id: currentCommerceId,
      category_id: Number(values.category_id),
      duration: Number(values.duration),
      duration_type: values.duration_type,
      price: values.price,
      price_offer: values.price_offer,
      session_number: Number(values.session_number),
      sessions: Boolean(values.sessions),
      home_service: Boolean(values.home_service),
      start_offer_at: values.start_offer_at ? values.start_offer_at : null,
      end_offer_at: values.end_offer_at ? values.end_offer_at : null,
      options: values.options,
      service_id: Number(serviceId),
      _token: `${token}`,
    };

    Api.updateService(payload)
      .then((res) => {
        notify("success", res.message || "Servicio actualizado con éxito");
        navigate({ to: "/services" });
      })
      .catch((error) => {
        console.error("Error al actualizar servicio", error);
        notify("error", error.message || "Error al actualizar servicio");
      });
  };

  useEffect(() => {
    Api.showService({
      _token: `${token}`,
      service_id: Number(serviceId),
    })
      .then((res) => {
        setFormData({
          name: res.name ?? "",
          description: res.description ?? "",
          commerce_id: res.commerce_id ?? currentCommerceId,
          category_id: Number(res.category_id) ?? 0,
          duration: Number(res.duration) ?? 0,
          duration_type: res.duration_type ?? "minutes",
          price: Number(res.price) ?? 0,
          price_offer: Number(res.price_offer) ?? 0,
          session_number: Number(res.session_number) ?? 1,
          sessions: Boolean(res.sessions),
          home_service: Boolean(res.home_service),
          start_offer_at: formatDate(res.start_offer_at),
          end_offer_at: formatDate(res.end_offer_at),
          options: res.options ?? [],
          _token: `${token}`,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar el servicio", error);
        toast.error("Error al cargar el servicio");
        setLoading(false);
      });
  }, [token, serviceId, currentCommerceId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <FormService
      initialValues={formData}
      onSubmit={handleSubmit}
      isEdit={true}
    />
  );
};

export default EditService;
