import FormCategory, { type CategoryFormValues } from "./FormCategory";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

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

			toast.success("Categoría creada con éxito", {
				duration: 4000,
			});

			navigate({ to: "/categories" });
		} catch (error: any) {
			console.error(error);
			toast.error(error.message || "Error al crear categoría", {
				duration: 5000,
			});
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
