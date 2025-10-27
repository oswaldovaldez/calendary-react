import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  type FormikHelpers,
  FieldArray,
} from "formik";
import * as Yup from "yup";
import FormRender from "../../components/FormRenderOld";
import { type PatientType } from "../../types/index";
import { RecordsIndex } from "../records";

// export interface PatientType {
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   birth_date: string;
//   gender: string | null;
//   commerce_id: number;
//   data: Record<string, any>;
// }

export const patientSchema = Yup.object({
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

interface FormPatientProps {
  initialValues: PatientType;
  isEdit?: boolean;
  onSubmit: (
    values: PatientType,
    helpers: FormikHelpers<PatientType>
  ) => void | Promise<void>;
}

const FormPatient: React.FC<FormPatientProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={patientSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-container">
            <div className="card neumo">
              <div className="card-body grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* Nombre */}
                <div className="form-group md:col-span-2">
                  <label htmlFor="first_name" className="form-label">
                    Nombre
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.first_name && touched.first_name
                        ? "input-invalid"
                        : ""
                    }`}
                    type="text"
                    name="first_name"
                    placeholder="Nombre del paciente"
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Apellido */}
                <div className="form-group md:col-span-2">
                  <label htmlFor="last_name" className="form-label">
                    Apellido
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.last_name && touched.last_name
                        ? "input-invalid"
                        : ""
                    }`}
                    type="text"
                    name="last_name"
                    placeholder="Apellido del paciente"
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.email && touched.email ? "input-invalid" : ""
                    }`}
                    type="email"
                    name="email"
                    placeholder="ejemplo@correo.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Teléfono */}
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Teléfono
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.phone && touched.phone ? "input-invalid" : ""
                    }`}
                    type="text"
                    name="phone"
                    placeholder="+52 951 000 0000"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Fecha de nacimiento */}
                <div className="form-group">
                  <label htmlFor="birth_date" className="form-label">
                    Fecha de nacimiento
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.birth_date && touched.birth_date
                        ? "input-invalid"
                        : ""
                    }`}
                    type="date"
                    name="birth_date"
                  />
                  <ErrorMessage
                    name="birth_date"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Género */}
                <div className="form-group">
                  <label htmlFor="gender" className="form-label">
                    Género
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className={`input input-sm ${
                      errors.gender && touched.gender ? "input-invalid" : ""
                    }`}
                  >
                    <option value="">-- Selecciona --</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                    <option value="other">Otro</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Campo oculto para el comercio */}
                <Field type="hidden" name="commerce_id" />
              </div>
            </div>

            {/* Detalles solo en edición */}
            {isEdit && (
              <div className="card neumo mt-4">
                <div className="card-header">
                  <h3 className="text-md font-semibold">Detalles</h3>
                </div>
                <div className="card-body">
                  {initialValues.record_templates &&
                    initialValues.record_templates.length > 0 &&
                    initialValues.record_templates[0].fields?.length != 0 && (
                      <FieldArray
                        name="data"
                        render={(arrayHelpers: any) => (
                          <FormRender
                            arrayHelpers={arrayHelpers}
                            data={initialValues.data}
                            fields={
                              initialValues.record_templates?.[0].fields ?? []
                            }
                          />
                        )}
                      />
                    )}
                </div>
              </div>
            )}

            <div className="card-footer flex justify-end mt-4">
              <button
                className="btn neumo btn-success ml-auto"
                type="submit"
                disabled={isSubmitting}
              >
                {isEdit ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="card">
        <div className="card-hearder">Registros</div>
        <div className="card-body">
          <RecordsIndex patient={initialValues} />
        </div>
      </div>
    </>
  );
};

export default FormPatient;
