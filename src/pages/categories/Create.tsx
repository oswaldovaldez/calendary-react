import FormCategory, { type CategoryFormValues } from "./FormCategory";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";

const CreateCategory = () => {
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const navigate = useNavigate();

	const commerces = user?.commerces ?? [];

	const initialValues: CategoryFormValues = {
		name: "",
		description: "",
		parent_id: null,
		commerce_id: 0,
	};

	const handleSubmit = async (values: CategoryFormValues) => {
		try {
			await Api.createCategory({
				...values,
				_token: token ?? "",
			});
			alert("Categoría creada con éxito");
			navigate({ to: "/categories" });
		} catch (error) {
			console.error(error);
			alert("Error al crear categoría");
		}
	};

	return (
		<FormCategory
			initialValues={initialValues}
			commerces={commerces}
			onSubmit={handleSubmit}
		/>
	);
};

export default CreateCategory;
