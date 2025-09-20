import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
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
  const formRender = (arrayHelpers: any) => {
    return (
      <div>
        {initialValues.record_templates[0].fields.map((element, indexE) => (
          <div className="form-control mt-2" key={`element-${indexE}`}>
            <label
              htmlFor={`data[${element.name ?? ""}]`}
              className="form-label"
            >
              {element.label ?? ""}
            </label>
            {element.type === "select" && (
              <>
                <Field
                  as="select"
                  className="input input-sm"
                  name={`data[${element.name ?? ""}]`}
                  defaultValue={
                    initialValues.data === null
                      ? ""
                      : initialValues.data[element.name]
                  }
                >
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <option key={`option-${index}`} value={key}>
                        {labelx ?? ""}
                      </option>
                    )
                  )}
                </Field>
              </>
            )}
            {element.type === "multiselect" && (
              <>
                <Field
                  as="select"
                  className="input input-sm"
                  name={`data[${element.name ?? ""}]`}
                  multiple
                  defaultValue={
                    initialValues.data === null
                      ? ""
                      : initialValues.data[element.name]
                  }
                >
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <option key={`option-${index}`} value={key}>
                        {labelx ?? ""}
                      </option>
                    )
                  )}
                </Field>
              </>
            )}
            {element.type === "group" && <></>}
            {element.type !== "select" &&
              element.type !== "multiselect" &&
              element.type !== "group" && (
                <Field
                  className={`input input-sm ${element.type === "textarea" && "textarea"}`}
                  type={element.type}
                  name={`data[${element.name ?? ""}]`}
                  defaultValue={
                    initialValues.data === null
                      ? ""
                      : (initialValues.data[element.name] ?? "")
                  }
                />
              )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={commerceSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="form-container">
            <div className="card neumo">
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

                
              </div>
            </div>
            {isEdit && (
              <div className="card neumo">
                <div className="card-header">
                  <h3>Otros Datos</h3>
                </div>
                <div className="card-body">
                  <FieldArray name="data" render={formRender} />
                </div>
              </div>
            )}
            <button
              className="btn neumo btn-success ml-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isEdit ? "Editar Comercio" : "Registrar Comercio"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormCommerce;
