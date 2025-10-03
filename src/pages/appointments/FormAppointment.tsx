import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuthStore } from "../../store/auth.store";
import { type PatientType, type ServiceType } from "../../types/index";
import { useEffect, useState } from "react";
import { Api } from "../../services/api";
import { IoIosPersonAdd } from "react-icons/io";

export const appointmentSchema = Yup.object({
	first_name: Yup.string().trim().required("El nombre es obligatorio"),
	last_name: Yup.string().trim().required("El apellido es obligatorio"),
	email: Yup.string()
		.trim()
		.email("Correo inválido")
		.required("El correo es obligatorio"),
	phone: Yup.string()
		.matches(/^\+?\d{7,15}$/, "Número de teléfono no válido")
		.required("El teléfono es obligatorio"),
	birth_date: Yup.string().required("La fecha de nacimiento es obligatoria"),
	gender: Yup.string()
		.oneOf(
			["male", "female", "other"],
			"Debe ser Masculino, Femenino u Otro"
		)
		.required("El género es obligatorio"),
});

const FormAppointment = ({ initialValues, isEdit = false, onSubmit }: any) => {
	const commerce = useAuthStore((s) => s.commerce);
	const token = useAuthStore((s) => s.token);
	const [patients, setPatients] = useState<PatientType[]>([]);
	const [services, setServices] = useState<ServiceType[]>([]);
	const [users, setUsers] = useState<ServiceType[]>([]);

	useEffect(() => {
		if (isEdit) {
			console.log("Editando cita", initialValues);
		}
		if (commerce !== null) {
			Api.readPatients({
				_token: `${token}`,
				query: {
					commerce_id: `${commerce.id}`,
					all: "true",
				},
			})
				.then((res) => setPatients(res))
				.catch((err) => console.error(err));

			Api.readServices({
				_token: `${token}`,
				query: {
					commerce_id: `${commerce.id}`,
					all: "true",
				},
			})
				.then((res) => setServices(res))
				.catch((err) => console.error(err));

			Api.readUsers({
				_token: `${token}`,
				query: {
					commerce_id: `${commerce.id}`,
					allcommerce: "true",
				},
			})
				.then((res) => setUsers(res))
				.catch((err) => console.error(err));
		}
	}, [commerce]);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={appointmentSchema}
			onSubmit={onSubmit}
			enableReinitialize
		>
			{({ errors, touched }: any) => (
				<Form className="form-container card">
					

					<div className="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Nombre */}
						<div className="form-group md:col-span-2">
							<label
								htmlFor="name"
								className="form-label required"
							>
								Nombre
							</label>
							<Field name="name">
								{({ field, form }: any) => (
									<input
										type="text"
										{...field}
										className={`input ${
											errors.name && touched.name
												? "input-invalid"
												: ""
										}`}
										style={{ textTransform: "uppercase" }}
										onChange={(e: any) =>
											form.setFieldValue(
												field.name,
												e.target.value.toUpperCase()
											)
										}
									/>
								)}
							</Field>
							<ErrorMessage
								name="name"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Descripción */}
						<div className="form-group md:col-span-2">
							<label htmlFor="description" className="form-label">
								Descripción
							</label>
							<Field
								as="textarea"
								name="description"
								className="input"
								placeholder="Descripción de la cita"
							/>
							<ErrorMessage
								name="description"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Paciente con botón */}
						<div className="form-group md:col-span-2">
							<label
								htmlFor="patient_id"
								className="form-label required"
							>
								Paciente
							</label>
							<div className="flex gap-2 items-center">
								<Field name="patient_id">
									{({ field, form }: any) => (
										<>
											<input
												type="text"
												{...field}
												list="patients"
												className={`input ${
													errors.patient_id &&
													touched.patient_id
														? "input-invalid"
														: ""
												}`}
												style={{
													textTransform: "uppercase",
												}}
												placeholder="Seleccionar paciente"
												onChange={(e: any) =>
													form.setFieldValue(
														field.name,
														e.target.value.toUpperCase()
													)
												}
											/>
											<datalist id="patients">
												{patients?.map((p: any) => (
													<option
														key={p.id}
														value={`${p.id} - ${p.first_name} ${p.last_name}`}
													/>
												))}
											</datalist>
										</>
									)}
								</Field>

								<button
									type="button"
									className="btn btn-add"
									onClick={() =>
										console.log(
											"Abrir modal nuevo paciente"
										)
									}
								>
									<IoIosPersonAdd size={20} />
								</button>
							</div>
							<ErrorMessage
								name="patient_id"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Servicio */}
						<div className="form-group">
							<label
								htmlFor="service_id"
								className="form-label required"
							>
								Servicio
							</label>
							<Field name="service_id">
								{({ field, form }: any) => (
									<>
										<input
											type="text"
											{...field}
											list="services"
											className={`input ${
												errors.service_id &&
												touched.service_id
													? "input-invalid"
													: ""
											}`}
											placeholder="Seleccionar servicio"
											onChange={(e: any) =>
												form.setFieldValue(
													field.name,
													e.target.value.toUpperCase()
												)
											}
										/>
										<datalist id="services">
											{services?.map((s: any) => (
												<option
													key={s.id}
													value={`${s.id} - ${s.name}`}
												/>
											))}
										</datalist>
									</>
								)}
							</Field>
							<ErrorMessage
								name="service_id"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Doctor */}
						<div className="form-group">
							<label
								htmlFor="user_id"
								className="form-label required"
							>
								Doctor
							</label>
							<Field name="user_id">
								{({ field, form }: any) => (
									<>
										<input
											type="text"
											{...field}
											list="users"
											className={`input ${
												errors.user_id &&
												touched.user_id
													? "input-invalid"
													: ""
											}`}
											placeholder="Seleccionar doctor"
											onChange={(e: any) =>
												form.setFieldValue(
													field.name,
													e.target.value.toUpperCase()
												)
											}
										/>
										<datalist id="users">
											{users?.map((u: any) => (
												<option
													key={u.id}
													value={`${u.id} - ${u.name}`}
												/>
											))}
										</datalist>
									</>
								)}
							</Field>
							<ErrorMessage
								name="user_id"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Fecha */}
						<div className="form-group">
							<label
								htmlFor="date"
								className="form-label required"
							>
								Día
							</label>
							<Field type="date" name="date" className="input" />
							<ErrorMessage
								name="date"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Hora inicio */}
						<div className="form-group">
							<label
								htmlFor="start_time"
								className="form-label required"
							>
								Hora inicio
							</label>
							<Field
								type="time"
								name="start_time"
								className="input"
							/>
							<ErrorMessage
								name="start_time"
								component="div"
								className="form-text-invalid"
							/>
						</div>

						{/* Hora fin */}
						<div className="form-group">
							<label
								htmlFor="end_time"
								className="form-label required"
							>
								Hora fin
							</label>
							<Field
								type="time"
								name="end_time"
								className="input"
							/>
							<ErrorMessage
								name="end_time"
								component="div"
								className="form-text-invalid"
							/>
						</div>
					</div>

					{/* Botón submit */}
					<div className="flex justify-end mt-6">
						<button type="submit" className="btn btn-primary">
							{isEdit ? "Actualizar Cita" : "Guardar Cita"}
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default FormAppointment;
