import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import type { ProductFormValues } from "./FormProduct";
import FormProduct from "./FormProduct";

const CreateProduct = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();

  const initialValues: ProductFormValues = {
    name: "",
    description: "",
    commerce_id: commerce?.id ?? 0,
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      await Api.createProduct({
        name: values.name.trim(),
        description: values.description?.trim() || "",
        commerce_id: values.commerce_id,
        _token: `${token}`,
      });
      toast.success("Producto creado con éxito", { duration: 4000 });
      navigate({ to: "/products" });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Error al registrar producto", {
        duration: 5000,
      });
    }
  };

  return (
    <FormProduct
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isEdit={false}
    />
  );
};

export default CreateProduct;
