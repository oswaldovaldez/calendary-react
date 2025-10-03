import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../../store/auth.store";
import { type PatientType, type ServiceType } from "../../types/index";
import { useEffect, useState } from "react";
import { Api } from "../../services/api";

export const appointmentSchema = Yup.object({
  first_name: Yup.string().trim().required("El nombre es obligatorio"),
  last_name: Yup.string().trim().required("El apellido es obligatorio"),
  email: Yup.string()
    .trim()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  phone: Yup.string()
    .matches(/^\+?\d{7,15}$/, "Número de teléfono no válido")
    .required("El teléfono es obligatorio"),
  birth_date: Yup.string().required("La fecha de nacimiento es obligatoria"),
  gender: Yup.string()
    .oneOf(["male", "female", "other"], "Debe ser Masculino, Femenino u Otro")
    .required("El género es obligatorio"),
});

const FormAppointment = ({ initialValues, isEdit = false, onSubmit }: any) => {
  const commerce = useAuthStore((s) => s.commerce);
  const token = useAuthStore((s) => s.token);
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [users, setUsers] = useState<ServiceType[]>([]);
  useEffect(() => {
    if (isEdit) {
      console.log("Editando cita", initialValues);
    }
    if (commerce !== null) {
      Api.readPatients({
        _token: `${token}`,
        query: {
          commerce_id: `${commerce.id}`,
          all: "true",
        },
      })
        .then((res) => {
          //   console.log(res);
          setPatients(res);
        })
        .catch((err) => {
          console.error(err);
        });

      Api.readServices({
        _token: `${token}`,
        query: {
          commerce_id: `${commerce.id}`,
          all: "true",
        },
      })
        .then((res) => {
          //   console.log(res);
          setServices(res);
        })
        .catch((err) => {
          console.error(err);
        });
      Api.readUsers({
        _token: `${token}`,
        query: {
          commerce_id: `${commerce.id}`,
          allcommerce: "true",
        },
      })
        .then((res) => {
          //   console.log(res);
          setUsers(res);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [commerce]);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={appointmentSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {/* {() => ( */}
      {/* {({ errors, touched, isSubmitting }: any) => ( */}
      {({ errors, touched }: any) => (
        <Form className="form-container">
          <Field type="hidden" name="commerce_id" />
          <Field type="hidden" name="commerce_id" value="scheduled" />
          <div className="card">
            <div className="card-body">
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <Field name="name">
                  {({ field, form }: any) => (
                    <input
                      type="text"
                      {...field}
                      className={`input input-sm ${errors.name && touched.name ? "input-invalid" : ""}`}
                      style={{
                        textTransform: "uppercase",
                      }}
                      placeholder=""
                      onChange={(e: any) =>
                        form.setFieldValue(
                          field.name,
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <Field
                  as="textarea"
                  className="input input-sm"
                  name="description"
                  placeholder="Descripción de la cita"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              {/* Paciente */}
              <div className="form-group">
                <label htmlFor="patient_id">Paciente</label>
                <Field name="patient_id">
                  {({ field, form }: any) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        list="patients"
                        className={`input input-sm ${errors.patient_id && touched.patient_id ? "input-invalid" : ""}`}
                        style={{
                          textTransform: "uppercase",
                        }}
                        placeholder=""
                        onChange={(e: any) =>
                          form.setFieldValue(
                            field.patient_id,
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                      <datalist id="patients">
                        {patients?.map((p: any) => (
                          <option
                            key={p.id}
                            value={`${p.id} - ${p.first_name} ${p.last_name}`}
                          >
                            {`${p.first_name} ${p.last_name}`}
                          </option>
                        ))}
                      </datalist>
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              {/* Servicios */}
              <div className="form-group">
                <label htmlFor="service_id">Servicio</label>
                <Field name="service_id">
                  {({ field, form }: any) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        list="services"
                        className={`input input-sm ${errors.service_id && touched.service_id ? "input-invalid" : ""}`}
                        style={{
                          textTransform: "uppercase",
                        }}
                        placeholder=""
                        onChange={(e: any) =>
                          form.setFieldValue(
                            field.service_id,
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                      <datalist id="services">
                        {services?.map((s: any) => (
                          <option key={s.id} value={`${s.id} - ${s.name}`}>
                            {`${s.name}`}
                          </option>
                        ))}
                      </datalist>
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              {/* Usuario */}
              <div className="form-group">
                <label htmlFor="user_id">Doctor</label>
                <Field name="user_id">
                  {({ field, form }: any) => (
                    <>
                      <input
                        type="text"
                        {...field}
                        list="users"
                        className={`input input-sm ${errors.user_id && touched.user_id ? "input-invalid" : ""}`}
                        style={{
                          textTransform: "uppercase",
                        }}
                        placeholder=""
                        onChange={(e: any) =>
                          form.setFieldValue(
                            field.user_id,
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                      <datalist id="users">
                        {users?.map((s: any) => (
                          <option key={s.id} value={`${s.id} - ${s.name}`}>
                            {`${s.name}`}
                          </option>
                        ))}
                      </datalist>
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              {/* date */}
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Dia
                </label>
                <Field type="date" name="date" className="input input-sm" />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              {/* Horas */}
              <div className="form-group">
                <label htmlFor="start_time" className="form-label">
                  Hora de inicio
                </label>
                <Field
                  type="time"
                  name="start_time"
                  className="input input-sm"
                />
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_time" className="form-label">
                  Hora de fin
                </label>
                <Field type="time" name="end_time" className="input input-sm" />
                <ErrorMessage
                  name="end_time"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              {/* - */}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormAppointment;
