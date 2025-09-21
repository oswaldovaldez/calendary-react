import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";

const Index = () => {
  const [patients, setPatients] = useState([]);
  const token = useAuthStore((s) => s.token);
  const createLink = {
    url: "/patients/create",
    name: "Nuevo Paciente",
  };
  const cols = [
    {
      accessorKey: "id",
      header: "ID",
    },
    { accessorKey: "first_name", header: "Nombre" },
    { accessorKey: "last_name", header: "Apellidos" },
    {
      // Nueva columna para las acciones
      header: "Acciones",
      cell: (info: any) => (
        <div className="flex gap-2">
          {/* Botón para ver registro */}
          <Link
            to={`/patients/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/patients/${info.row.original.id}/edit`}
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
    Api.readPatients({ _token: token ?? "" })
      .then((res: any) => {
        setPatients(res);
      })
      .catch(console.log);
  }, []);
  const handleSeach = (values) => {};
  const handlePaginate = (query) => {
    Api.readPatients({ _token: token ?? "", query: query })
      .then((res: any) => {
        setPatients(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={patients}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
      />
    </div>
  );
};

export default Index;
