import React from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import FormPatient, { type PatientFormValues } from "./FormPatient";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";

const CreatePatient: React.FC = () => {
	const token = useAuthStore((s) => s.token);
	const commerce = useAuthStore((s) => s.commerce);
	const navigate = useNavigate();

	const initialValues: PatientFormValues = {
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		birth_date: "",
		gender: "",
		commerce_id: commerce?.id ?? 0,
		data: {},
	};

	const handleSubmit = async (values: PatientFormValues) => {
		try {
			await Api.createPatient({
				first_name: values.first_name.trim(),
				last_name: values.last_name.trim(),
				email: values.email.trim() || null,
				phone: values.phone.trim() || null,
				birth_date: values.birth_date || null,
				gender: values.gender || null,
				commerce_id: values.commerce_id,
				_token: token ?? "",
			});

			toast.success("Paciente creado con éxito", { duration: 4000 });
			navigate({ to: "/patients" });
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Error al registrar paciente", {
				duration: 5000,
			});
		}
	};

	return (
		<FormPatient
			initialValues={initialValues}
			onSubmit={handleSubmit}
			isEdit={false}
		/>
	);
};

export default CreatePatient;
