import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

export interface BreakType {
  start: string;
  end: string;
}

export interface ScheduleFormValues {
  commerce_id: number;
  user_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  breaks: BreakType[];
}

export const scheduleSchema = Yup.object({
  commerce_id: Yup.number().required(),
  user_id: Yup.number().required("El usuario es obligatorio"),
  day_of_week: Yup.string()
    .required("El día de la semana es obligatorio"),
  start_time: Yup.string().required("La hora de inicio es obligatoria"),
  end_time: Yup.string().required("La hora de fin es obligatoria"),
  breaks: Yup.array().of(
    Yup.object({
      start: Yup.string().required("Inicio obligatorio"),
      end: Yup.string().required("Fin obligatorio"),
    })
  ),
});

interface FormScheduleProps {
  initialValues: ScheduleFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: ScheduleFormValues,
    helpers: FormikHelpers<ScheduleFormValues>
  ) => void | Promise<void>;
  users: { id: number; name: string }[];
}

const FormSchedule: React.FC<FormScheduleProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
  users,
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={scheduleSchema}
    onSubmit={onSubmit}
  >
    {({ errors, touched, isSubmitting }) => (
      <Form className="form-container">
        {/* comercio_id oculto */}
        <Field type="hidden" name="commerce_id" />

        <div className="card neumo">
          <div className="card-body">
            {/* Usuario */}
            <div className="form-group">
              <label htmlFor="user_id" className="form-label">Usuario</label>
              <Field
                as="select"
                name="user_id"
                className={`input input-sm ${
                  errors.user_id && touched.user_id ? "input-invalid" : ""
                }`}
              >
                <option value="">Selecciona un usuario</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="user_id" component="div" className="form-text-invalid" />
            </div>

            {/* Día de la semana */}
            <div className="form-group">
              <label htmlFor="day_of_week" className="form-label">Día de la semana</label>
              <Field as="select" name="day_of_week" className="input input-sm">
                <option value="">Selecciona un día</option>
                <option value="monday">Lunes</option>
                <option value="tuesday">Martes</option>
                <option value="wednesday">Miércoles</option>
                <option value="thursday">Jueves</option>
                <option value="friday">Viernes</option>
                <option value="saturday">Sábado</option>
                <option value="sunday">Domingo</option>
              </Field>
              <ErrorMessage name="day_of_week" component="div" className="form-text-invalid" />
            </div>

            {/* Horas */}
            <div className="form-group">
              <label htmlFor="start_time" className="form-label">Hora de inicio</label>
              <Field type="time" name="start_time" className="input input-sm" />
              <ErrorMessage name="start_time" component="div" className="form-text-invalid" />
            </div>
            <div className="form-group">
              <label htmlFor="end_time" className="form-label">Hora de fin</label>
              <Field type="time" name="end_time" className="input input-sm" />
              <ErrorMessage name="end_time" component="div" className="form-text-invalid" />
            </div>
          </div>
        </div>

        {/* Descansos */}
        <div className="card neumo">
          <div className="card-header">
            <h3>Descansos</h3>
          </div>
          <div className="card-body">
            <FieldArray
              name="breaks"
              render={(arrayHelpers) => (
                <div>
                  {arrayHelpers.form.values.breaks.map(
                    (_: BreakType, index: number) => (
                      <div key={index} className="form-group flex gap-2">
                        <Field type="time" name={`breaks.${index}.start`} className="input input-sm" />
                        <Field type="time" name={`breaks.${index}.end`} className="input input-sm" />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )
                  )}
                  <button
                    type="button"
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => arrayHelpers.push({ start: "", end: "" })}
                  >
                    Agregar descanso
                  </button>
                </div>
              )}
            />
          </div>
        </div>

        <button
          className="btn neumo btn-success ml-auto"
          type="submit"
          disabled={isSubmitting}
        >
          {isEdit ? "Editar Horario" : "Registrar Horario"}
        </button>
      </Form>
    )}
  </Formik>
);

export default FormSchedule;
