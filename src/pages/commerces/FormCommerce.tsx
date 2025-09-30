import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import FormRender from "../../components/FormRender";
import { type CommerceType } from "../../types/index";

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
  description: Yup.string().nullable(),
  address: Yup.string().nullable(),
  image: Yup.string().url("Debe ser una URL válida").nullable(),
});

interface FormCommerceProps {
  initialValues: CommerceType | any;
  isEdit?: boolean;
  onSubmit: (
    values: CommerceType,
    helpers: FormikHelpers<CommerceType>
  ) => void | Promise<void>;
}

const FormCommerce: React.FC<FormCommerceProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={commerceSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="form-container">
          <div className="card neumo">
            <div className="card-body grid gap-4 md:grid-cols-2">
              {/* Nombre */}
              <div className="form-group md:col-span-2">
                <label htmlFor="name" className="form-label">
                  Nombre
                </label>
                <Field
                  className={`input input-sm ${
                    errors.name && touched.name ? "input-invalid" : ""
                  }`}
                  type="text"
                  name="name"
                  placeholder="Nombre del comercio"
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

              {/* Descripción */}
              <div className="form-group md:col-span-2">
                <label htmlFor="description" className="form-label">
                  Descripción
                </label>
                <Field
                  as="textarea"
                  className="input input-sm"
                  name="description"
                  rows={3}
                  placeholder="Descripción breve del comercio"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Dirección */}
              <div className="form-group md:col-span-2">
                <label htmlFor="address" className="form-label">
                  Dirección
                </label>
                <Field
                  className="input input-sm"
                  type="text"
                  name="address"
                  placeholder="Dirección física (opcional)"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Imagen */}
              <div className="form-group md:col-span-2">
                <label htmlFor="image" className="form-label">
                  Imagen (URL)
                </label>
                <Field
                  className="input input-sm"
                  type="text"
                  name="image"
                  placeholder="https://ejemplo.com/logo.png"
                />
                <ErrorMessage
                  name="image"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
            </div>
          </div>

          {/* Otros datos solo en edición */}
          {isEdit && (
            <div className="card neumo mt-4">
              <div className="card-header">
                <h3 className="text-md font-semibold">Otros Datos</h3>
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

          <div className="card-footer flex justify-end mt-4">
            <button
              className="btn neumo btn-success ml-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isEdit ? "Actualizar Comercio" : "Registrar Comercio"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormCommerce;
