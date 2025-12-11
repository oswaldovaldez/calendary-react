import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import type { FormikHelpers } from "formik";
// import * as Yup from "yup";
import FormRender from "../../components/FormRenderOld";
import { RECORD_TYPES } from "../../types";
// import { handleApiError } from "../../utils/handleFormErrorApi";
// import ErrorForm from "../../components/ErrorForm";
// import { useState } from "react";

export interface RecordFormValues {
  patient_id: number;
  commerce_id: number;
  record_template_id?: number | null;
  type: string | null;
  data: Record<string, any>;
  record_templates: {
    fields: {
      name: string;
      label: string;
      type: string;
      options?: Record<string, string>;
    }[];
  }[];
}

/*export const recordSchema = Yup.object({
  patient_id: Yup.number().required("El ID del paciente es obligatorio"),
  commerce_id: Yup.number().required("El ID del comercio es obligatorio"),
  record_template_id: Yup.number().nullable(),
  type: Yup.string().nullable(),
  data: Yup.mixed()
    .test("is-valid-json", "Debe ser un objeto JSON válido", (value) => {
      try {
        JSON.stringify(value);
        return true;
      } catch {
        return false;
      }
    })
    .required("La data es obligatoria"),
});*/

interface FormRecordProps {
  initialValues: RecordFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: RecordFormValues,
    helpers: FormikHelpers<RecordFormValues>
  ) => void | Promise<void>;
}

const FormRecord: React.FC<FormRecordProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  // const [backendError, setBackendError] = useState<string | null>(null);
  // const handleWrappedSubmit = async (values: any, helpers: any) => {
  //   setBackendError(null);
  //   try {
  //     await onSubmit(values, helpers);
  //   } catch (apiError: any) {
  //     const formatted = handleApiError(apiError);
  //     setBackendError(formatted);
  //   }
  // };
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-container">
            <div className="card neumo">
              {/* <ErrorForm message={backendError} /> */}
              <div className="card-body">
                {/* Tipo */}
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Tipo (opcional)
                  </label>
                  <Field name="type">
                    {({ field, form }: any) => (
                      <>
                        <input
                          type="text"
                          {...field}
                          list="types"
                          className={`input ${
                            errors.patient_id && touched.patient_id
                              ? "input-invalid"
                              : ""
                          }`}
                          style={{
                            textTransform: "uppercase",
                          }}
                          placeholder="Seleccionar un tipo"
                          onChange={(e: any) =>
                            form.setFieldValue(
                              field.name,
                              e.target.value.toUpperCase()
                            )
                          }
                        />
                        <datalist id="types">
                          {RECORD_TYPES?.map((t: any) => (
                            <option
                              key={`type-option-${t.value}`}
                              value={`${t.value}`}
                            >
                              {t.label}
                            </option>
                          ))}
                        </datalist>
                      </>
                    )}
                  </Field>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
              </div>
            </div>

            {/* Detalles dinámicos (solo en edición o si hay templates) */}

            <div className="card neumo">
              <div className="card-header">
                <h3>Detalles</h3>
              </div>
              <div className="card-body">
                {initialValues.record_templates?.length > 0 &&
                  initialValues.record_templates?.[0].fields?.length > 0 && (
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
            <div className="flex justify-end mt-6">
              <button
                className="btn neumo btn-success ml-auto"
                type="submit"
                disabled={isSubmitting}
              >
                {isEdit ? "Actualizar" : "Registrar"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormRecord;
