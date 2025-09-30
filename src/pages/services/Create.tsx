import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useNavigate } from "@tanstack/react-router";
import FormService, { type ServiceFormValues } from "./FormService";
import toast from "react-hot-toast";

const CreateService = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();

  const currentCommerceId = commerce?.id ?? 0;

  const initialValues: ServiceFormValues = {
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
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
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
        _token: `${token}`,
      };

      await Api.createService(payload);

      toast.success("Servicio creado con éxito", {
        duration: 4000,
      });

      navigate({ to: "/services" });
    } catch (error: any) {
      console.error("Error al crear servicio", error);
      toast.error(error.message || "Error al crear servicio", {
        duration: 5000,
      });
    }
  };

  return (
    <FormService
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isEdit={false}
    />
  );
};

export default CreateService;
