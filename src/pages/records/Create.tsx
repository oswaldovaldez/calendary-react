import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";

import FormRecord, { type RecordFormValues } from "./FormRecord";

const CreateRecord = ({ template, onClosex, patientId }: any) => {
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);

  const initialValues: RecordFormValues = {
    patient_id: patientId,
    commerce_id: 0,
    record_template_id: null,
    type: null,
    data: {},
    record_templates: [template],
  };

  const handleSubmit = async (values: RecordFormValues) => {
    console.log("Submitting form with values:", values, );
    Api.createRecord({
      patient_id: Number(patientId),
      commerce_id: Number(values.commerce_id),
      record_template_id: values.record_template_id
        ? Number(values.record_template_id)
        : null,
      type: values.type || null,
      data: values.data,
      _token: `${token}`,
    })
      .then((res) => {
        onClosex(false);
        setTimeout(() => {
          notify("success", res.message);
        }, 100);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <FormRecord initialValues={initialValues} onSubmit={handleSubmit} />;
};

export default CreateRecord;
