import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";

import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { CategoryType } from "../../types";

const ShowCategory = () => {
	const { categoryId } = useParams({ from: "/categories/$categoryId" });
	const token = useAuthStore((state) => state.token);

	const [category, setCategory] = useState<CategoryType | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) {
			setError("No hay sesión activa");
			setIsLoading(false);
			return;
		}

		let isMounted = true;

		const fetchCategory = async () => {
			setIsLoading(true);
			try {
				const response = await Api.showCategory({
					_token: token,
					category_id: Number(categoryId),
				});

				if (!isMounted) return;
				setCategory(response as CategoryType);
				setError(null);
			} catch (err) {
				console.error("Error cargando la categoría", err);
				if (!isMounted) return;
				setError("No pudimos cargar la categoría");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchCategory();

		return () => {
			isMounted = false;
		};
	}, [categoryId, token]);

	if (isLoading) {
		return <div className="card neumo p-6">Cargando categoría...</div>;
	}

	if (error || !category) {
		return (
			<div className="card neumo p-6">
				{error ?? "Categoría no encontrada"}
			</div>
		);
	}

	return (
		<div className="card neumo">
			<div className="card-header">
				<h2 className="text-lg font-semibold">Detalle de categoría</h2>
				<p className="text-sm text-gray-500">ID: {category.id}</p>
			</div>
			<div className="card-body grid gap-3 md:grid-cols-2">
				<div>
					<span className="font-semibold">Nombre:</span>{" "}
					{category.name}
				</div>
				<div>
					<span className="font-semibold">Descripción:</span>{" "}
					{category.description ?? "Sin descripción"}
				</div>
				<div>
					<span className="font-semibold">Comercio:</span>{" "}
					{category.commerce_id}
				</div>
				<div>
					<span className="font-semibold">Categoría padre:</span>{" "}
					{category.parent_id ?? "Sin asignar"}
				</div>
				<div>
					<span className="font-semibold">Estado:</span>{" "}
					{category.status ? "Activa" : "Inactiva"}
				</div>
				<div>
					<span className="font-semibold">Slug:</span>{" "}
					{category.slug ?? "Sin slug"}
				</div>
				<div>
					<span className="font-semibold">Categoría Creada:</span>{" "}
					{category.created_at
						? new Date(category.created_at).toLocaleString(
								"es-MX",
								{
									dateStyle: "medium",
									timeStyle: "short",
								}
							)
						: "-"}
				</div>
				<div>
					<span className="font-semibold">Última actualización:</span>{" "}
					{category.updated_at
						? new Date(category.updated_at).toLocaleString(
								"es-MX",
								{
									dateStyle: "medium",
									timeStyle: "short",
								}
							)
						: "-"}
				</div>
			</div>
		</div>
	);
};

export default ShowCategory;
