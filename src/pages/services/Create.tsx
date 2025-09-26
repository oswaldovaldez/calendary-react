import FormService, { type ServiceFormValues } from "./FormService";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

const CreateService = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();

  const currentCommerceId = commerce?.id ?? 0;

  const initialValues: ServiceFormValues = {
    name: "",
    description: "",
	category_id:0,
    commerce_id: currentCommerceId,
    duration: 0,
    price: 0,
    price_offer: 0,
    _token: token ?? "",
  };

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      const payload: ServiceFormValues = {
        ...values,
        name: values.name.trim().toUpperCase(),
        commerce_id: currentCommerceId,
        _token: token ?? "",
      };

      await Api.createService(payload);

      toast.success("Servicio creado con éxito", {
        duration: 4000,
      });

      navigate({ to: "/services" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear servicio", {
        duration: 5000,
      });
    }
  };

  return <FormService initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateService;
