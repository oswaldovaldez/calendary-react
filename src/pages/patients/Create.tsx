import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import type { PatientFormValues } from "./FornPatient";
import FormPatient from "./FornPatient";

const CreatePatient = () => {
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	const initialValues: PatientFormValues = {
		first_name: "",
		last_name: "",
		email: "",
		phone: "",
		birth_date: null,
		gender: null,
	};

	const handleSubmit = async (values: PatientFormValues) => {
		try {
			await Api.createPatient({
				...values,
				_token: token ?? "",
			});
			alert("Paciente creado con éxito");
			navigate({ to: "/patients" });
		} catch (error) {
			console.error("Error al crear paciente:", error);
			alert("Error al crear paciente");
		}
	};

	return (
		<FormPatient initialValues={initialValues} onSubmit={handleSubmit} />
	);
};

export default CreatePatient;
