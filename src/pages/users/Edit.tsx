import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams } from "@tanstack/react-router";
import FormUser from "./FormUser";
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
  const { userId } = useParams({ from: "/users/$userId/edit" });
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: any) => {
    Api.updateUser({ ...values, user_id: values.id, _token: `${token}` })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  useEffect(() => {
    Api.showUser({ _token: `${token}`, user_id: userId })
      .then((res) => {
        setFormData({ ...res, role: res.roles[0].id });

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
