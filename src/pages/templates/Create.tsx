import { useState } from "react";
import FormTemplate from "./FormTemplate";
import { Api } from "../../services/api";
import { useNotificationStore } from "../../store/notification.store";
import type { RecordTemplateType } from "../../types";
import { useAuthStore } from "../../store/auth.store";

const Create = () => {
  const notify = useNotificationStore((state) => state.notify);
  const currentCommerce = useAuthStore((s) => s.commerce);
  const token = useAuthStore((s) => s.token);
  const [formData, setFormData] = useState<RecordTemplateType>({
    name: "",
    fields: [],
    commerce_id: currentCommerce?.id ?? 0,
  });
  const handleSubmit = async (values: any) => {
    Api.createRecordTemplate({
      ...values,
      _token: `${token}`,
    })
      .then((res) => {
        setFormData(res.data);
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  return (
    <div>
      <FormTemplate initialValues={formData} onSubmit={handleSubmit} />
    </div>
  );
};

export default Create;
