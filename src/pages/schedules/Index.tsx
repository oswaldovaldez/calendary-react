import React, { useCallback, useEffect, useState } from "react";

// import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { showConfirm } from "../../utils/alert";
import { useNotificationStore } from "../../store/notification.store";
import { diasES } from "../../types";
import Modal from "../../components/Modal";
import { SchedulesCreate, SchedulesEdit } from ".";
// import { Field, Form, Formik } from "formik";
// import { FaSearch } from "react-icons/fa";

const Index = React.memo(({ userId, scheduleArray }: any) => {
  const [schedules, setSchedules] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [scheduleId, setScheduleId] = useState(0);
  const [commerceId, setCommerceId] = useState(0);
  const [query, setQuery] = useState({});
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    setQuery({ user_id: userId });
  }, []);
  // const [search, setSearch] = useState("");
  const handleDeleteSchedule = useCallback(
    (id: number) => {
      Api.deleteSchedule({ schedule_id: id, _token: `${token}` })
        .then((res) => {
          notify("success", res.message);

          console.log(commerceId);
        })
        .catch((error) => {
          console.log(error);
          notify("error", "Algo salió mal ❌");
        });
    },
    [token, notify]
  );

  const handleGetData = useCallback(() => {
    Api.readSchedules({
      _token: `${token}`,
      query: query,
    })
      .then((res: any) => {
        setSchedules(res.data);
      })
      .catch(console.log);
  }, [token, query]);
  useEffect(() => {
    setSchedules(scheduleArray);
  }, [query, token]);
  useEffect(() => {
    if (Object.keys(query).length > 0) {
      handleGetData();
    }
  }, [query]);
  // const handleSearch = useCallback(
  //   (queryData: any) => {
  //     setQuery({ ...query, ...queryData });
  //   },
  //   [setQuery]
  // );
  // const handlePaginate = useCallback(
  //   (queryData: any) => {
  //     setQuery({ ...query, queryData });
  //   },
  //   [setQuery]
  // );
  // return <>sad</>;
  return (
    <div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="w-auto flex-1 flex flex-row">
            {/* <Formik initialValues={search} onSubmit={handleSearch}>
              {() => (
                <Form className="flex flex-row gap-2 w-full mx-2">
                  <Field
                    className={`input input-sm`}
                    type="text"
                    name="search"
                  />
                  <button
                    className="btn neumo btn-success ml-auto"
                    type="submit"
                  >
                    <FaSearch />
                  </button>
                </Form>
              )}
            </Formik> */}
          </div>
          <button
            className="btn btn-primary neumo"
            onClick={() => setOpenCreate(true)}
          >
            Nuevo Horario
          </button>
        </div>
        <div className="overflow-x-auto overflow-y-auto min-h-[400px] h-[400px] sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Dia
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Horario
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.length === 0 && (
                    <tr className="border-b">
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay horarios
                      </td>
                    </tr>
                  )}
                  {schedules.length > 0 &&
                    schedules.map((row: any) => (
                      <tr key={row.id} className="border-b">
                        <td className="px-6 py-4">{diasES[row.day_of_week]}</td>
                        <td className="px-6 py-4">
                          <div>
                            <span>
                              {row.start_time} - {row.end_time}
                            </span>
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
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="btn neumo btn-warning"
                              onClick={() => {
                                setCommerceId(row.commerce_id);
                                setScheduleId(row.id);
                                setOpenEdit(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() =>
                                showConfirm({
                                  id: row.id ?? 0,
                                  handleConfirm: handleDeleteSchedule,
                                  title: "Eliminar horario",
                                  message: `¿Deseas eliminar el horario <strong>${diasES[row.day_of_week]}</strong>?`,
                                  successText: `El horario <strong>${diasES[row.day_of_week]}</strong> se eliminó correctamente.`,
                                  errorText: `No se pudo eliminar el horario <strong>${row.name}</strong>. Intenta de nuevo.`,
                                })
                              }
                              className="btn neumo btn-danger"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* <Table
        datos={schedules}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
        handleOpen={() => setOpenCreate(true)}
        isLink={false}
      /> */}
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
});

export default Index;
