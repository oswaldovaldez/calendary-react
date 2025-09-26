import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { showConfirm } from "../../utils/alert";
import { useNotificationStore } from "../../store/notification.store";
import { diasES } from "../../types";
import Modal from "../../components/Modal";
import { SchedulesEdit } from ".";

const Index = ({ userId = 0 }) => {
  const [schedules, setSchedules] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [scheduleId, setScheduleId] = useState(0);
  const [commerceId, setCommerceId] = useState(0);
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
    name: "Añadir Horario",
  };
  const cols = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      accessorKey: "day_of_week",
      header: "Día",
      cell: (info: any) => {
        const dayKey = info.getValue() as string;
        return diasES[dayKey] ?? dayKey;
      },
    },
    {
      header: "Horario",
      cell: (info: any) => {
        const row = info.row.original;
        return (
          <div>
            {/* horario principal */}
            <span>
              {row.start_time} - {row.end_time}
            </span>

            {/* breaks si existen */}
            {row.breaks && row.breaks.length > 0 && (
              <div className="text-sm text-gray-400">
                {row.breaks.map((b: any, i: number) => (
                  <div key={i}>
                    Descanso: {b.start} - {b.end}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      // Nueva columna para las acciones
      header: "Acciones",
      cell: (info: any) => (
        <div className="flex gap-2">
          {/* Botón para ver registro */}
          {/* <Link
            to={`/schedules/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link> */}
          {/* Botón para editar */}
          <button
            className="btn neumo btn-warning"
            onClick={() => {
              setCommerceId(info.row.original.commerce_id);
              setScheduleId(info.row.original.id);
              setOpenEdit(true);
            }}
          >
            Editar
          </button>
          {/* <Link
            to={`/schedules/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link> */}
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteSchedule,
                title: "Eliminar horario",
                message: `¿Deseas eliminar el horario <strong>${info.row.original.name}</strong>?`,
                successText: `El horario <strong>${info.row.original.name}</strong> se eliminó correctamente.`,
                errorText: `No se pudo eliminar el horario <strong>${info.row.original.name}</strong>. Intenta de nuevo.`,
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
    if (userId !== 0) {
      Api.readSchedules({
        _token: token ?? "",
        query: { user_id: `${userId}` },
      })
        .then((res: any) => {
          setSchedules(res);
        })
        .catch(console.log);
    } else {
      Api.readSchedules({ _token: token ?? "" })
        .then((res: any) => {
          setSchedules(res);
        })
        .catch(console.log);
    }
  }, []);
  const handleSeach = (query) => {
    Api.readSchedules({
      _token: token ?? "",
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setSchedules(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query) => {
    Api.readSchedules({
      _token: token ?? "",
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
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
      <Modal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Editar Horario"
      >
        <SchedulesEdit
          commerceId={commerceId}
          userId={userId}
          scheduleId={scheduleId}
        />
      </Modal>
    </div>
  );
};

export default Index;
