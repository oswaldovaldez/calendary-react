import { Field, FieldArray } from "formik";
import { type ArrayHelpers } from "formik";
import React from "react";

interface FormRenderProps {
  arrayHelpers: ArrayHelpers;
  data: any;
  fields: any;
  prefix?: string;
}

const FormRender = React.memo(
  ({ arrayHelpers, data, fields, prefix = "" }: FormRenderProps) => {
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
              <Field
                as="select"
                className="form-control form-control-sm"
                name={
                  prefix === ""
                    ? `data[${element.name ?? ""}]`
                    : `data[${prefix}[${element.name ?? ""}]]`
                }
                defaultValue={
                  data === null || data === undefined ? "" : data[element.name]
                }
              >
                {Object.entries(element.options).map(([key, labelx], index) => (
                  <option key={`option-${index}`} value={key}>
                    {`${labelx}`}
                  </option>
                ))}
              </Field>
            )}

            {element.type === "multiselect" && (
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
                  data === null || data === undefined ? "" : data[element.name]
                }
              >
                {Object.entries(element.options).map(([key, labelx], index) => (
                  <option key={`option-${index}`} value={key}>
                    {`${labelx}`}
                  </option>
                ))}
              </Field>
            )}

            {element.type === "radio" && (
              <div className="form-control border-0! shadow-none!">
                <label className="label">{element.label ?? ""}</label>
                {Object.entries(element.options).map(([key, labelx], index) => (
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
                ))}
              </div>
            )}

            {element.type === "checkbox" && (
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
            )}

            {/* Grupo como objeto simple */}
            {element.type === "group" && element.isArray !== true && (
              <div className="ml-6 border-l-2 border-gray-300 pl-4 mt-2">
                <FormRender
                  arrayHelpers={arrayHelpers}
                  data={data == null ? null : data[element.name]}
                  fields={element.fields}
                  prefix={
                    prefix === "" ? element.name : `${prefix}[${element.name}]`
                  }
                />
              </div>
            )}

            {/* Grupo como array con botones para duplicar */}
            {element.type === "group" && element.isArray === true && (
              <div className="ml-6 border-l-2 border-blue-300 pl-4 mt-2 bg-blue-50 p-2 rounded">
                
                <FieldArray
                  name={
                    prefix === ""
                      ? `data.${element.name}`
                      : `data.${prefix}.${element.name}`
                  }
                >
                  {(fieldArrayHelpers) => {
                    // Obtener los datos actuales - data[element.name] debería ser un array
                    const currentData = data?.[element.name];

                    // Asegurar que items siempre sea un array válido
                    const items =
                      currentData && Array.isArray(currentData)
                        ? currentData
                        : [];

                    return (
                      <div>
                        {items.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="mb-3 p-3 border-2 border-blue-300 rounded bg-white shadow-sm"
                          >
                            <div className="flex justify-between items-center mb-3 pb-2 border-b">
                              <h4 className="text-sm font-semibold text-blue-700">
                                {element.label} #{idx + 1}
                              </h4>
                              <button
                                type="button"
                                className="btn btn-sm btn-error"
                                onClick={() => fieldArrayHelpers.remove(idx)}
                              >
                                🗑️ Eliminar
                              </button>
                            </div>
                            <FormRender
                              arrayHelpers={fieldArrayHelpers}
                              data={item}
                              fields={element.fields}
                              prefix={
                                prefix === ""
                                  ? `${element.name}[${idx}]`
                                  : `${prefix}.${element.name}[${idx}]`
                              }
                            />
                          </div>
                        ))}

                        {items.length === 0 && (
                          <p className="text-sm text-gray-600 italic mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                            ℹ️ No hay elementos agregados. Haz clic en "Agregar"
                            para comenzar.
                          </p>
                        )}

                        <button
                          type="button"
                          className="btn btn-sm btn-primary mt-2 w-full"
                          onClick={() => {
                            // Crear un objeto vacío basado en element.fields (el template)
                            const emptyObject = element.fields.reduce(
                              (acc: any, field: any) => {
                                if (field.type === "checkbox") {
                                  acc[field.name] = false;
                                } else if (
                                  field.type === "group" &&
                                  field.isArray
                                ) {
                                  acc[field.name] = [];
                                } else if (field.type === "group") {
                                  acc[field.name] = {};
                                } else if (field.type === "number") {
                                  acc[field.name] = null;
                                } else {
                                  acc[field.name] = "";
                                }
                                return acc;
                              },
                              {}
                            );
                            fieldArrayHelpers.push(emptyObject);
                          }}
                        >
                          ➕ Agregar {element.label}
                        </button>
                      </div>
                    );
                  }}
                </FieldArray>
              </div>
            )}

            {element.type === "textarea" && (
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
            )}

            {element.type !== "select" &&
              element.type !== "multiselect" &&
              element.type !== "radio" &&
              element.type !== "checkbox" &&
              element.type !== "group" &&
              element.type !== "textarea" && (
                <Field
                  className={`form-control form-control-sm`}
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
