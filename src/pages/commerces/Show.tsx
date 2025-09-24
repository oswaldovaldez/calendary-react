import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";

import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { CommerceType } from "../../types";

const ShowCommerce = () => {
  const { commerceId } = useParams({ from: "/commerces/$commerceId" });
  const token = useAuthStore((state) => state.token);

  const [commerce, setCommerce] = useState<CommerceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchCommerce = async () => {
      setIsLoading(true);
      try {
        const response = await Api.showCommerce({
          _token: token,
          commerce_id: Number(commerceId),
        });

        if (!isMounted) return;
        setCommerce(response as CommerceType);
        setError(null);
      } catch (err) {
        console.error("Error cargando el comercio", err);
        if (!isMounted) return;
        setError("No pudimos cargar el comercio");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCommerce();

    return () => {
      isMounted = false;
    };
  }, [commerceId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando comercio...</div>;
  }

  if (error || !commerce) {
    return (
      <div className="card neumo p-6">
        {error ?? "Comercio no encontrado"}
      </div>
    );
  }

  return (
    <div className="card neumo">
      <div className="card-header">
        <h2 className="text-lg font-semibold">Detalle de comercio</h2>
        <p className="text-sm text-gray-500">ID: {commerce.id}</p>
      </div>
      <div className="card-body grid gap-3 md:grid-cols-2">
        <div>
          <span className="font-semibold">Nombre:</span> {commerce.name}
        </div>
        <div>
          <span className="font-semibold">Descripción:</span>{" "}
          {commerce.description ?? "Sin descripción"}
        </div>
        <div>
          <span className="font-semibold">Email:</span>{" "}
          {commerce.email ?? "Sin email"}
        </div>
        <div>
          <span className="font-semibold">Teléfono:</span>{" "}
          {commerce.phone ?? "Sin teléfono"}
        </div>
        <div>
          <span className="font-semibold">Dirección:</span>{" "}
          {commerce.address ?? "Sin dirección"}
        </div>
        <div>
          <span className="font-semibold">Slug:</span>{" "}
          {commerce.slug ?? "Sin slug"}
        </div>
        <div>
          <span className="font-semibold">Imagen:</span>{" "}
          {commerce.image ? (
            <img
              src={commerce.image}
              alt={commerce.name}
              className="h-16 rounded"
            />
          ) : (
            "Sin imagen"
          )}
        </div>
        <div>
          <span className="font-semibold">Tienda Creada:</span>{" "}
          {commerce.created_at
            ? new Date(commerce.created_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>
        <div>
          <span className="font-semibold">Última actualización:</span>{" "}
          {commerce.updated_at
            ? new Date(commerce.updated_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>
        <div className="md:col-span-2">
          <span className="font-semibold">Otros datos:</span>{" "}
          {commerce.data && commerce.data.length > 0
            ? JSON.stringify(commerce.data)
            : "Sin datos"}
        </div>
      </div>
    </div>
  );
};

export default ShowCommerce;
