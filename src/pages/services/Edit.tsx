import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import FormService from "./FormService";
import toast from "react-hot-toast";
import { useNotificationStore } from "../../store/notification.store";
import type { ServiceType } from "../../types";

const EditService = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const { serviceId } = useParams({ from: "/services/$serviceId/edit" });
  const notify = useNotificationStore((state) => state.notify);
  const currentCommerceId = commerce?.id ?? 0;

  const [formData, setFormData] = useState<ServiceType>();

  const [loading, setLoading] = useState(true);

  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return null;
  //   return new Date(dateString).toISOString().split("T")[0];
  // };

  const handleSubmit = async (values: any) => {
    const payload = {
      name: values.name.trim(),
      description: values.description,
      commerce_id: currentCommerceId,
      categories: values.categories,
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
    };

    Api.updateService({ ...payload, _token: `${token}` })
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
      .then((res: ServiceType) => {
        setFormData(res);
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
    <>
      {formData !== undefined && (
        <FormService
          initialValues={formData}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      )}
    </>
  );
};

export default EditService;
