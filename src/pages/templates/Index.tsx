/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { showConfirm } from "../../utils/alert";
import { useNotificationStore } from "../../store/notification.store";

const Index = () => {
  const [templates, setTemplates] = useState([]);
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteRecordTemplate = (id: number) => {
    Api.deleteRecordTemplate({ recordTemplate_id: id, _token: token })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  const createLink = {
    url: "/templates/create",
    name: "Nueva Plantilla",
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
            to={`/templates/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/templates/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
  onClick={() =>
    showConfirm({
      id: info.row.original.id ?? 0,
      handleConfirm: handleDeleteRecordTemplate,
      title: "Eliminar plantilla",
      message: `¿Deseas eliminar la plantilla <strong>${info.row.original.name}</strong>?`,
      successText: `La plantilla <strong>${info.row.original.name}</strong> se eliminó correctamente.`,
      errorText: `No se pudo eliminar la plantilla <strong>${info.row.original.name}</strong>. Intenta de nuevo.`,
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
    Api.readRecordTemplates({ _token: token ?? "" })
      .then((res) => {
        setTemplates(res);
      })
      .catch(console.log);
  }, []);

  const handleSeach = (query) => {
    Api.readRecordTemplates({ _token: token ?? "", query: query })
      .then((res: any) => {
        setTemplates(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query) => {
    Api.readRecordTemplates({ _token: token ?? "", query: query })
      .then((res) => {
        setTemplates(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={templates}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSeach}
      />
    </div>
  );
};

export default Index;
