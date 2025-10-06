import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNotificationStore } from "../../store/notification.store";
import FormRecord from "./FormRecord";

const RecordsEdit = ({ values, template, onClosex }: any) => {
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);

  const initialValues: any = {
    ...values,
    record_templates: [template],
  };

  const handleSubmit = async (values: any) => {
    // console.log(values);
    // return;
    Api.updateRecord({
      type: values.type || null,
      data: values.data,
      record_id: values.id,
      _token: `${token}`,
    })
      .then((res) => {
        onClosex(false);
        setTimeout(() => {
          notify("success", res.message);
        }, 100);
        //
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <FormRecord
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isEdit={true}
    />
  );
};

export default RecordsEdit;
