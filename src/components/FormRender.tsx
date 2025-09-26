import { Field } from "formik";
import React from "react";

const FormRender = ({ arrayHelpers, initialValues }) => {
  if ((initialValues.record_templates?.length ?? 0) === 0) {
    return <></>;
  }
  return (
    <>
      {initialValues.record_templates[0].fields.map((element, indexE) => (
        <div className="form-group mt-2" key={`element-${indexE}`}>
          <label htmlFor={`data[${element.name ?? ""}]`} className="form-label">
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
                {Object.entries(element.options).map(([key, labelx], index) => (
                  <option key={`option-${index}`} value={key}>
                    {labelx ?? ""}
                  </option>
                ))}
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
                {Object.entries(element.options).map(([key, labelx], index) => (
                  <option key={`option-${index}`} value={key}>
                    {labelx ?? ""}
                  </option>
                ))}
              </Field>
            </>
          )}
          {element.type === "group" && <></>}
          {element.type === "textarea" && (
            <>
              <Field
                as="textarea"
                className={`input input-sm ${element.type === "textarea" && "textarea"}`}
                type={element.type}
                name={`data[${element.name ?? ""}]`}
                defaultValue={
                  initialValues.data === null
                    ? ""
                    : (initialValues.data[element.name] ?? "")
                }
              />
            </>
          )}
          {element.type !== "select" &&
            element.type !== "multiselect" &&
            element.type !== "group" &&
            element.type !== "textarea" && (
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
    </>
  );
};

export default FormRender;
