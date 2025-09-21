import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import FormRender from "../../components/FormRender";

export interface RecordFormValues {
  patient_id: number;
  commerce_id: number;
  record_template_id: number | null;
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

export const recordSchema = Yup.object({
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
});

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
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={recordSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="form-container">
            <div className="card neumo">
              <div className="card-body">
                {/* ID de Paciente */}
                <div className="form-group">
                  <label htmlFor="patient_id" className="form-label">
                    ID de Paciente
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.patient_id && touched.patient_id
                        ? "input-invalid"
                        : ""
                    }`}
                    type="number"
                    name="patient_id"
                  />
                  <ErrorMessage
                    name="patient_id"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* ID de Comercio */}
                <div className="form-group">
                  <label htmlFor="commerce_id" className="form-label">
                    ID de Comercio
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.commerce_id && touched.commerce_id
                        ? "input-invalid"
                        : ""
                    }`}
                    type="number"
                    name="commerce_id"
                  />
                  <ErrorMessage
                    name="commerce_id"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* ID de Plantilla */}
                <div className="form-group">
                  <label htmlFor="record_template_id" className="form-label">
                    ID de Plantilla (opcional)
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.record_template_id && touched.record_template_id
                        ? "input-invalid"
                        : ""
                    }`}
                    type="number"
                    name="record_template_id"
                  />
                  <ErrorMessage
                    name="record_template_id"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>

                {/* Tipo */}
                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Tipo (opcional)
                  </label>
                  <Field
                    className={`input input-sm ${
                      errors.type && touched.type ? "input-invalid" : ""
                    }`}
                    type="text"
                    name="type"
                  />
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="form-text-invalid"
                  />
                </div>
              </div>
            </div>

            {/* Otros datos dinámicos (solo en edición o si hay templates) */}

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

            <button
              className="btn neumo btn-success ml-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isEdit ? "Editar Record" : "Registrar Record"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormRecord;
