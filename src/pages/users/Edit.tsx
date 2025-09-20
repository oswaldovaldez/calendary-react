import React, { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams } from "@tanstack/react-router";
import FormUser from "./FormUser";
import type { UserType } from "../../types";

const Edit = () => {
  const [formData, setFormData] = useState<UserType>({
    name: "",
    email: "",
    password: "",
    permissions: [],
    data: [],
    roles: [],
  });
  const { userId } = useParams({ from: "/users/$userId/edit" });
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: UserType) => {
    console.log(values);
  };
  useEffect(() => {
    Api.showUser({ _token: token ?? "", user_id: userId })
      .then((res) => {
        setFormData({ ...res, role: res.roles[0].id });
        console.log(res.record_templates[0].fields);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, userId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {formData && (
        <FormUser
          initialValues={formData}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Edit;
