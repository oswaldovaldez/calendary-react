import { useEffect, useState } from "react";
import FormCommerce from "./FormCommerce";
import { Api } from "../../services/api";
import type { CommerceType } from "../../types/index";
import { useAuthStore } from "../../store/auth.store";
import { useParams } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";

const Edit = () => {
  const notify = useNotificationStore((state) => state.notify);
  const [formData, setFormData] = useState<CommerceType>({
    name: "",
    phone: "",
    description: "",
    email: "",
    address: "",
    data: [],
  });
  const { commerceId } = useParams({ from: "/commerces/$commerceId/edit" });
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: any) => {
    Api.updateCommerce({
      ...values,
      commerce_id: values.id,
      _token: `${token}`,
    })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  useEffect(() => {
    Api.showCommerce({ _token: `${token}`, commerce_id: commerceId })
      .then((res) => {
        console.log(res);
        setFormData({ ...res });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, commerceId]);

  if (loading) return <div>Cargando...</div>;
  return (
    <div>
      {formData && (
        <FormCommerce
          initialValues={formData}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Edit;
