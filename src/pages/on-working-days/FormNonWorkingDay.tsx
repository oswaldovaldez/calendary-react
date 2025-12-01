// ============================================
// non-working-days/FormNonWorkingDay.tsx
// ============================================
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import ErrorForm from "../../components/ErrorForm";
import { handleApiError } from "../../utils/handleFormErrorApi";
import { useState } from "react";

export interface NonWorkingDayFormValues {
  commerce_id: number | null;
  user_id: number | null;
  type: "day_off" | "vacation" | "sick_leave" | "other" | "";
  start_date: string;
  end_date: string | null;
  notes: string | null;
}

export const nonWorkingDaySchema = Yup.object({
  type: Yup.string()
    .required("El tipo de día no laborable es obligatorio")
    .oneOf(["day_off", "vacation", "sick_leave", "other"], "Tipo no válido"),
  start_date: Yup.string().required("La fecha de inicio es obligatoria"),
  end_date: Yup.string().nullable(),
  notes: Yup.string()
    .max(500, "Las notas no pueden exceder 500 caracteres")
    .nullable(),
});

interface FormNonWorkingDayProps {
  initialValues: NonWorkingDayFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: NonWorkingDayFormValues,
    helpers: FormikHelpers<NonWorkingDayFormValues>
  ) => void | Promise<void>;
  userId: number;
}

const FormNonWorkingDay: React.FC<FormNonWorkingDayProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
  userId,
}) => {
  const [backendError, setBackendError] = useState<string | null>(null);
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
      validationSchema={nonWorkingDaySchema}
      onSubmit={handleWrappedSubmit}
    >
      {() => (
        <Form className="form-container">
          <ErrorForm message={backendError} />
          <Field type="hidden" name="commerce_id" />
          <Field type="hidden" name="user_id" value={userId} />

          <div className="card-body">
            {/* Tipo */}
            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Tipo de día no laborable
              </label>
              <Field as="select" name="type" className="input input-sm">
                <option value="">Seleccionar...</option>
                <option value="day_off">Día libre</option>
                <option value="vacation">Vacaciones</option>
                <option value="sick_leave">Incapacidad médica</option>
                <option value="other">Otro</option>
              </Field>
              <ErrorMessage
                name="type"
                component="div"
                className="form-text-invalid"
              />
            </div>

            {/* Fecha de inicio */}
            <div className="form-group">
              <label htmlFor="start_date" className="form-label">
                Fecha de inicio
              </label>
              <Field type="date" name="start_date" className="input input-sm" />
              <ErrorMessage
                name="start_date"
                component="div"
                className="form-text-invalid"
              />
            </div>

            {/* Fecha de fin */}
            <div className="form-group">
              <label htmlFor="end_date" className="form-label">
                Fecha de fin (opcional)
              </label>
              <Field type="date" name="end_date" className="input input-sm" />
              <ErrorMessage
                name="end_date"
                component="div"
                className="form-text-invalid"
              />
            </div>

            {/* Notas */}
            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notas
              </label>
              <Field
                as="textarea"
                name="notes"
                className="input input-sm"
                placeholder="Notas adicionales (opcional)"
                rows={3}
              />
              <ErrorMessage
                name="notes"
                component="div"
                className="form-text-invalid"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="btn btn-primary btn-sm w-auto px-4"
              type="submit"
            >
              {isEdit ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormNonWorkingDay;
