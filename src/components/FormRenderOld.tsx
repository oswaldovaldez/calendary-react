import { Field } from "formik";
import { type ArrayHelpers } from "formik";
import React from "react";

interface FormRenderProps {
  arrayHelpers: ArrayHelpers;
  data: any; // Replace 'any' with the actual type of your initialValues
  fields: any; // Replace 'any' with the actual type of your initialValues
  prefix?: string;
}

const FormRender = React.memo(
  ({ arrayHelpers, data, fields, prefix = "" }: FormRenderProps) => {
    // console.log(data);

    // console.log("fields", fields, "data", data);
    if ((fields.length ?? 0) === 0) {
      return <></>;
    }
    return (
      <>
        {fields.map((element: any, indexE: number) => (
          <div className="form-group mt-2" key={`element-${indexE}`}>
            {element.type !== "radio" && element.type !== "checkbox" && (
              <label
                htmlFor={
                  prefix === ""
                    ? `data[${element.name ?? ""}]`
                    : `data[${prefix}[${element.name ?? ""}]]`
                }
                className="form-label"
              >
                {element.label ?? ""}
              </label>
            )}
            {element.type === "select" && (
              <>
                <Field
                  as="select"
                  className="form-control form-control-sm"
                  name={
                    prefix === ""
                      ? `data[${element.name ?? ""}]`
                      : `data[${prefix}[${element.name ?? ""}]]`
                  }
                  defaultValue={
                    data === null || data === undefined
                      ? ""
                      : data[element.name]
                  }
                >
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <option key={`option-${index}`} value={key}>
                        {`${labelx}`}
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
                  className="form-control form-control-sm"
                  name={
                    prefix === ""
                      ? `data[${element.name ?? ""}]`
                      : `data[${prefix}[${element.name ?? ""}]]`
                  }
                  multiple
                  defaultValue={
                    data === null || data === undefined
                      ? ""
                      : data[element.name]
                  }
                >
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <option key={`option-${index}`} value={key}>
                        {`${labelx}`}
                      </option>
                    )
                  )}
                </Field>
              </>
            )}
            {element.type === "radio" && (
              <>
                <div className="form-control  border-0! shadow-none!">
                  <label className="label">{element.label ?? ""}</label>
                  {Object.entries(element.options).map(
                    ([key, labelx], index) => (
                      <label
                        className="cursor-pointer label"
                        key={`option-${index}`}
                      >
                        <Field
                          type="radio"
                          name={
                            prefix === ""
                              ? `data[${element.name ?? ""}]`
                              : `data[${prefix}[${element.name ?? ""}]]`
                          }
                          value={key}
                          className="radio"
                          defaultChecked={
                            data === null || data === undefined
                              ? false
                              : data[element.name] === key
                          }
                        />
                        <span className="ml-2">{`${labelx}`}</span>
                      </label>
                    )
                  )}
                </div>
              </>
            )}
            {element.type === "checkbox" && (
              <>
                <div className="form-control border-0! shadow-none!">
                  <label className="cursor-pointer label">
                    <Field
                      type="checkbox"
                      name={
                        prefix === ""
                          ? `data[${element.name ?? ""}]`
                          : `data[${prefix}[${element.name ?? ""}]]`
                      }
                      className="checkbox"
                      defaultChecked={
                        data === null
                          ? false
                          : data[element.name] === true ||
                            data[element.name] === "true"
                      }
                    />
                    <span className="ml-2">{element.label ?? ""}</span>
                  </label>
                </div>
              </>
            )}
            {element.type === "group" && (
              <div className="ml-6">
                <FormRender
                  arrayHelpers={arrayHelpers}
                  data={data == null ? null : data[element.name]}
                  fields={element.fields}
                  prefix={element.name}
                />
              </div>
            )}
            {element.type === "textarea" && (
              <>
                <Field
                  as="textarea"
                  className={`form-control form-control-sm ${element.type === "textarea" && "textarea"}`}
                  type={element.type}
                  name={
                    prefix === ""
                      ? `data[${element.name ?? ""}]`
                      : `data[${prefix}[${element.name ?? ""}]]`
                  }
                  defaultValue={
                    data === null || data === undefined
                      ? ""
                      : (data[element.name] ?? "")
                  }
                />
              </>
            )}
            {element.type !== "select" &&
              element.type !== "multiselect" &&
              element.type !== "radio" &&
              element.type !== "checkbox" &&
              element.type !== "group" &&
              element.type !== "textarea" && (
                <Field
                  className={`form-control form-control-sm ${element.type === "checkbox" ? "checkbox" : ""} ${element.type === "radio" ? "radio" : ""}`}
                  type={element.type}
                  name={
                    prefix === ""
                      ? `data[${element.name ?? ""}]`
                      : `data[${prefix}[${element.name ?? ""}]]`
                  }
                  defaultValue={
                    data === null || data === undefined
                      ? ""
                      : (data?.[element.name] ?? "")
                  }
                />
              )}
          </div>
        ))}
      </>
    );
  }
);

export default FormRender;
