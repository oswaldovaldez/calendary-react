import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams } from "@tanstack/react-router";
import FormTemplate from "./FormTemplate";
import type { UserType } from "../../types";
import { useNotificationStore } from "../../store/notification.store";
//  import toast, { Toaster } from "react-hot-toast";

const Edit = () => {
  const notify = useNotificationStore((state) => state.notify);
  const [formData, setFormData] = useState<UserType>({
    name: "",
    email: "",
    password: "",
    permissions: [],
    data: [],
    roles: [],
  });
  const { templateId } = useParams({ from: "/templates/$templateId/edit" });
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: any) => {
    Api.updateRecordTemplate({
      ...values,
      recordTemplate_id: values.id,
      _token: token ?? "",
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
    Api.showRecordTemplate({
      _token: token ?? "",
      recordTemplate_id: templateId,
    })
      .then((res) => {
        setFormData(res);
        console.log(JSON.stringify(res.fields));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, templateId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {formData && (
        <FormTemplate
          initialValues={formData}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Edit;
