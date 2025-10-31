// ============================================
// non-working-days/Index.tsx
// ============================================
import React, { useCallback, useEffect, useState } from "react";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { showConfirm } from "../../utils/alert";
import { useNotificationStore } from "../../store/notification.store";
import { NON_WORKING_DAY_TYPES } from "../../types";
import Modal from "../../components/Modal";
import { NonWorkingDaysCreate, NonWorkingDaysEdit } from ".";

const NonWorkingDaysIndex = React.memo(
  ({ userId, nonWorkingDaysArray }: any) => {
    const [nonWorkingDays, setNonWorkingDays] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [nonWorkingDayId, setNonWorkingDayId] = useState(0);
    const [query, setQuery] = useState({});
    const token = useAuthStore((s) => s.token);
    const notify = useNotificationStore((state) => state.notify);
    const commerce = useAuthStore((s) => s.commerce);

    useEffect(() => {
      setQuery({ user_id: userId, commerce_id: commerce?.id });
    }, [userId, commerce?.id]);

    const handleDeleteNonWorkingDay = useCallback(
      (id: number) => {
        Api.deleteNonWorkingDay({ non_working_day_id: id, _token: `${token}` })
          .then((res) => {
            notify(
              "success",
              res.message || "Día no laborable eliminado correctamente"
            );
            handleGetData();
          })
          .catch((error) => {
            console.log(error);
            notify("error", "Algo salió mal ❌");
          });
      },
      [token, notify]
    );

    const handleGetData = useCallback(() => {
      Api.readNonWorkingDays({
        _token: `${token}`,
        query: query,
      })
        .then((res: any) => {
          setNonWorkingDays(res);
        })
        .catch(console.log);
    }, [token, query]);

    useEffect(() => {
      if (nonWorkingDaysArray) {
        setNonWorkingDays(nonWorkingDaysArray);
      }
    }, [nonWorkingDaysArray]);

    useEffect(() => {
      if (Object.keys(query).length > 0) {
        handleGetData();
      }
    }, [query, handleGetData]);

    return (
      <div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between mb-4">
            <div className="w-auto flex-1 flex flex-row"></div>
            <button
              className="btn btn-primary neumo"
              onClick={() => setOpenCreate(true)}
            >
              Añadir
            </button>
          </div>
          <div className="overflow-x-auto overflow-y-auto min-h-[400px] h-[400px] sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Tipo
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Fecha Inicio
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Fecha Fin
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Notas
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nonWorkingDays.length === 0 && (
                      <tr className="border-b">
                        <td
                          colSpan={5}
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No hay días no laborables
                        </td>
                      </tr>
                    )}
                    {nonWorkingDays.length > 0 &&
                      nonWorkingDays.map((row: any) => (
                        <tr key={row.id} className="border-b">
                          <td className="px-6 py-4">
                            {NON_WORKING_DAY_TYPES[row.type] || row.type}
                          </td>
                          <td className="px-6 py-4">
                            {row.start_date}
                          </td>
                          <td className="px-6 py-4">
                            {row.end_date}
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs truncate">
                              {row.notes || "Sin notas"}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                className="btn neumo btn-warning"
                                onClick={() => {
                                  setNonWorkingDayId(row.id);
                                  setOpenEdit(true);
                                }}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() =>
                                  showConfirm({
                                    id: row.id ?? 0,
                                    handleConfirm: handleDeleteNonWorkingDay,
                                    title: "Eliminar día no laborable",
                                    message: `¿Deseas eliminar este día no laborable de tipo <strong>${NON_WORKING_DAY_TYPES[row.type]}</strong>?`,
                                    successText: `El día no laborable se eliminó correctamente.`,
                                    errorText: `No se pudo eliminar el día no laborable. Intenta de nuevo.`,
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

        <Modal
          isOpen={openEdit}
          onClosex={() => {
            setOpenEdit(false);
          }}
          title="Editar Día No Laborable"
        >
          <NonWorkingDaysEdit
            userId={userId}
            nonWorkingDayId={nonWorkingDayId}
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
          title="Nuevo Día No Laborable"
        >
          <NonWorkingDaysCreate
            userId={userId}
            reload={handleGetData}
            onClosex={() => {
              setOpenCreate(false);
            }}
          />
        </Modal>
      </div>
    );
  }
);

export default NonWorkingDaysIndex;
