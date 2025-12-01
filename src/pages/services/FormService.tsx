import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { ServiceType } from "../../types";
import ErrorForm from "../../components/ErrorForm";
import { handleApiError } from "../../utils/handleFormErrorApi";

export interface CategoryOption {
  id: number;
  name: string;
  service: boolean;
}

export const serviceSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string()
    .trim()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .nullable(),
  duration: Yup.number()
    .typeError("La duración debe ser un número")
    .positive("Debe ser mayor que 0")
    .required("La duración es obligatoria"),
  duration_type: Yup.string()
    .oneOf(["minutes", "hours"], "Debe ser minutos u horas")
    .required("El tipo de duración es obligatorio"),
  price: Yup.number()
    .typeError("El precio debe ser un número")
    .min(0, "No puede ser negativo")
    .required("El precio es obligatorio"),
  price_offer: Yup.number().nullable(),
  sessions: Yup.boolean(),
  session_number: Yup.number().when("sessions", {
    is: true,
    then: (schema) =>
      schema
        .required("Debes indicar el número de sesiones")
        .min(1, "Debe ser al menos 1"),
    otherwise: (schema) => schema.notRequired(),
  }),
  home_service: Yup.boolean(),
  start_offer_at: Yup.string().nullable(),
  end_offer_at: Yup.string().nullable(),
  _token: Yup.string().required(),
});

interface FormServiceProps {
  initialValues: ServiceType;
  isEdit?: boolean;
  onSubmit: (
    values: ServiceType,
    helpers: FormikHelpers<ServiceType>
  ) => void | Promise<void>;
}

const FormService: React.FC<FormServiceProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !commerce?.id) return;
    Api.readCategories({
      _token: `${token}`,
      query: { commerce_id: String(commerce.id), all: "true" },
    })
      .then((res: any) => {
        const mapped = (res.data ?? res).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          service: cat.service,
        }));
        setCategories(mapped);
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, [token, commerce?.id]);

  const handleWrappedSubmit = async (values: any, helpers: any) => {
    setBackendError(null);
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
      validationSchema={serviceSchema}
      onSubmit={handleWrappedSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, isSubmitting }) => (
        <Form className="form-container card">
          <ErrorForm message={backendError} />
          <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group md:col-span-2">
              <label htmlFor="name" className="form-label required">
                Nombre
              </label>
              <Field name="name">
                {({ field, form }: any) => (
                  <input
                    type="text"
                    {...field}
                    className={`input ${
                      errors.name && touched.name ? "input-invalid" : ""
                    }`}
                    style={{ textTransform: "uppercase" }}
                    placeholder="Ej. INYECCIÓN TIRZEPATIDA"
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

            <div className="form-group md:col-span-2">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <Field
                as="textarea"
                name="description"
                className="input"
                placeholder="Ej. Aplicación de inyección tirzepatida"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="form-text-invalid"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Categorías</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Field name="categories">
                  {({ field, form }: any) => {
                    const value = Array.isArray(field.value) ? field.value : [];
                    return categories.length > 0 ? (
                      categories.map((category) => {
                        const isChecked = value.includes(category.id);
                        return (
                          category.service && (
                            <label
                              key={category.id}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    form.setFieldValue("categories", [
                                      ...value,
                                      category.id,
                                    ]);
                                  } else {
                                    form.setFieldValue(
                                      "categories",
                                      value.filter(
                                        (id: number) => id !== category.id
                                      )
                                    );
                                  }
                                }}
                              />
                              {category.name}
                            </label>
                          )
                        );
                      })
                    ) : (
                      <p className="text-gray-500">
                        No hay categorías disponibles.
                      </p>
                    );
                  }}
                </Field>
              </div>
              <ErrorMessage
                name="categories"
                component="div"
                className="form-text-invalid"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration" className="form-label required">
                Duración
              </label>
              <div className="flex gap-2">
                <Field
                  type="number"
                  name="duration"
                  className="input w-24"
                  min={1}
                  placeholder="Ej. 45"
                />
                <Field as="select" name="duration_type" className="input w-32">
                  <option value="">Selecciona</option>
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                </Field>
              </div>
              <ErrorMessage
                name="duration"
                component="div"
                className="form-text-invalid"
              />
              <ErrorMessage
                name="duration_type"
                component="div"
                className="form-text-invalid"
              />
            </div>

            <div className="form-group md:col-span-2">
              <Field name="sessions">
                {({ field, form }: any) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e: any) =>
                        form.setFieldValue(field.name, e.target.checked)
                      }
                    />
                    Tiene sesiones múltiples
                  </label>
                )}
              </Field>
              <ErrorMessage
                name="sessions"
                component="div"
                className="form-text-invalid"
              />
            </div>

            {values.sessions && (
              <div className="form-group">
                <label htmlFor="session_number" className="form-label required">
                  Número de sesiones
                </label>
                <Field
                  type="number"
                  name="session_number"
                  className="input"
                  min={1}
                  placeholder="Ej. 5"
                />
                <ErrorMessage
                  name="session_number"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
            )}

            <div className="form-group md:col-span-2">
              <label className="form-label required">Precio y oferta</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Field
                    type="number"
                    name="price"
                    className="input"
                    min={0}
                    step="0.01"
                    placeholder="Precio normal"
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
                <div className="flex-1">
                  <Field
                    type="number"
                    name="price_offer"
                    className="input"
                    min={0}
                    step="0.01"
                    placeholder="Precio oferta"
                  />
                  <ErrorMessage
                    name="price_offer"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
              </div>
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Duración de oferta</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Inicio</label>
                  <Field type="date" name="start_offer_at" className="input" />
                  <ErrorMessage
                    name="start_offer_at"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500">Fin</label>
                  <Field type="date" name="end_offer_at" className="input" />
                  <ErrorMessage
                    name="end_offer_at"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
              </div>
            </div>

            <div className="form-group md:col-span-2">
              <Field name="home_service">
                {({ field, form }: any) => (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e: any) =>
                        form.setFieldValue(field.name, e.target.checked)
                      }
                    />
                    Servicio a domicilio
                  </label>
                )}
              </Field>
              <ErrorMessage
                name="home_service"
                component="div"
                className="form-text-invalid"
              />
            </div>

            <Field type="hidden" name="commerce_id" />
            <Field type="hidden" name="_token" />
          </div>

          <div className="card-footer flex justify-end mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isEdit ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormService;
