import { useState, useEffect } from "react";
// import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";
import Table from "../../components/Table";
const Index = () => {
  const [categories, setCategories] = useState([]);
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteCategory = (id: number) => {
    Api.deleteCategory({ category_id: id, _token: `${token}` })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  const createLink = {
    url: "/categories/create",
    name: "Nueva Categoria",
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
            to={`/categories/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/categories/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteCategory,
                title: "Eliminar categoría",
                message: `¿Deseas eliminar la categoría <strong>${info.row.original.name}</strong>?`,
                successText: `La categoría <strong>${info.row.original.name}</strong> se eliminó correctamente.`,
                errorText: `No se pudo eliminar la categoría <strong>${info.row.original.name}</strong>. Intenta de nuevo.`,
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
    Api.readCategories({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setCategories(res);
      })
      .catch(console.log);
  }, []);
  const handleSearch = (query: any) => {
    Api.readCategories({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setCategories(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query: any) => {
    Api.readCategories({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setCategories(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={categories}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default Index;
