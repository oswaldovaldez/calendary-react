import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { IoTrash } from "react-icons/io5"; // ícono de basura

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
  user_id: Yup.number().required("El usuario es obligatorio"),
  day_of_week: Yup.string().required("El día de la semana es obligatorio"),
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
  userId: number;
  // commerceId?: number;
}

const FormSchedule: React.FC<FormScheduleProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
  userId,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={scheduleSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="form-container ">
          {/* comercio_id oculto */}
          <Field type="hidden" name="commerce_id" />

          <div className="">
            <div className="card-body">
              {/* Usuario */}
              <Field
                type="hidden"
                name="user_id"
                value={userId}
                className={`input input-sm`}
              />

              {/* Día de la semana */}
              <div className="form-group">
                <label htmlFor="day_of_week" className="form-label">
                  Día de la semana
                </label>
                <Field
                  as="select"
                  name="day_of_week"
                  className="input input-sm"
                >
                  <option value="">Selecciona un día</option>
                  <option value="monday">Lunes</option>
                  <option value="tuesday">Martes</option>
                  <option value="wednesday">Miércoles</option>
                  <option value="thursday">Jueves</option>
                  <option value="friday">Viernes</option>
                  <option value="saturday">Sábado</option>
                  <option value="sunday">Domingo</option>
                </Field>
                <ErrorMessage
                  name="day_of_week"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Horas */}
              <div className="form-group">
                <label htmlFor="start_time" className="form-label">
                  Hora de inicio
                </label>
                <Field
                  type="time"
                  name="start_time"
                  className="input input-sm"
                />
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              <div className="form-group">
                <label htmlFor="end_time" className="form-label">
                  Hora de fin
                </label>
                <Field type="time" name="end_time" className="input input-sm" />
                <ErrorMessage
                  name="end_time"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
            </div>
          </div>

          {/* Descansos */}
          <div className="py-0">
            <div className="card-header">
              <h3>Descansos</h3>
            </div>
            <div className="card-body">
              <FieldArray name="breaks">
                {(arrayHelpers) => (
                  <>
                    {arrayHelpers.form.values.breaks.map(
                      (_: BreakType, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-[1fr_1fr_auto] gap-1 items-center"
                        >
                          <Field
                            type="time"
                            name={`breaks.${index}.start`}
                            className="input input-sm"
                          />
                          <Field
                            type="time"
                            name={`breaks.${index}.end`}
                            className="input input-sm"
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm flex items-center justify-center p-2"
                            onClick={() => arrayHelpers.remove(index)}
                            aria-label="Eliminar descanso"
                          >
                            <IoTrash size={16} />
                          </button>
                        </div>
                      )
                    )}

                    {/* Botón personalizado */}
                    <button
                      type="button"
                      className="btn btn-add self-end mt-2"
                      onClick={() =>
                        arrayHelpers.push({
                          start: "",
                          end: "",
                        })
                      }
                    >
                      + Agregar descanso
                    </button>
                  </>
                )}
              </FieldArray>
            </div>
          </div>

          {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6 flex justify-end"> */}
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

export default FormSchedule;
