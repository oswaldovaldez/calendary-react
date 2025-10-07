import FormCommerce from "./FormCommerce";
// import { type CommerceType } from "../../types/index";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";

const CreateCommerce = () => {
  const token = useAuthStore((s) => s.token);
  const navigate = useNavigate();
  const notify = useNotificationStore((state) => state.notify);
  const handleSubmit = async (values: any) => {
    Api.createCommerce({
      ...values,
      _token: `${token}`,
    })
      .then((res) => {
        notify("success", res.message);
        navigate({ to: "/commerces" });
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return <FormCommerce initialValues={{}} onSubmit={handleSubmit} />;
};

export default CreateCommerce;
