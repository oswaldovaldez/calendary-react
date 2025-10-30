import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { userSchema, userSchemaEdit } from "../../schemas/userSchema";
import FormRender from "../../components/FormRenderOld";
import { useAuthStore } from "../../store/auth.store";
import { SchedulesIndex } from "../schedules";

const FormUser = ({ initialValues, isEdit = false, onSubmit }: any) => {
  const rolesStore = useAuthStore((s) => s.roles);
  const roleUser = useAuthStore((s) => s.user.roles[0]);
  const commerce = useAuthStore((s) => s.commerce);
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={isEdit ? userSchemaEdit : userSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-container">
            <Field type="hidden" name="commerce_id" value={commerce?.id ?? 0} />
            <div className="card neumo">
              <div className="card-body grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="form-group md:col-span-2">
                  <label htmlFor="name" className="form-label">
                    Nombre
                  </label>
                  <Field
                    className={`input input-sm ${errors.name && touched.name ? "input-invalid" : ""}`}
                    type="text"
                    name="name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo Electronico
                  </label>
                  <Field
                    className={`input input-sm ${errors.email && touched.email ? "input-invalid" : ""}`}
                    type="email"
                    name="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.password && touched.password ? "input-invalid" : ""
                    }`}
                    type="password"
                    name="password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    Rol
                  </label>
                  <Field
                    as="select"
                    className={`input input-sm ${
                      errors.role && touched.role ? "input-invalid" : ""
                    }`}
                    type="select"
                    name="role"
                    defaultValue={
                      isEdit
                        ? (initialValues.roles?.[0]?.name ?? "staff")
                        : "staff"
                    }
                  >
                    {rolesStore.map((roleStore: any, indexStore: number) => (
                      <option
                        value={roleStore.name}
                        key={`option-role-${indexStore}`}
                        disabled={
                          roleUser.name !== "admin" &&
                          roleUser.name !== "superadmin"
                        }
                      >
                        {roleStore.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
              </div>
            </div>
            {isEdit && (
              <>
                <div className="card neumo">
                  <div className="card-header">
                    <h3>Detalles</h3>
                  </div>
                  <div className="card-body grid gap-4 grid-cols-1 md:grid-cols-2">
                    {initialValues.record_templates?.length > 0 &&
                      initialValues.record_templates?.[0].fields?.length >
                        0 && (
                        <FieldArray
                          name="data"
                          render={(arrayHelpers: any) => (
                            <FormRender
                              arrayHelpers={arrayHelpers}
                              data={initialValues.data}
                              fields={
                                initialValues.record_templates?.[0].fields ?? []
                              }
                            />
                          )}
                        />
                      )}
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-end mt-6"></div>
            <button
              className="btn neumo btn-success ml-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isEdit ? "Actualizar" : "Registrar"}
            </button>
          </Form>
        )}
      </Formik>
      {isEdit && (
        <div className="card neumo mt-4">
          <div className="card-header">
            <h3>Horarios</h3>
          </div>
          <div className="card-body">
            <SchedulesIndex
              userId={initialValues.id}
              scheduleArray={initialValues.schedules}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormUser;
