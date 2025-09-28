import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";

const Index = () => {
  const [commerces, setCommerces] = useState([]);
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteCommerce = (id: number) => {
    Api.deleteCommerce({ commerce_id: id, _token: token })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  const createLink = {
    url: "/commerces/create",
    name: "Nuevo Comercio",
  };
  const cols = [
    {
      accessorKey: "id",
      header: "ID",
    },
    { accessorKey: "name", header: "Nombre" },
    {
      // Nueva columna para las acciones
      header: "Acciones",
      cell: (info: any) => (
        <div className="flex gap-2">
          {/* Botón para ver registro */}
          <Link
            to={`/commerces/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/commerces/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteCommerce,
                title: "Eliminar comercio",
                message: `¿Deseas eliminar el comercio <strong>${info.row.original.name}</strong>?`,
                successText: `El comercio "${info.row.original.name}" se eliminó correctamente.`,
                errorText: `No se pudo eliminar el comercio "${info.row.original.name}". Intenta de nuevo.`,
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
    Api.readCommerces({ _token: token ?? "" })
      .then((res: any) => {
        setCommerces(res);
      })
      .catch(console.log);
  }, []);
  const handleSearch = (query) => {
    Api.readCommerces({
      _token: token ?? "",
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setCommerces(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query) => {
    Api.readCommerces({
      _token: token ?? "",
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setCommerces(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={commerces}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default Index;
