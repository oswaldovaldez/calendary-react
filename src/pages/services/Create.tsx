import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import type { ServiceFormValues } from "./FormService";
import FormService from "./FormService";

const CreateService = () => {
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	const initialValues: ServiceFormValues = {
		name: "",
		description: "",
		commerce_id: 0,
		duration: 0,
		price: 0,
		price_offer: 0,
		_token: token ?? "",
	};

	const handleSubmit = async (values: ServiceFormValues) => {
		try {
			await Api.createService(values);
			alert("Servicio creado con éxito");
			navigate({ to: "/services" });
		} catch (error) {
			console.error("Error al crear servicio:", error);
			alert("Error al crear servicio");
		}
	};

	return (
		<FormService initialValues={initialValues} onSubmit={handleSubmit} />
	);
};

export default CreateService;
