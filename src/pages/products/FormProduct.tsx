import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

export interface ProductFormValues {
	category_id: number;
	sku: string;
	name: string;
	barcode: string | null;
	brand: string;
	status: boolean;
	description: string;
	format: string;
	cost: number;
	price: number;
	price_with_discount: number;
	commission: number;
	iva: number;
	stock: number;
	stock_alert: number;
	active: boolean;
	image: string | null;
}

export const productSchema = Yup.object({
	sku: Yup.string().required("El SKU es obligatorio"),
	name: Yup.string().trim().required("El nombre es obligatorio"),
	category_id: Yup.number().required("La categoría es obligatoria"),
	barcode: Yup.string().nullable(),
	brand: Yup.string().required("La marca es obligatoria"),
	status: Yup.boolean().required(),
	description: Yup.string().nullable(),
	format: Yup.string().required("El formato es obligatorio"),
	cost: Yup.number()
		.typeError("Debe ser un número")
		.required("El costo es obligatorio"),
	price: Yup.number()
		.typeError("Debe ser un número")
		.required("El precio es obligatorio"),
	price_with_discount: Yup.number()
		.typeError("Debe ser un número")
		.required("El precio con descuento es obligatorio"),
	commission: Yup.number()
		.typeError("Debe ser un número")
		.required("La comisión es obligatoria"),
	iva: Yup.number()
		.typeError("Debe ser un número")
		.required("El IVA es obligatorio"),
	stock: Yup.number()
		.typeError("Debe ser un número")
		.required("El stock es obligatorio"),
	stock_alert: Yup.number().typeError("Debe ser un número").nullable(),
	active: Yup.boolean().required(),
	image: Yup.string().url("Debe ser una URL válida").nullable(),
});

interface FormProductProps {
	initialValues: ProductFormValues;
	categories: { id: number; name: string }[];
	isEdit?: boolean;
	onSubmit: (
		values: ProductFormValues,
		helpers: FormikHelpers<ProductFormValues>
	) => void | Promise<void>;
}

