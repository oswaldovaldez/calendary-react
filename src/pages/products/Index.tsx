import React, { useEffect, useState } from "react";

import Table from "../../components/Table";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import { Link } from "@tanstack/react-router";
import { useNotificationStore } from "../../store/notification.store";
import { showConfirm } from "../../utils/alert";

const Index = () => {
  const [products, setProducts] = useState([]);
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const handleDeleteProduct = (id: number) => {
    Api.deleteProduct({ product_id: id, _token: token })
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
                title: "Eliminar Producto",
                text: `Deseas eliminar al producto con ID: ${info.row.original.id}`,
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
    Api.readProducts({ _token: token ?? "" })
      .then((res: any) => {
        setProducts(res);
      })
      .catch(console.log);
  }, []);
  const handleSeach = (query) => {
    Api.readProducts({ _token: token ?? "", query: query })
      .then((res: any) => {
        setProducts(res);
      })
      .catch(console.log);
  };
  const handlePaginate = (query) => {
    Api.readProducts({ _token: token ?? "", query: query })
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
        handleSearch={handleSeach}
      />
    </div>
  );
};

export default Index;
