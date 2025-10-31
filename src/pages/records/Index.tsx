import { useEffect, useState } from "react";

// import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
// import { Link } from "@tanstack/react-router";
// import { useNotificationStore } from "../../store/notification.store";
// import { showConfirm } from "../../utils/alert";
import { type PatientType } from "../../types/index";
import Modal from "../../components/Modal";
import { RecordsCreate, RecordsEdit } from ".";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";

interface IndexProps {
  patient: PatientType;
}

const RecordsIndex = ({ patient }: IndexProps) => {
  const [records, setRecords] = useState(patient.records || []);
  const [template, setTemplate] = useState(null);
  const [record, setRecord] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  // const [query, setQuery] = useState({});
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);

  useEffect(() => {
    setRecords(patient.records || []);
    Api.readRecordTemplates({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}`, search: "record" },
    })
      .then((res: any) => {
        setTemplate(res.data[0]);
      })
      .catch(console.log);
  }, []);

  const handdleDelete = (id: number) => {
    Api.deleteRecord({
      _token: `${token}`,
      record_id: id,
    })
      .then(() => {
        setRecords(records.filter((r) => r.id !== id));
        notify("success", "Registro eliminado correctamente");
      })
      .catch(console.log);
  };

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
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            Nuevo Registro
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
                      Fecha
                    </th>

                    <th scope="col" className="px-6 py-4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 && (
                    <tr className="border-b">
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay registros
                      </td>
                    </tr>
                  )}
                  {records.length > 0 &&
                    records.map((row: any) => (
                      <tr key={row.id} className="border-b">
                        <td className="px-6 py-4">{row.type}</td>
                        <td className="px-6 py-4">
                          {new Date(row.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="btn neumo btn-warning"
                              onClick={() => {
                                setRecord(row);
                                setOpenEdit(true);
                              }}
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                showConfirm({
                                  id: row.id ?? 0,
                                  handleConfirm: handdleDelete,
                                  title: "Eliminar día no laborable",
                                  message: `¿Estás seguro de que deseas eliminar este día no laborable? Esta acción no se puede deshacer.`,
                                  successText: `Registro eliminado correctamente.`,
                                  errorText: `Error al eliminar el registro.`,
                                });
                              }}
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
        onClosex={() => setOpenEdit(false)}
        title="Editar Registro"
      >
        <RecordsEdit
          values={record}
          template={template ?? {}}
          onClosex={() => setOpenEdit(false)}
        />
      </Modal>
      <Modal
        isOpen={openCreate}
        onClosex={() => {
          setOpenCreate(false);
        }}
        title="Nuevo Registro"
      >
        <RecordsCreate
          template={template ?? {}}
          patientId={patient.id}
          onClosex={() => {
            setOpenCreate(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default RecordsIndex;
