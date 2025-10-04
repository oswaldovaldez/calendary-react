import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";

import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { CommerceType, UserType } from "../../types";
import { CiTrash } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";
import { useNotificationStore } from "../../store/notification.store";

const ShowCommerce = () => {
  const { commerceId } = useParams({ from: "/commerces/$commerceId" });
  const token = useAuthStore((state) => state.token);
  const notify = useNotificationStore((state) => state.notify);
  const [commerce, setCommerce] = useState<CommerceType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(0);
  const [users, setUsers] = useState<Array<UserType>>([]);
  let isMounted = true;
  const fetchCommerce = async () => {
    setIsLoading(true);
    try {
      const response = await Api.showCommerce({
        _token: `${token}`,
        commerce_id: Number(commerceId),
      });
      if (!isMounted) return;

      setCommerce(response as CommerceType);
      setError(null);
    } catch (err) {
      console.error("Error cargando el comercio", err);
      if (!isMounted) return;
      setError("No pudimos cargar el comercio");
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };
  const fetchUsers = () => {
    Api.readUsers({ _token: `${token}`, query: { all: "true" } }).then((res) =>
      setUsers(res)
    );
  };
  const detachUser = async (_userId: number) => {
    Api.detachUserCommerce({
      _token: `${token}`,
      commerce_id: commerceId,
      user_id: _userId,
    })
      .then((res) => {
        notify("success", res.message);
        fetchCommerce();
      })
      .catch((error) => console.log(error));
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    Api.attachUserCommerce({
      _token: `${token}`,
      commerce_id: commerceId,
      user_id: userId ?? 0,
    })
      .then((res) => {
        notify("success", res.message);
        fetchCommerce();
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }

    fetchCommerce();
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, [commerceId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando comercio...</div>;
  }

  if (error || !commerce) {
    return (
      <div className="card neumo p-6">{error ?? "Comercio no encontrado"}</div>
    );
  }

  return (
    <>
      <div className="card neumo">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Detalle de comercio</h2>
          <p className="text-sm text-gray-500">ID: {commerce.id}</p>
        </div>
        <div className="card-body grid gap-3 md:grid-cols-2">
          <div>
            <span className="font-semibold">Nombre:</span> {commerce.name}
          </div>
          <div>
            <span className="font-semibold">Descripción:</span>{" "}
            {commerce.description ?? "Sin descripción"}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            {commerce.email ?? "Sin email"}
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span>{" "}
            {commerce.phone ?? "Sin teléfono"}
          </div>
          <div>
            <span className="font-semibold">Dirección:</span>{" "}
            {commerce.address ?? "Sin dirección"}
          </div>
          {/* <div>
            <span className="font-semibold">Slug:</span>{" "}
            {commerce.slug ?? "Sin slug"}
          </div> */}
          <div>
            <span className="font-semibold">Imagen:</span>{" "}
            {commerce.image ? (
              <img
                src={commerce.image}
                alt={commerce.name}
                className="h-16 rounded"
              />
            ) : (
              "Sin imagen"
            )}
          </div>
          {/* <div>
          <span className="font-semibold">Tienda Creada:</span>{" "}
          {commerce.created_at
            ? new Date(commerce.created_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div>
        <div>
          <span className="font-semibold">Última actualización:</span>{" "}
          {commerce.updated_at
            ? new Date(commerce.updated_at).toLocaleString("es-MX", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </div> */}
          {/* <div className="md:col-span-2">
          <span className="font-semibold">Detalles:</span>{" "}
          {commerce.data && commerce.data.length > 0
            ? JSON.stringify(commerce.data)
            : "Sin datos"}
        </div> */}
        </div>
      </div>
      {commerce.data !== null && (
        <div className="card neumo mt-4">
          <div className="card-header">
            <h3>Detalles</h3>
          </div>
          <div className="card-body"></div>
        </div>
      )}
      <div className="card neumo mt-4">
        <div className="card-header">
          <h3>Usuarios</h3>
        </div>
        <div className="card-body">
          {commerce.users.map((user: any, indexUser: number) => (
            <div
              className="flex mb-3 justify-between"
              key={`commerce-user-${indexUser}`}
            >
              {user.name}
              <button
                onClick={() => detachUser(user.id)}
                className="btn btn-danger neumo"
              >
                <CiTrash />
              </button>
            </div>
          ))}
          <div className="mt-4">
            <form
              className="flex justify-between px-2 gap-3"
              onSubmit={handleSubmit}
            >
              <select
                name=""
                value={`${userId}`}
                onChange={(e: any) => setUserId(e.target.value as number)}
                className="input input-sm"
                id=""
              >
                <option value="">Selcciona</option>
                {users.map((usuario, index) => (
                  <option key={`option-user-${index}`} value={usuario.id}>
                    {usuario.name ?? ""} ({usuario.email})
                  </option>
                ))}
              </select>
              <button className="btn neumo btn-success ml-auto" type="submit">
                <FaCheck />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowCommerce;
