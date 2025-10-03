import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams } from "@tanstack/react-router";
import FormUser from "./FormUser";
import type { UserType } from "../../types";
import { useNotificationStore } from "../../store/notification.store";

const Edit = () => {
  const notify = useNotificationStore((state) => state.notify);
  const [formData, setFormData] = useState<UserType>({
    name: "",
    email: "",
    password: "",
    permissions: [],
    data: [],
    role: 0,
    roles: [],
    schedules: [],
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
    if (!userId) return;
    Api.showUser({ _token: `${token}`, user_id: userId })
      .then((res) => {
        setFormData({
          ...res,
          role: res.roles[0]?.id ?? 0,
          password: res.password || "",
          schedules: res.schedules || [],
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, userId]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="card max-w-4xl mx-auto">
      <div className="card-header border-b border-gray-200 pb-2">
        <h2 className="text-lg font-semibold">Editar Usuario</h2>
      </div>

      <div className="card-body">
        {formData && (
          <FormUser
            initialValues={formData}
            isEdit={true}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Edit;
