import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import type { ServiceType } from "../../types";

const ShowService: React.FC = () => {
  const token = useAuthStore((s) => s.token);
  const { serviceId } = useParams({ from: "/services/$serviceId" });
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceType | null>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Date(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    Api.showService({
      _token: `${token}`,
      service_id: Number(serviceId),
    })
      .then((res: any) => {
        setService(res);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar servicio:", error);
        toast.error("No se pudo cargar el servicio");
        setLoading(false);
      });
  }, [token, serviceId]);

  if (loading) return <div>Cargando...</div>;
  if (!service) return <div>No se encontró el servicio</div>;

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-lg font-bold">{service.name}</h2>
        <button
          className="btn neumo btn-secondary"
          onClick={() => navigate({ to: `/services/${service.id}/edit` })}
        >
          Editar
        </button>
      </div>

      <div className="card-body space-y-2">
        <p>
          <strong>Descripción:</strong> {service.description}
        </p>
        <p>
          <strong>Categoría:</strong>
          {service.categories?.length === 0
            ? "Sin categoría"
            : service.categories
                ?.map((cat) => (typeof cat === "number" ? cat : cat.name))
                .join(", ")}
        </p>
        <p>
          <strong>Precio:</strong> ${service.price}
        </p>
        <p>
          <strong>Precio de Oferta:</strong> ${service.price_offer}
        </p>
        <p>
          <strong>Duración:</strong> {service.duration} {service.duration_type}
        </p>
        <p>
          <strong>Sesiones:</strong>
          {service.sessions
            ? `${service.session_number} sesiones`
            : "Servicio único"}
        </p>
        <p>
          <strong>Servicio a domicilio:</strong>
          {service.home_service ? "Sí" : "No"}
        </p>
        <p>
          <strong>Inicio oferta:</strong>
          {formatDate(
            service.start_offer_at instanceof Date
              ? service.start_offer_at.toISOString()
              : service.start_offer_at
          ) || "—"}
        </p>
        <p>
          <strong>Fin oferta:</strong>
          {formatDate(
            service.end_offer_at instanceof Date
              ? service.end_offer_at.toISOString()
              : service.end_offer_at
          ) || "—"}
        </p>

        {/* {service.options?.length > 0 && (
          <div>
            <strong>Opciones:</strong> {product.categories?.length === 0
            ? "Sin categoría"
            : product.categories
                ?.map((cat) => (typeof cat === "number" ? cat : cat.name))
                .join(", ")}
            <ul className="list-disc pl-6">
              {service.options.map((opt, i) => (
                <li key={i}>
                  {opt.name} (+${opt.extra_price})
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </div>

      <div className="card-footer text-sm text-gray-500">
        {/* Creado: {formatDate(service.created_at)} | Última actualización:
        {formatDate(service.updated_at)} */}
      </div>
    </div>
  );
};

export default ShowService;
