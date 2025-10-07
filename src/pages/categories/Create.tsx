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
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload: CategoryFormValues = {
      ...values,
      name: values.name.trim().toUpperCase(),
      parent_id: null,
      commerce_id: currentCommerceId,
    };

    Api.createCategory({
      ...payload,
      _token: `${token}`,
    })
      .then((res) => {
        notify("success", res.message);

        navigate({ to: "/categories" });
      })

      .catch((error: any) => {
        console.error(error);
      });
  };

  return <FormCategory initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateCategory;
