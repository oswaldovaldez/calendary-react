import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";

export interface CategoryOption {
  id: number;
  name: string;
}

export interface ServiceFormValues {
  name: string;
  description: string;
  commerce_id: number;
  category_id: number;
  duration: number;
  duration_type: string;
  price: number;
  price_offer: number;
  session_number: number;
  sessions: boolean;
  home_service: boolean;
  start_offer_at: string | null;
  end_offer_at: string | null;
  options: { name: string; extra_price: number }[];
  _token: string;
}

export const serviceSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string()
    .trim()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .required("La descripción es obligatoria"),
  category_id: Yup.number()
    .typeError("La categoría es obligatoria")
    .required("La categoría es obligatoria"),
  duration: Yup.number()
    .typeError("La duración debe ser un número")
    .positive("La duración debe ser mayor que 0")
    .required("La duración es obligatoria"),
  duration_type: Yup.string()
    .oneOf(["minutes", "hours"], "Debe ser Minutos u Horas")
    .required("El tipo de duración es obligatorio"),
  price: Yup.number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor que 0")
    .required("El precio es obligatorio"),
  price_offer: Yup.number()
    .typeError("El precio de oferta debe ser un número")
    .positive("El precio de oferta debe ser mayor que 0")
    .max(Yup.ref("price"), "Debe ser menor o igual al precio"),
  session_number: Yup.number()
    .min(1, "El número de sesiones debe ser al menos 1")
    .required("El número de sesiones es obligatorio"),
  sessions: Yup.boolean().required("El campo sesiones es obligatorio"),
  home_service: Yup.boolean().required(
    "El campo servicio a domicilio es obligatorio"
  ),
  start_offer_at: Yup.string().nullable(),
  end_offer_at: Yup.string().nullable(),
  options: Yup.array(),
  _token: Yup.string().required(),
  commerce_id: Yup.number().required(),
});

interface FormServiceProps {
  initialValues: ServiceFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: ServiceFormValues,
    helpers: FormikHelpers<ServiceFormValues>
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

  useEffect(() => {
    if (!token || !commerce?.id) return;
    Api.readCategories({
      _token: `${token}`,
      query: { commerce_id: String(commerce.id) },
    })
      .then((res: any) => {
        const mapped = (res.data ?? res).map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        }));
        setCategories(mapped);
      })
      .catch((err) => console.error("Error cargando categorías:", err));
  }, [token, commerce?.id]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={serviceSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
        <div className="card">
          <Form className="form-container">
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

              {/* Descripción */}
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <Field
                  as="textarea"
                  className="input input-sm"
                  name="description"
                  placeholder="Ej. Aplicación de inyeccion tirzepatida"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Categoría */}
              <div className="form-group">
                <label htmlFor="category_id">Categoría</label>
                <Field
                  as="select"
                  name="category_id"
                  className="input input-sm"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category_id"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Duración con selector */}
              <div className="form-group">
                <label>Duración</label>
                <div className="flex gap-2">
                  <Field
                    type="number"
                    className="input input-sm w-24"
                    name="duration"
                    min={1}
                    placeholder="Ej. 45"
                  />
                  <Field
                    as="select"
                    name="duration_type"
                    className="input input-sm w-32"
                  >
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

              {/* Precio */}
              <div className="form-group">
                <label htmlFor="price">Precio</label>
                <Field
                  type="number"
                  className="input input-sm"
                  name="price"
                  min={0}
                  step="0.01"
                  placeholder="Ej. 250.00"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Precio oferta */}
              <div className="form-group">
                <label htmlFor="price_offer">Precio de oferta</label>
                <Field
                  type="number"
                  className="input input-sm"
                  name="price_offer"
                  min={0}
                  step="0.01"
                  placeholder="Ej. 200.00"
                />
                <ErrorMessage
                  name="price_offer"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Número de sesiones */}
              <div className="form-group">
                <label htmlFor="session_number">Número de sesión</label>
                <Field
                  type="number"
                  className="input input-sm"
                  name="session_number"
                  min={1}
                  placeholder="Ej. 1"
                />
                <ErrorMessage
                  name="session_number"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Booleanos */}
              <div className="form-group">
                <Field name="sessions">
                  {({ field, form }: any) => (
                    <label>
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

                <br />

                <Field name="home_service">
                  {({ field, form }: any) => (
                    <label>
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

              {/* Fechas de oferta */}
              <div className="form-group">
                <label htmlFor="start_offer_at">Inicio oferta</label>
                <Field
                  type="date"
                  className="input input-sm"
                  name="start_offer_at"
                />
                <ErrorMessage
                  name="start_offer_at"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              <div className="form-group">
                <label htmlFor="end_offer_at">Fin oferta</label>
                <Field
                  type="date"
                  className="input input-sm"
                  name="end_offer_at"
                />
                <ErrorMessage
                  name="end_offer_at"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Options */}
              <div className="form-group">
                <label htmlFor="options">Opciones (JSON)</label>
                <Field
                  as="textarea"
                  className="input input-sm"
                  name="options"
                  placeholder='[{"name":"Cabello largo","extra_price":50}]'
                />
                <ErrorMessage
                  name="options"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Ocultos */}
              <Field type="hidden" name="commerce_id" />
              <Field type="hidden" name="_token" />
            </div>

            <div className="card-footer">
              <button
                type="submit"
                className="btn neumo btn-success"
                disabled={isSubmitting}
              >
                {isEdit ? "Editar Servicio" : "Registrar Servicio"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default FormService;
