import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";

export interface CategoryFormValues {
  name: string;
  description: string;
  parent_id: number | null;
  commerce_id: number;
}

const categorySchema = Yup.object().shape({
  name: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string().nullable(),
});

interface FormCategoryProps {
  initialValues: CategoryFormValues;
  isEdit?: boolean;
  onSubmit: (
    values: CategoryFormValues,
    helpers: FormikHelpers<CategoryFormValues>
  ) => void | Promise<void>;
}

const FormCategory: React.FC<FormCategoryProps> = ({
  initialValues,
  isEdit = false,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={categorySchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting }) => (
        <div className="card">
          <Form className="form-container">
            <div className="card-body">
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <Field
                  className={`input input-sm ${
                    errors.name && touched.name ? "input-invalid" : ""
                  }`}
                  type="text"
                  name="name"
                  placeholder="Nombre de la categoría"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <Field
                  className="input input-sm"
                  type="text"
                  name="description"
                  placeholder="Descripción breve (opcional)"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="form-text-invalid"
                />
              </div>

              {/* Campos ocultos */}
              <Field type="hidden" name="parent_id" />
              <Field type="hidden" name="commerce_id" />
            </div>

            <div className="card-footer">
              <button
                className="btn neumo btn-success ml-auto"
                type="submit"
                disabled={isSubmitting}
              >
                {isEdit ? "Editar Categoría" : "Registrar Categoría"}
              </button>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default FormCategory;
