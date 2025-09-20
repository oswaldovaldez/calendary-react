import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

export interface CommerceFormValues {
  name: string;
  email: string;
  phone: string;
  data: Record<string, any>;
}

export const commerceSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  email: Yup.string()
    .trim()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  phone: Yup.string()
    .matches(/^\+?\d{7,15}$/, "Número de teléfono no válido")
    .required("El teléfono es obligatorio"),
  data: Yup.mixed()
    .test("is-valid-json", "Debe ser un objeto JSON válido", (value) => {
      try {
        JSON.parse(JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    })
    .required("La data es obligatoria"),
});

interface FormCommerceProps {
  initialValues: CommerceFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: CommerceFormValues,
    FormikHelpers: FormikHelpers<CommerceFormValues>
  ) => void | Promise<void>;
}

const FormCommerce: React.FC<FormCommerceProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={commerceSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <div className="card">
            <Form className="form-container">
              <div className="card-body">
                {/* Nombre */}
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.name && touched.name ? "input-invalid" : ""
                    }`}
                    type="text"
                    name="name"
                  />
                  <ErrorMessage
                    name="name"
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
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Data JSON */}
                <div className="form-group">
                  <label htmlFor="data" className="form-label">
                    Data (JSON)
                  </label>
                  <Field
                    as="textarea"
                    name="data"
                    className={`input input-sm ${
                      errors.data && touched.data ? "input-invalid" : ""
                    }`}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setFieldValue("data", parsed);
                      } catch {
                        setFieldValue("data", e.target.value);
                      }
                    }}
                  />
                  <ErrorMessage
                    name="data"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="btn neumo btn-success ml-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEdit ? "Editar Comercio" : "Registrar Comercio"}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default FormCommerce;
