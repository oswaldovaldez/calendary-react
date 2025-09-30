import { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";

const Index = () => {
  const [records, setRecords] = useState([]);
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteRecord = (id: number) => {
    Api.deleteRecord({ record_id: id, _token: `${token}` })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  const createLink = {
    url: "/records/create",
    name: "Nuevo Expediente",
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
            to={`/records/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/records/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteRecord,
                title: "Eliminar registro",
                message: `¿Deseas eliminar el registro <strong>${info.row.original.name}</strong>?`,
                successText: `El registro <strong>${info.row.original.name}</strong> se eliminó correctamente.`,
                errorText: `No se pudo eliminar el registro <strong>${info.row.original.name}</strong>. Intenta de nuevo.`,
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
    Api.readRecords({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setRecords(res);
      })
      .catch(console.log);
  }, []);
  const handleSearch = (query: any) => {
    Api.readRecords({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setRecords(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query: any) => {
    Api.readRecords({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setRecords(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={records}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default Index;
