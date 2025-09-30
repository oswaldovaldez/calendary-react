import FormCommerce from "./FormCommerce";
// import { type CommerceType } from "../../types/index";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

const CreateCommerce = () => {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();

  const handleSubmit = async (values: any) => {
    try {
      await Api.createCommerce({
        ...values,
        _token: `${token}`,
      });

      toast.success("Comercio creado con éxito", { duration: 4000 });
      navigate({ to: "/commerces" });
    } catch (error: any) {
      console.error("Error al crear comercio:", error);

      toast.error(error.message || "Error al crear comercio", {
        duration: 5000,
      });
    }
  };

  return <FormCommerce initialValues={{}} onSubmit={handleSubmit} />;
};

export default CreateCommerce;
