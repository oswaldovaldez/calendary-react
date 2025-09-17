import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { userSchema, userSchemaEdit } from "../../schemas/userSchema";
const FormUser = ({ initialValues, isEdit = false, onSubmit }) => {
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={isEdit ? userSchemaEdit : userSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <div className="card">
            <Form className="form-container">
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
                <div className="form-control">
                  <label htmlFor="data" className="form-label">
                    Otros Datos
                  </label>
                </div>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-success ml-auto"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isEdit ? "Editar" : "Registrar"}
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default FormUser;
