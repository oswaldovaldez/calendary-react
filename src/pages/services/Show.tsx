import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";

import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { ServiceFormValues } from "./FormService"; 

const ShowService = () => {
	const { serviceId } = useParams({ from: "/services/$serviceId" });
	const token = useAuthStore((state) => state.token);

	const [service, setService] = useState<ServiceFormValues | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!token) {
			setError("No hay sesión activa");
			setIsLoading(false);
			return;
		}

		let isMounted = true;

		const fetchService = async () => {
			setIsLoading(true);
			try {
				const response = await Api.showService({
					_token: token,
					service_id: Number(serviceId),
				});

				if (!isMounted) return;
				setService(response as ServiceFormValues);
				setError(null);
			} catch (err) {
				console.error("Error cargando el servicio", err);
				if (!isMounted) return;
				setError("No pudimos cargar el servicio");
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchService();

		return () => {
			isMounted = false;
		};
	}, [serviceId, token]);

	if (isLoading) {
		return <div className="card neumo p-6">Cargando servicio...</div>;
	}

	if (error || !service) {
		return (
			<div className="card neumo p-6">
				{error ?? "Servicio no encontrado"}
			</div>
		);
	}

	return (
		<div className="card neumo">
			<div className="card-header">
				<h2 className="text-lg font-semibold">Detalle de servicio</h2>
				<p className="text-sm text-gray-500">ID: {serviceId}</p>
			</div>

			<div className="card-body grid gap-3 md:grid-cols-2">
				<div>
					<span className="font-semibold">Nombre:</span>{" "}
					{service.name}
				</div>

				<div>
					<span className="font-semibold">Descripción:</span>{" "}
					{service.description ?? "Sin descripción"}
				</div>

				<div>
					<span className="font-semibold">Categoría:</span>{" "}
					{service.category_id ?? "Sin categoría"}
				</div>

				<div>
					<span className="font-semibold">Duración:</span>{" "}
					{service.duration} minutos
				</div>

				<div>
					<span className="font-semibold">Precio:</span> $
					{Number(service.price).toFixed(2)}
				</div>

				<div>
					<span className="font-semibold">Precio de oferta:</span>{" "}
					{service.price_offer
						? `$${Number(service.price_offer).toFixed(2)}`
						: "Sin oferta"}
				</div>

				{/*  created_at y updated_at  */}
				{"created_at" in service && (
					<div>
						<span className="font-semibold">Creado:</span>{" "}
						{service.created_at
							? new Date(
									service.created_at as any
								).toLocaleString("es-MX", {
									dateStyle: "medium",
									timeStyle: "short",
								})
							: "-"}
					</div>
				)}
				{"updated_at" in service && (
					<div>
						<span className="font-semibold">
							Última actualización:
						</span>{" "}
						{service.updated_at
							? new Date(
									service.updated_at as any
								).toLocaleString("es-MX", {
									dateStyle: "medium",
									timeStyle: "short",
								})
							: "-"}
					</div>
				)}
			</div>
		</div>
	);
};

export default ShowService;
