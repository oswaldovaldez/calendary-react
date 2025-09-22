import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { showConfirm } from "../../utils/alert";
import { useNotificationStore } from "../../store/notification.store";

const Index = () => {
  const [schedules, setSchedules] = useState([]);
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteSchedule = (id: number) => {
    Api.deleteSchedule({ schedule_id: id, _token: token })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
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
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/schedules/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteSchedule,
                title: "Eliminar Horarios",
                text: `Deseas eliminar el horario con ID: ${info.row.original.id}`,
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
    Api.readSchedules({ _token: token ?? "" })
      .then((res: any) => {
        setSchedules(res);
      })
      .catch(console.log);
  }, []);
  const handleSeach = (query) => {
    Api.readSchedules({ _token: token ?? "", query: query })
      .then((res: any) => {
        setSchedules(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query) => {
    Api.readSchedules({ _token: token ?? "", query: query })
      .then((res: any) => {
        setSchedules(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={schedules}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSeach}
      />
    </div>
  );
};

export default Index;
