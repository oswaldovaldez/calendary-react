import FormCategory, { type CategoryFormValues } from "./FormCategory";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();

  const currentCommerceId = commerce?.id ?? 0;

  const initialValues: CategoryFormValues = {
    name: "",
    description: "",
    parent_id: null,
    commerce_id: currentCommerceId,
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    try {
      const payload: CategoryFormValues = {
        ...values,
        name: values.name.trim().toUpperCase(),
        parent_id: null,
        commerce_id: currentCommerceId,
      };

      await Api.createCategory({
        ...payload,
        _token: `${token}`,
      });

      toast.success("Categoría creada con éxito", {
        duration: 4000,
      });

      navigate({ to: "/categories" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al crear categoría", {
        duration: 5000,
      });
    }
  };

  return <FormCategory initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateCategory;
