import { useEffect, useState } from "react";
import FormPatient from "./FormPatient";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useParams } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import type { PatientType } from "../../types";

const Edit = () => {
  const notify = useNotificationStore((state) => state.notify);
  const [formData, setFormData] = useState<PatientType>({
    first_name: "",
    last_name: "",
    birth_date: "",
    email: "",
    gender: "",
    phone: "",
    data: [],
  });
  const { patientId } = useParams({ from: "/patients/$patientId/edit" });
  const token = useAuthStore((s) => s.token);
  const [loading, setLoading] = useState(true);
  const handleSubmit = async (values: any) => {
    console.log("Submitting form with values:", values);
    Api.updatePatient({
      ...values,
      patient_id: values.id,
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
    Api.showPatient({ _token: `${token}`, patient_id: patientId })
      .then((res) => {
        setFormData({ ...res });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token, patientId]);

  if (loading) return <div>Cargando...</div>;
  return (
    <div>
      {formData && (
        <FormPatient
          initialValues={formData}
          isEdit={true}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Edit;
