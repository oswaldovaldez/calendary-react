import { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";

const Index = () => {
  const [products, setProducts] = useState([]);
  const token = useAuthStore((s) => s.token);
  const commerce = useAuthStore((s) => s.commerce);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteProduct = (id: number) => {
    Api.deleteProduct({ product_id: id, _token: `${token}` })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  const createLink = {
    url: "/products/create",
    name: "Nuevo Producto",
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
            to={`/products/${info.row.original.id}`}
            className="btn neumo btn-info"
          >
            Ver
          </Link>
          {/* Botón para editar */}
          <Link
            to={`/products/${info.row.original.id}/edit`}
            className="btn neumo btn-warning"
          >
            Editar
          </Link>
          {/* Botón para eliminar (puede ser un botón con un evento onClick) */}
          <button
            onClick={() =>
              showConfirm({
                id: info.row.original.id ?? 0,
                handleConfirm: handleDeleteProduct,
                title: "Eliminar producto",
                message: `¿Deseas eliminar el producto <strong>${info.row.original.name}</strong>?`,
                successText: `El producto <strong>${info.row.original.name}</strong> se eliminó correctamente.`,
                errorText: `No se pudo eliminar el producto <strong>${info.row.original.name}</strong>. Intenta de nuevo.`,
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
    Api.readProducts({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setProducts(res);
      })
      .catch(console.log);
  }, []);
  const handleSearch = (query: any) => {
    Api.readProducts({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setProducts(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query: any) => {
    Api.readProducts({
      _token: `${token}`,
      query: { ...query, commerce_id: `${commerce?.id}` },
    })
      .then((res: any) => {
        setProducts(res);
      })
      .catch(console.log);
  };
  return (
    <div>
      <Table
        datos={products}
        cols={cols}
        createLink={createLink}
        handlePage={handlePaginate}
        handleSearch={handleSearch}
      />
    </div>
  );
};

export default Index;
