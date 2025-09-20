import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { userSchema, userSchemaEdit } from "../../schemas/userSchema";
const FormUser = ({ initialValues, isEdit = false, onSubmit }) => {
  const formRender = (arrayHelpers: any) => {
    return (
      <div>
        {initialValues.record_templates[0].fields.map((element, indexE) => (
          <div className="form-control mt-2" key={`element-${indexE}`}>
            <label
              htmlFor={`data[${element.name ?? ""}]`}
              className="form-label"
            >
              {element.label ?? ""}
            </label>
            {element.type === "select" && (
              <>
                <Field
                  as="select"
                  className="input input-sm"
                  name={`data[${element.name ?? ""}]`}
                  defaultValue={
                    initialValues.data === null
                      ? ""
                      : initialValues.data[element.name]
                  }
                >
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <option key={`option-${index}`} value={key}>
                        {labelx ?? ""}
                      </option>
                    )
                  )}
                </Field>
              </>
            )}
            {element.type === "multiselect" && (
              <>
                <Field
                  as="select"
                  className="input input-sm"
                  name={`data[${element.name ?? ""}]`}
                  multiple
                  defaultValue={
                    initialValues.data === null
                      ? ""
                      : initialValues.data[element.name]
                  }
                >
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <option key={`option-${index}`} value={key}>
                        {labelx ?? ""}
                      </option>
                    )
                  )}
                </Field>
              </>
            )}
            {element.type !== "select" && element.type !== "multiselect" && (
              <Field
                className={`input input-sm ${element.type === "textarea" && "textarea"}`}
                type={element.type}
                name={`data[${element.name ?? ""}]`}
                defaultValue={
                  initialValues.data === null
                    ? ""
                    : (initialValues.data[element.name] ?? "")
                }
              />
            )}
          </div>
        ))}
      </div>
    );
  };

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
              </div>
            </div>
            {isEdit && (
              <div className="card neumo">
                <div className="card-header">
                  <h3>Otros Datos</h3>
                </div>
                <div className="card-body">
                  <FieldArray name="data" render={formRender} />
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
