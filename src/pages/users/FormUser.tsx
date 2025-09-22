import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { userSchema, userSchemaEdit } from "../../schemas/userSchema";
import FormRender from "../../components/FormRender";
import { useAuthStore } from "../../store/auth.store";
const FormUser = ({ initialValues, isEdit = false, onSubmit }) => {
  const rolesStore = useAuthStore((s) => s.roles);
  const roleUser = useAuthStore((s) => s.user.roles[0]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={isEdit ? userSchemaEdit : userSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-container">
            <div className="card neumo">
              <div className="card-body">
                <div className="form-group">
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
                    {rolesStore.map((roleStore, indexStore) => (
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
              <div className="card neumo">
                <div className="card-header">
                  <h3>Otros Datos</h3>
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
            <button
              className="btn neumo btn-success ml-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isEdit ? "Editar" : "Registrar"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormUser;
