import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";

export interface CategoryOption {
	id: number;
	name: string;
}

export interface ServiceFormValues {
	name: string;
	description: string;
	commerce_id: number;
	category_id: number;
	duration: number;
	price: number;
	price_offer: number;
	_token: string;
}

export const serviceSchema = Yup.object().shape({
	name: Yup.string()
		.trim()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.required("El nombre es obligatorio"),
	description: Yup.string()
		.trim()
		.max(500, "La descripción no puede exceder 500 caracteres")
		.required("La descripción es obligatoria"),
	category_id: Yup.number()
		.typeError("Debe ser un número")
		.integer("Debe ser un número entero")
		.positive("Debe ser mayor que cero")
		.required("La categoría es obligatoria"),
	duration: Yup.number()
		.typeError("Debe ser un número")
		.integer("Debe ser un número entero")
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
	commerce_id: Yup.number().required(),
});

interface FormServiceProps {
	initialValues: ServiceFormValues;
	isEdit?: boolean;
	onSubmit: (
		values: ServiceFormValues,
		helpers: FormikHelpers<ServiceFormValues>
	) => void | Promise<void>;
}

const FormService: React.FC<FormServiceProps> = ({
	initialValues,
	isEdit = false,
	onSubmit,
}) => {
	const token = useAuthStore((s) => s.token);
	const commerce = useAuthStore((s) => s.commerce);
	const [categories, setCategories] = useState<CategoryOption[]>([]);

	//  Carga las categorías desde la API
	useEffect(() => {
		if (!token || !commerce?.id) return;

		Api.readCategories({
			_token: token,
			query: { commerce_id: String(commerce.id) },
		})
			.then((res: any) => {
				// res.data por paginación (ajusta según tu API)
				const mapped = (res.data ?? res).map((cat: any) => ({
					id: cat.id,
					name: cat.name,
				}));
				setCategories(mapped);
			})
			.catch((err) => console.error("Error cargando categorías:", err));
	}, [token, commerce?.id]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={serviceSchema}
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
										errors.name && touched.name
											? "input-invalid"
											: ""
									}`}
									type="text"
									name="name"
									placeholder="Ej. Corte de cabello, Consulta médica"
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
									as="textarea"
									className={`input input-sm ${
										errors.description &&
										touched.description
											? "input-invalid"
											: ""
									}`}
									name="description"
									placeholder="Describe el servicio brevemente"
								/>
								<ErrorMessage
									name="description"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Categoría dinámica */}
							<div className="form-group">
								<label htmlFor="category_id">Categoría</label>
								<Field
									as="select"
									name="category_id"
									className={`input input-sm ${
										errors.category_id &&
										touched.category_id
											? "input-invalid"
											: ""
									}`}
								>
									<option value="">
										Selecciona una categoría
									</option>
									{categories.map((cat) => (
										<option key={cat.id} value={cat.id}>
											{cat.name}
										</option>
									))}
								</Field>
								<ErrorMessage
									name="category_id"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Duración */}
							<div className="form-group">
								<label htmlFor="duration">
									Duración (minutos)
								</label>
								<Field
									className={`input input-sm ${
										errors.duration && touched.duration
											? "input-invalid"
											: ""
									}`}
									type="number"
									name="duration"
									placeholder="Ej. 30, 60, 90"
									min={1}
									step={1}
								/>
								<ErrorMessage
									name="duration"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Precio normal */}
							<div className="form-group">
								<label htmlFor="price">Precio (MXN)</label>
								<div className="input-group">
									<Field
										className={`input input-sm flex-1 ${
											errors.price && touched.price
												? "input-invalid"
												: ""
										}`}
										type="number"
										name="price"
										placeholder="Ej. 500.00"
										min={0}
										step="0.01"
									/>
								</div>
								<ErrorMessage
									name="price"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Precio de oferta */}
							<div className="form-group">
								<label htmlFor="price_offer">
									Precio de oferta (MXN)
								</label>
								<div className="input-group">
									<Field
										className={`input input-sm flex-1 ${
											errors.price_offer &&
											touched.price_offer
												? "input-invalid"
												: ""
										}`}
										type="number"
										name="price_offer"
										placeholder="Ej. 450.00"
										min={0}
										step="0.01"
									/>
								</div>
								<ErrorMessage
									name="price_offer"
									component="div"
									className="form-text-invalid"
								/>
							</div>

							{/* Campos ocultos */}
							<Field type="hidden" name="commerce_id" />
							<Field type="hidden" name="_token" />
						</div>

						<div className="card-footer">
							<button
								className="btn neumo btn-success ml-auto"
								type="submit"
								disabled={isSubmitting}
							>
								{isEdit
									? "Editar Servicio"
									: "Registrar Servicio"}
							</button>
						</div>
					</Form>
				</div>
			)}
		</Formik>
	);
};

export default FormService;
