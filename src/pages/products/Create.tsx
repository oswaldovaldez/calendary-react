import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "@tanstack/react-router";
import type { ProductFormValues } from "./FormProduct";
import FormProduct from "./FormProduct";

const CreateProduct = () => {
	const token = useAuthStore((s) => s.token);
	const user = useAuthStore((s) => s.user);
	const navigate = useNavigate();

	const commerces = user?.commerces ?? [];

	const initialValues: ProductFormValues = {
		name: "",
		description: "",
		commerce_id: 0,
	};

	const handleSubmit = async (values: ProductFormValues) => {
		try {
			await Api.createProduct({
				...values,
				_token: token ?? "",
			});
			alert("Producto creado con éxito");
			navigate({ to: "/products" });
		} catch (error) {
			console.error(error);
			alert("Error al crear producto");
		}
	};

	return (
		<FormProduct
			initialValues={initialValues}
			commerces={commerces}
			onSubmit={handleSubmit}
		/>
	);
};

export default CreateProduct;
