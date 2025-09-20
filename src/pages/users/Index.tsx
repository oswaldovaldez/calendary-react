/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";

const Index = () => {
  const [users, setUsers] = useState([]);
  const token = useAuthStore((s) => s.token);
  const createLink = {
    url: "/users/create",
    name: "Nuevo Usuario",
  };
  const cols = [
    {
      accessorKey: "id",
      header: "ID",
    },
    { accessorKey: "name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    {
      // Nueva columna para las acciones
      header: "Acciones",
      cell: (info: any) => (
        <div className="flex gap-2">
          {/* Botón para ver registro */}
          <Link
            to={`/users/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/users/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              alert(`Eliminar usuario con ID: ${info.row.original.id}`)
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
    Api.readUsers({ _token: token ?? "" })
      .then((res) => {
        setUsers(res);
      })
      .catch(console.log);
  }, []);
  return (
    <div>
      <Table datos={users.data} cols={cols} createLink={createLink} />
    </div>
  );
};

export default Index;
