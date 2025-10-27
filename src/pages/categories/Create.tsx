import FormCategory, { type CategoryFormValues } from "./FormCategory";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";

const CreateCategory = () => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const navigate = useNavigate();
  const notify = useNotificationStore((state) => state.notify);
  const currentCommerceId = commerce?.id ?? 0;

  const initialValues: CategoryFormValues = {
    name: "",
    description: "",
    parent_id: null,
    commerce_id: currentCommerceId,
    service: false,
    product: false,
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload: CategoryFormValues = {
      ...values,
      name: values.name.trim().toUpperCase(),
      parent_id: null,
      commerce_id: currentCommerceId,
    };

    // try {
    const res = await Api.createCategory({
      ...payload,
      _token: `${token}`,
    });
    notify("success", res.message);
    navigate({ to: "/categories" });
    // } catch (error: any) {
    //   throw error; // RE-lanzar el error hacia FormCategory
    // }
  };

  return <FormCategory initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateCategory;
