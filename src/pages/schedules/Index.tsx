import { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { showConfirm } from "../../utils/alert";
import { useNotificationStore } from "../../store/notification.store";
import { diasES } from "../../types";
import Modal from "../../components/Modal";
import { SchedulesCreate, SchedulesEdit } from ".";

const Index = ({ userId = 0 }) => {
  const [schedules, setSchedules] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [scheduleId, setScheduleId] = useState(0);
  const [commerceId, setCommerceId] = useState(0);
  const [query, setQuery] = useState({});
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteSchedule = (id: number) => {
    Api.deleteSchedule({ schedule_id: id, _token: `${token}` })
      .then((res) => {
        notify("success", res.message);

        console.log(commerceId);
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
                message: `¿Deseas eliminar el horario <strong>${info.row.original.day_of_week}</strong>?`,
                successText: `El horario <strong>${info.row.original.day_of_week}</strong> se eliminó correctamente.`,
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
  const handleGetData = () => {
    Api.readSchedules({
      _token: `${token}`,
      query: query,
    })
      .then((res: any) => {
        setSchedules(res);
      })
      .catch(console.log);
  };
  useEffect(() => {
    if (userId !== 0) {
      setQuery({ user_id: `${userId}` });
    }
  }, []);
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      handleGetData();
    }
  }, [query]);
  const handleSearch = (queryData: any) => {
    setQuery({ ...query, ...queryData });
  };
  const handlePaginate = (queryData: any) => {
    setQuery({ ...query, queryData });
  };
  return (
    <div>
      <Table
        datos={schedules}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
        handleOpen={() => setOpenCreate(true)}
        isLink={false}
      />
      <Modal
        isOpen={openEdit}
        onClosex={() => {
          setOpenEdit(false);
        }}
        title="Editar Horario"
      >
        <SchedulesEdit
          userId={userId}
          scheduleId={scheduleId}
          reload={handleGetData}
          onClosex={() => {
            setOpenEdit(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={openCreate}
        onClosex={() => {
          setOpenCreate(false);
        }}
        title="Nuevo Horario"
      >
        <SchedulesCreate
          userId={userId}
          reload={handleGetData}
          onClosex={() => {
            setOpenCreate(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default Index;
