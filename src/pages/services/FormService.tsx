import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

export interface ServiceFormValues {
	name: string;
	description: string;
	commerce_id: number;
	duration: number;
	price: number;
	price_offer: number;
	_token: string;
}

export const serviceSchema = Yup.object({
	name: Yup.string()
		.trim()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.required("El nombre es obligatorio"),
	description: Yup.string()
		.trim()
		.max(500, "La descripción no puede exceder 500 caracteres")
		.required("La descripción es obligatoria"),
	commerce_id: Yup.number()
		.typeError("Debe ser un número")
		.integer("Debe ser un número entero")
		.positive("Debe ser mayor que cero")
		.required("El ID de comercio es obligatorio"),
	duration: Yup.number()
		.typeError("Debe ser un número")
		.positive("La duración debe ser mayor que cero")
		.required("La duración es obligatoria"),
	price: Yup.number()
		.typeError("Debe ser un número")
		.positive("El precio debe ser mayor que cero")
		.required("El precio es obligatorio"),
	price_offer: Yup.number()
		.typeError("Debe ser un número")
		.positive("El precio de oferta debe ser mayor que cero")
		.max(Yup.ref("price"), "Debe ser menor o igual al precio")
		.required("El precio de oferta es obligatorio"),
	_token: Yup.string().required(),
});

interface FormServiceProps {
	initialValues: ServiceFormValues;
	isEdit?: boolean;
	onSubmit: (
		values: ServiceFormValues,
		FormikHelpers: FormikHelpers<ServiceFormValues>
	) => void | Promise<void>;
}

const FormService: React.FC<FormServiceProps> = ({
	initialValues,
	isEdit = false,
	onSubmit,
}) => {
	return (
		<div>
			<Formik
				initialValues={initialValues}
				validationSchema={serviceSchema}
				onSubmit={onSubmit}
			>
				{({ errors, touched, isSubmitting }) => (
					<div className="card">
						<Form className="form-container">
							<div className="card-body">
								<div className="form-group">
									<label htmlFor="name" className="form-label">
										Nombre
									</label>
									<Field
										className={`input input-sm ${
											errors.name && touched.name ? "input-invalid" : ""
										}`}
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
									<label htmlFor="description" className="form-label">
										Descripción
									</label>
									<Field
										as="textarea"
										className={`input input-sm ${
											errors.description && touched.description ? "input-invalid" : ""
										}`}
										name="description"
									/>
									<ErrorMessage
										name="description"
										component="div"
										className="form-text-invalid"
									/>
								</div>

								<div className="form-group">
									<label htmlFor="commerce_id" className="form-label">
										ID de Comercio
									</label>
									<Field
										className={`input input-sm ${
											errors.commerce_id && touched.commerce_id ? "input-invalid" : ""
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

								<div className="form-group">
									<label htmlFor="duration" className="form-label">
										Duración (minutos)
									</label>
									<Field
										className={`input input-sm ${
											errors.duration && touched.duration ? "input-invalid" : ""
										}`}
										type="number"
										name="duration"
									/>
									<ErrorMessage
										name="duration"
										component="div"
										className="form-text-invalid"
									/>
								</div>

								<div className="form-group">
									<label htmlFor="price" className="form-label">
										Precio
									</label>
									<Field
										className={`input input-sm ${
											errors.price && touched.price ? "input-invalid" : ""
										}`}
										type="number"
										name="price"
									/>
									<ErrorMessage
										name="price"
										component="div"
										className="form-text-invalid"
									/>
								</div>

								<div className="form-group">
									<label htmlFor="price_offer" className="form-label">
										Precio de oferta
									</label>
									<Field
										className={`input input-sm ${
											errors.price_offer && touched.price_offer ? "input-invalid" : ""
										}`}
										type="number"
										name="price_offer"
									/>
									<ErrorMessage
										name="price_offer"
										component="div"
										className="form-text-invalid"
									/>
								</div>

								<Field type="hidden" name="_token" />
							</div>

							<div className="card-footer">
								<button
									className="btn btn-success ml-auto"
									type="submit"
									disabled={isSubmitting}
								>
									{isEdit ? "Editar Servicio" : "Registrar Servicio"}
								</button>
							</div>
						</Form>
					</div>
				)}
			</Formik>
		</div>
	);
};

export default FormService;
