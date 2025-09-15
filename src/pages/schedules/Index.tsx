import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";

const Index = () => {
  const [schedules, setSchedules] = useState([]);
  const token = useAuthStore((s) => s.token);
  const createLink = {
    url: "/schedules/create",
    name: "Nuevo Horario",
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
            to={`/schedules/${info.row.original.id}`}
            className="btn btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/schedules/${info.row.original.id}/edit`}
            className="btn btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              alert(`Eliminar comercio con ID: ${info.row.original.id}`)
            }
            className="btn btn-danger"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    Api.readSchedules({ _token: token ?? "" })
      .then((res: any) => {
        setSchedules(res);
      })
      .catch(console.log);
  }, []);
  return (
    <div>
      
      
        <Table datos={schedules} cols={cols} createLink={createLink} />
      
    </div>
  );
};

export default Index;
