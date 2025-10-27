import { useState } from "react";
import { Formik, Form, Field, type FormikHelpers } from "formik";
import * as Yup from "yup";
import ErrorForm from "../../components/ErrorForm";
import { handleApiError } from "../../utils/handleFormErrorApi";

export interface CategoryFormValues {
  name: string;
  description: string;
  parent_id: number | null;
  commerce_id: number;
  service: boolean;
  product: boolean;
}

const categorySchema = Yup.object().shape({
  name: Yup.string().required("El nombre de la categoría es obligatorio"),
  description: Yup.string().nullable(),
  service: Yup.boolean().default(false),
  product: Yup.boolean().default(false),
});

interface FormCategoryProps {
  initialValues: CategoryFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: CategoryFormValues,
    helpers: FormikHelpers<CategoryFormValues>
  ) => void | Promise<void>;
}

const FormCategory: React.FC<FormCategoryProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  const [backendError, setBackendError] = useState<string | null>(null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleWrappedSubmit = async (
    values: CategoryFormValues,
    helpers: FormikHelpers<CategoryFormValues>
  ) => {
    setBackendError(null);
    setLocalErrors({});

    // Validación manualmente con Yup
    try {
      await categorySchema.validate(values, { abortEarly: false });
    } catch (validationError: any) {
      const formErrors: Record<string, string> = {};
      validationError.inner.forEach((err: any) => {
        if (err.path) formErrors[err.path] = err.message;
      });
      setLocalErrors(formErrors);
    }

    // Siempre intentamos enviar al backend
    try {
      await onSubmit(values, helpers);
    } catch (apiError: any) {
      const formatted = handleApiError(apiError);
      setBackendError(formatted);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleWrappedSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <div className="card">
          <Form className="form-container">
            {/*Solo errores del backend */}
            <ErrorForm message={backendError} />

            <div className="card-body">
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <Field
                  className={`input input-sm ${localErrors.name ? "input-invalid" : ""}`}
                  type="text"
                  name="name"
                  placeholder="Nombre de la categoría"
                />
                {localErrors.name && (
                  <div className="form-text-invalid">{localErrors.name}</div>
                )}
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <Field
                  className={`input input-sm ${localErrors.description ? "input-invalid" : ""}`}
                  type="text"
                  name="description"
                  placeholder="Descripción breve (opcional)"
                />
                {localErrors.description && (
                  <div className="form-text-invalid">
                    {localErrors.description}
                  </div>
                )}
              </div>
              {/* Servicio */}
              <div className="form-group md:col-span-2">
                <Field name="service">
                  {({ field, form }: any) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(e: any) =>
                          form.setFieldValue(field.name, e.target.checked)
                        }
                      />
                      Categoria de servicios
                    </label>
                  )}
                </Field>
              </div>
              {/* Producto */}
              <div className="form-group md:col-span-2">
                <Field name="product">
                  {({ field, form }: any) => (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(e: any) =>
                          form.setFieldValue(field.name, e.target.checked)
                        }
                      />
                      Categoria de productos
                    </label>
                  )}
                </Field>
              </div>
              {/* Campos ocultos */}
              <Field type="hidden" name="parent_id" />
              <Field type="hidden" name="commerce_id" />
            </div>

            <div className="card-footer">
              <div className="flex justify-end mt-6">
                <button
                  className="btn neumo btn-success ml-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEdit ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default FormCategory;
