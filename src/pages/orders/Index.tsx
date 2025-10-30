import { useState, useEffect } from "react";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";
import Table from "../../components/Table";
// import type { OrderType } from "../../types";

const OrdersIndex = () => {
  const [orders, setOrders] = useState([]);
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);

  const handleDeleteOrder = (id: number) => {
    Api.deleteOrder({ order_id: id, _token: `${token}` })
      .then((res) => {

        notify("success", res.message || "Orden eliminada correctamente");
        // Recargar datos
        handleSearch({});
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };

  const createLink = {
    url: "/orders/create",
    name: "Nueva Orden",
  };

  const cols = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "folio",
      header: "Folio",
      cell: (info: any) => info.getValue() || "Sin folio",
    },
    {
      accessorKey: "appointment.patient",
      header: "Paciente",
      cell: (info: any) => {
        const patient = info.row.original.appointment?.patient;
        return patient ? `${patient.first_name} ${patient.last_name}` : "N/A";
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: (info: any) => `$${Number(info.getValue()).toFixed(2)}`,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: (info: any) => info.getValue() || "Sin estado",
    },
    {
      accessorKey: "payment_method",
      header: "Método de pago",
      cell: (info: any) => info.getValue() || "N/A",
    },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: (info: any) =>
        info.getValue()
          ? new Date(info.getValue()).toLocaleDateString("es-MX")
          : "-",
    },
    {
      header: "Acciones",
      cell: (info: any) => (
        <div className="flex gap-2">
          <Link
            to={`/orders/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          <Link
            to={`/orders/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteOrder,
                title: "Eliminar orden",
                message: `¿Deseas eliminar la orden <strong>${info.row.original.folio || info.row.original.id}</strong>?`,
                successText: `La orden se eliminó correctamente.`,
                errorText: `No se pudo eliminar la orden. Intenta de nuevo.`,
              })
            }
            className="btn neumo btn-danger"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    Api.readOrders({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setOrders(res.data || res);
      })
      .catch(console.log);
  }, []);

  const handleSearch = (query: any) => {
    Api.readOrders({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setOrders(res.data || res);
      })
      .catch(console.log);
  };

  const handlePaginate = (query: any) => {
    Api.readOrders({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setOrders(res.data || res);
      })
      .catch(console.log);
  };

  return (
    <div>
      <Table
        datos={orders}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default OrdersIndex;
