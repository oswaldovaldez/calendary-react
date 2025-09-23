import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  type FormikHelpers,
  FieldArray,
} from "formik";
import * as Yup from "yup";
import FormRender from "../../components/FormRender";

export interface PatientFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string | null;
  gender: string | null;
}

const patientSchema = Yup.object().shape({
  first_name: Yup.string().required("El nombre es obligatorio"),
  last_name: Yup.string().required("El apellido es obligatorio"),
  email: Yup.string()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  phone: Yup.string().required("El teléfono es obligatorio"),
  birth_date: Yup.string().required("La fecha de nacimiento es obligatoria"),
  gender: Yup.string().oneOf(["male", "female", "other"], "Debe ser Masculino, Femenino u Otro").required("El genero es obligatorio"),
});

interface FormPatientProps {
  initialValues: PatientFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: PatientFormValues,
    helpers: FormikHelpers<PatientFormValues>
  ) => void | Promise<void>;
}

const FormPatient: React.FC<FormPatientProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={patientSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="form-container">
          <div className="card neumo">
            <div className="card-body">
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="first_name">Nombre</label>
                <Field
                  className={`input input-sm ${
                    errors.first_name && touched.first_name
                      ? "input-invalid"
                      : ""
                  }`}
                  type="text"
                  name="first_name"
                />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Apellido */}
              <div className="form-group">
                <label htmlFor="last_name">Apellido</label>
                <Field
                  className={`input input-sm ${
                    errors.last_name && touched.last_name ? "input-invalid" : ""
                  }`}
                  type="text"
                  name="last_name"
                />
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Correo</label>
                <Field
                  className={`input input-sm ${
                    errors.email && touched.email ? "input-invalid" : ""
                  }`}
                  type="email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Teléfono */}
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <Field
                  className={`input input-sm ${
                    errors.phone && touched.phone ? "input-invalid" : ""
                  }`}
                  type="text"
                  name="phone"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Fecha de nacimiento */}
              <div className="form-group">
                <label htmlFor="birth_date">Fecha de nacimiento</label>
                <Field
                  className="input input-sm"
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
                <label htmlFor="gender">Género</label>
                <Field as="select" name="gender" className="input input-sm">
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
            </div>
          </div>
          {isEdit && (
            <div className="card neumo">
              <div className="card-header">
                <h3>Otros Datos</h3>
              </div>
              <div className="card-body">
                <FieldArray
                  name="data"
                  render={(arrayHelpers: any) => (
                    <FormRender
                      arrayHelpers={arrayHelpers}
                      initialValues={initialValues}
                    />
                  )}
                />
              </div>
            </div>
          )}

          <button
            className="btn neumo btn-success ml-auto"
            type="submit"
            disabled={isSubmitting}
          >
            {isEdit ? "Editar Paciente" : "Registrar Paciente"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormPatient;
