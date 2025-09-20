import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";

const Index = () => {
  const [services, setServices] = useState([]);
  const token = useAuthStore((s) => s.token);
  const createLink = {
    url: "/services/create",
    name: "Nuevo Servicio",
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
            to={`/services/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/services/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              alert(`Eliminar comercio con ID: ${info.row.original.id}`)
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
    Api.readServices({ _token: token ?? "" })
      .then((res: any) => {
        setServices(res);
      })
      .catch(console.log);
  }, []);
  return (
    <div>
      <Table datos={services.data} cols={cols} createLink={createLink} />
    </div>
  );
};

export default Index;