const FormProduct: React.FC<FormProductProps> = ({
	initialValues,
	categories,
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
			{({ errors, touched, isSubmitting, setFieldValue }) => (
				<Form className="form-container">
					<div className="card neumo">
						<div className="card-body grid gap-4 md:grid-cols-2">
							{/* Nombre */}
							<div className="form-group md:col-span-2">
								<label htmlFor="name" className="form-label">
									Nombre
								</label>
								<Field
									className={`input input-sm ${errors.name && touched.name ? "input-invalid" : ""}`}
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

							{/* Categoría */}
							<div className="form-group">
								<label
									htmlFor="category_id"
									className="form-label"
								>
									Categoría
								</label>
								<Field
									as="select"
									name="category_id"
									className={`input input-sm ${errors.category_id && touched.category_id ? "input-invalid" : ""}`}
									onChange={(
										e: React.ChangeEvent<HTMLSelectElement>
									) => {
										const value = e.target.value
											? parseInt(e.target.value, 10)
											: "";
										setFieldValue("category_id", value);
									}}
								>
									<option value="">
										-- Selecciona una categoría --
									</option>
									{categories.map((category) => (
										<option
											key={category.id}
											value={category.id}
										>
											{category.name}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="category_id"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* SKU */}
							<div className="form-group">
								<label htmlFor="sku" className="form-label">
									SKU
								</label>
								<Field
									className={`input input-sm ${errors.sku && touched.sku ? "input-invalid" : ""}`}
									type="text"
									name="sku"
									placeholder="SKU"
								/>
								<ErrorMessage
									name="sku"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Código de barras */}
							<div className="form-group">
								<label htmlFor="barcode" className="form-label">
									Código de barras
								</label>
								<Field
									className="input input-sm"
									type="text"
									name="barcode"
									placeholder="Código de barras (opcional)"
								/>
								<ErrorMessage
									name="barcode"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Marca */}
							<div className="form-group">
								<label htmlFor="brand" className="form-label">
									Marca
								</label>
								<Field
									className={`input input-sm ${errors.brand && touched.brand ? "input-invalid" : ""}`}
									type="text"
									name="brand"
									placeholder="Marca"
								/>
								<ErrorMessage
									name="brand"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Formato */}
							<div className="form-group">
								<label htmlFor="format" className="form-label">
									Formato
								</label>
								<Field
									className={`input input-sm ${errors.format && touched.format ? "input-invalid" : ""}`}
									type="text"
									name="format"
									placeholder="Formato"
								/>
								<ErrorMessage
									name="format"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Costo */}
							<div className="form-group">
								<label htmlFor="cost" className="form-label">
									Costo
								</label>
								<Field
									className={`input input-sm ${errors.cost && touched.cost ? "input-invalid" : ""}`}
									type="number"
									name="cost"
									step="0.01"
									placeholder="409.00"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"cost",
											parseFloat(e.target.value)
										)
									}
								/>
								<ErrorMessage
									name="cost"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Precio */}
							<div className="form-group">
								<label htmlFor="price" className="form-label">
									Precio
								</label>
								<Field
									className={`input input-sm ${errors.price && touched.price ? "input-invalid" : ""}`}
									type="number"
									name="price"
									step="0.01"
									placeholder="850.00"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"price",
											parseFloat(e.target.value)
										)
									}
								/>
								<ErrorMessage
									name="price"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Precio con descuento */}
							<div className="form-group">
								<label
									htmlFor="price_with_discount"
									className="form-label"
								>
									Precio con descuento
								</label>
								<Field
									className="input input-sm"
									type="number"
									name="price_with_discount"
									step="0.01"
									placeholder="0.00"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"price_with_discount",
											parseFloat(e.target.value)
										)
									}
								/>
								<ErrorMessage
									name="price_with_discount"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Comisión */}
							<div className="form-group">
								<label
									htmlFor="commission"
									className="form-label"
								>
									Comisión
								</label>
								<Field
									className="input input-sm"
									type="number"
									name="commission"
									step="0.01"
									placeholder="0.00"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"commission",
											parseFloat(e.target.value)
										)
									}
								/>
								<ErrorMessage
									name="commission"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* IVA */}
							<div className="form-group">
								<label htmlFor="iva" className="form-label">
									IVA
								</label>
								<Field
									className={`input input-sm ${errors.iva && touched.iva ? "input-invalid" : ""}`}
									type="number"
									name="iva"
									placeholder="16"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"iva",
											parseFloat(e.target.value)
										)
									}
								/>
								<ErrorMessage
									name="iva"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Stock */}
							<div className="form-group">
								<label htmlFor="stock" className="form-label">
									Stock
								</label>
								<Field
									className={`input input-sm ${errors.stock && touched.stock ? "input-invalid" : ""}`}
									type="number"
									name="stock"
									placeholder="1"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"stock",
											parseInt(e.target.value, 10)
										)
									}
								/>
								<ErrorMessage
									name="stock"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Stock alert */}
							<div className="form-group">
								<label
									htmlFor="stock_alert"
									className="form-label"
								>
									Alerta de stock
								</label>
								<Field
									className="input input-sm"
									type="number"
									name="stock_alert"
									placeholder="0"
									onChange={(
										e: React.ChangeEvent<HTMLInputElement>
									) =>
										setFieldValue(
											"stock_alert",
											parseInt(e.target.value, 10)
										)
									}
								/>
								<ErrorMessage
									name="stock_alert"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Activo */}
							<div className="form-group">
								<label className="form-label">
									<Field
										type="checkbox"
										name="active"
										className="mr-2"
									/>
									Activo
								</label>
							</div>

							{/* Status */}
							<div className="form-group">
								<label className="form-label">
									<Field
										type="checkbox"
										name="status"
										className="mr-2"
									/>
									Status
								</label>
							</div>

							{/* Imagen */}
							<div className="form-group md:col-span-2">
								<label htmlFor="image" className="form-label">
									Imagen (URL)
								</label>
								<Field
									className="input input-sm"
									type="text"
									name="image"
									placeholder="https://ejemplo.com/imagen.png"
								/>
								<ErrorMessage
									name="image"
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
							{isEdit
								? "Actualizar Producto"
								: "Registrar Producto"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default FormProduct;
