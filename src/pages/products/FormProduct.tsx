import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";

export interface ProductFormValues {
	name: string;
	description: string;
	commerce_id: number;
}

interface Commerce {
	id: number;
	name: string;
}

const productSchema = Yup.object().shape({
	name: Yup.string().required("El nombre es obligatorio"),
	description: Yup.string().nullable(),
	commerce_id: Yup.number().required("Debes seleccionar un comercio"),
});

interface FormProductProps {
	initialValues: ProductFormValues;
	commerces: Commerce[];
	isEdit?: boolean;
	onSubmit: (
		values: ProductFormValues,
		helpers: FormikHelpers<ProductFormValues>
	) => void | Promise<void>;
}

const FormProduct: React.FC<FormProductProps> = ({
	initialValues,
	commerces,
	isEdit = false,
	onSubmit,
}) => {
	return (
		<Formik
			initialValues={initialValues}
			validationSchema={productSchema}
			onSubmit={onSubmit}
		>
			{({ errors, touched, isSubmitting, setFieldValue }) => (
				<div className="card">
					<Form className="form-container">
						<div className="card-body">
							{/* Nombre */}
							<div className="form-group">
								<label htmlFor="name">Nombre</label>
								<Field
									className={`input input-sm ${
										errors.name && touched.name
											? "input-invalid"
											: ""
									}`}
									type="text"
									name="name"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"name",
											e.target.value.toUpperCase()
										)
									}
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
								/>
								<ErrorMessage
									name="description"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* commerce_id como select */}
							<div className="form-group">
								<label htmlFor="commerce_id">Comercio</label>
								<Field
									as="select"
									name="commerce_id"
									className={`input input-sm ${
										errors.commerce_id &&
										touched.commerce_id
											? "input-invalid"
											: ""
									}`}
								>
									<option value="">
										-- Selecciona un comercio --
									</option>
									{commerces.map((c) => (
										<option key={c.id} value={c.id}>
											{c.name}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="commerce_id"
									component="div"
									className="form-text-invalid"
								/>
							</div>
						</div>

						<div className="card-footer">
							<button
								className="btn btn-success ml-auto"
								type="submit"
								disabled={isSubmitting}
							>
								{isEdit
									? "Editar Producto"
									: "Registrar Producto"}
							</button>
						</div>
					</Form>
				</div>
			)}
		</Formik>
	);
};

export default FormProduct;
