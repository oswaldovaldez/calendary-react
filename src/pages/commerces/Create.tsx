import FormCommerce, { type CommerceFormValues } from "./FormCommerce";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";

const CreateCommerce = () => {
	const token = useAuthStore((s) => s.token);
	const navigate = useNavigate();

	const initialValues: CommerceFormValues = {
		name: "",
		email: "",
		phone: "",
		data: {},
	};

	const handleSubmit = async (values: CommerceFormValues) => {
		try {
			await Api.createCommerce({
				...values,
				_token: token ?? "",
			});
			alert("Comercio creado con éxito");
			navigate({ to: "/commerces" });
		} catch (error) {
			console.error("Error al crear comercio:", error);
			alert("Error al crear comercio");
		}
	};

	return (
		<FormCommerce initialValues={initialValues} onSubmit={handleSubmit} />
	);
};

export default CreateCommerce;
