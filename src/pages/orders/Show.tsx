import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { OrderType } from "../../types";

const ShowOrder = () => {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const token = useAuthStore((state) => state.token);

  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await Api.showOrder({
          _token: `${token}`,
          order_id: Number(orderId),
        });

        if (!isMounted) return;
        setOrder(response as OrderType);
        setError(null);
      } catch (err) {
        console.error("Error cargando la orden", err);
        if (!isMounted) return;
        setError("No pudimos cargar la orden");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      setIsMounted(false);
    };
  }, [orderId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando orden...</div>;
  }

  if (error || !order) {
    return (
      <div className="card neumo p-6">{error ?? "Orden no encontrada"}</div>
    );
  }

  const patient = order.appointment?.patient;
  const items = order.items || [];

  return (
    <div className="card neumo">
      <div className="card-header">
        <h2 className="text-lg font-semibold">Detalle de orden</h2>
        <p className="text-sm text-gray-500">
          Folio: {order.folio || `#${order.id}`}
        </p>
      </div>
      <div className="card-body grid gap-3 grid-cols-1 md:grid-cols-2">
        <div>
          <span className="font-semibold">ID:</span> {order.id}
        </div>
        <div>
          <span className="font-semibold">Folio:</span>{" "}
          {order.folio || "Sin folio"}
        </div>
        <div>
          <span className="font-semibold">Paciente:</span>{" "}
          {patient
            ? `${patient.first_name} ${patient.last_name}`
            : "No disponible"}
        </div>
        <div>
          <span className="font-semibold">Estado:</span>{" "}
          {order.status || "Sin estado"}
        </div>
        <div>
          <span className="font-semibold">Subtotal:</span> $
          {Number(order.subtotal).toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Total:</span> $
          {Number(order.total).toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Costo de consulta:</span> $
          {Number(order.consultation_fee).toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Método de pago:</span>{" "}
          {order.payment_method || "N/A"}
        </div>
        <div>
          <span className="font-semibold">Tasa de impuesto:</span>{" "}
          {order.tax_rate}%
        </div>
        <div>
          <span className="font-semibold">Descuento:</span> $
          {Number(order.discount_value).toFixed(2)}
          {order.discount_type ? ` (${order.discount_type})` : ""}
        </div>
        <div>
          <span className="font-semibold">Monto monedero:</span> $
          {Number(order.wallet_amount).toFixed(2)}
        </div>
        <div>
          <span className="font-semibold">Ajuste:</span>{" "}
          {order.adjustment_concept || "Sin ajuste"}
        </div>
        <div className="md:col-span-2">
          <span className="font-semibold">Orden Creada:</span>{" "}
          {order.created_at
            ? new Date(order.created_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>
      </div>

      {items.length > 0 && (
        <div className="card-body mt-4">
          <h3 className="font-semibold mb-2">Items de la orden</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nombre</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-right p-2">Precio</th>
                  <th className="text-right p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="text-right p-2">{item.quantity}</td>
                    <td className="text-right p-2">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="text-right p-2">
                      ${Number(item.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowOrder;
