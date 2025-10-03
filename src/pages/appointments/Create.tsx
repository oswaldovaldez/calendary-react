import FormAppointment from "./FormAppointment";

const AppointmentsCreate = () => {
  const initialValues = {};

  const onSubmit = (values: any) => {
    console.log(values);
  };
  return <FormAppointment initialValues={initialValues} onSubmit={onSubmit} />;
};

export default AppointmentsCreate;
