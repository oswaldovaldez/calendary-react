import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

export interface ProductFormValues {
	name: string;
	description: string;
	commerce_id: number;
}

export const productSchema = Yup.object({
	name: Yup.string()
		.trim()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.required("El nombre es obligatorio"),
	description: Yup.string().nullable(),
	commerce_id: Yup.number().required("El comercio es obligatorio"),
});

interface FormProductProps {
	initialValues: ProductFormValues;
	isEdit?: boolean;
	onSubmit: (
		values: ProductFormValues,
		helpers: FormikHelpers<ProductFormValues>
	) => void | Promise<void>;
}

const FormProduct: React.FC<FormProductProps> = ({
	initialValues,
	isEdit = false,
	onSubmit,
}) => {
	return (
		<Formik
			initialValues={initialValues}
			validationSchema={productSchema}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ errors, touched, isSubmitting }) => (
				<Form className="form-container">
					<div className="card neumo">
						<div className="card-body grid gap-4 md:grid-cols-2">
							{/* Nombre */}
							<div className="form-group md:col-span-2">
								<label htmlFor="name" className="form-label">
									Nombre
								</label>
								<Field
									className={`input input-sm ${
										errors.name && touched.name
											? "input-invalid"
											: ""
									}`}
									type="text"
									name="name"
									placeholder="Nombre del producto"
								/>
								<ErrorMessage
									name="name"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Descripción */}
							<div className="form-group md:col-span-2">
								<label
									htmlFor="description"
									className="form-label"
								>
									Descripción
								</label>
								<Field
									as="textarea"
									className="input input-sm"
									name="description"
									rows={3}
									placeholder="Descripción breve del producto"
								/>
								<ErrorMessage
									name="description"
									component="div"
									className="form-text-invalid"
								/>
							</div>
						</div>
					</div>

					<div className="card-footer flex justify-end mt-4">
						<button
							className="btn neumo btn-success ml-auto"
							type="submit"
							disabled={isSubmitting}
						>
							{isEdit ? "Actualizar Producto" : "Registrar Producto"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default FormProduct;
