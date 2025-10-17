import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { UserType } from "../../types";
import PermissionsComponent from "../../components/PermissionsComponent";
import { useNotificationStore } from "../../store/notification.store";

import UserServicesComponent from "../../components/UserServicesComponent";

const ShowUser = () => {
  const { userId } = useParams({ from: "/users/$userId" });
  const token = useAuthStore((s) => s.token);
  const notify = useNotificationStore((state) => state.notify);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState([]);
  const [services, setServices] = useState([]);
  const commerce = useAuthStore((s) => s.commerce);
  const [isMounted, setIsMounted] = useState(true);

  const onSubmit = (values: any) => {
    // console.log("submit");
    // console.log(values);
    Api.syncPermissions({
      _token: `${token}`,
      userId: userId,
      permissions: values,
    })
      .then((res) => notify("success", res.message))
      .catch((err) => console.log(err));
  };

  const syncService = (values: any) => {
    console.log("sync", values);
    Api.syncServices({
      _token: `${token}`,
      userId: userId,
      services: values,
    })
      .then((res) => {
        setUser(res.data);
        notify("success", res.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!token) {
      setError("No hay sesión activa");
      setIsLoading(false);
      return;
    }
    Api.readServices({
      _token: `${token}`,
      query: { commerce_id: `${commerce?.id}`, all: "true" },
    })
      .then((res: any) => {
        setServices(res);
      })
      .catch(console.log);

    const handleGetPerssions = async () => {
      Api.getPermissions({ _token: `${token}` })
        .then((res) => {
          setPermissions(res.data);
        })
        .catch((err) => console.log(err));
    };
    const fetchUser = async () => {
      handleGetPerssions();
      setIsLoading(true);
      try {
        const response = await Api.showUser({
          _token: `${token}`,
          user_id: Number(userId),
        });

        if (!isMounted) return;
        setUser(response as UserType);
        setError(null);
      } catch (err) {
        console.error("Error cargando el usuario", err);
        if (!isMounted) return;
        setError("No pudimos cargar el usuario");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      setIsMounted(false);
    };
  }, [userId, token]);

  if (isLoading) {
    return <div className="card neumo p-6">Cargando usuario...</div>;
  }

  if (error || !user) {
    return (
      <div className="card neumo p-6">{error ?? "Usuario no encontrado"}</div>
    );
  }

  return (
    <>
      <div className="card neumo">
        <div className="card-header">
          <h2 className="text-lg font-semibold">Detalle de usuario</h2>
          <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
        <div className="card-body grid gap-3 grid-cols-1 md:grid-cols-2">
          <div>
            <span className="font-semibold">Nombre:</span> {user.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-semibold">Roles:</span>{" "}
            {Array.isArray(user.roles) && user.roles.length > 0
              ? user.roles
                  .map((r: any) => (typeof r === "string" ? r : r.name))
                  .join(", ")
              : "Sin roles"}
          </div>
          {/* <div>
					<span className="font-semibold">Permisos:</span>{" "}
					{Array.isArray(user.permissions) &&
					user.permissions.length > 0
						? user.permissions.join(", ")
						: "Sin permisos"}
				</div> */}
          <div>
            <span className="font-semibold">Comercios asignados:</span>{" "}
            {user.commerces?.length
              ? user.commerces.map((c) => c.name).join(", ")
              : "Ninguno"}
          </div>
          <div>
            <span className="font-semibold">Creado:</span>{" "}
            {user.created_at ? String(user.created_at) : "-"}
          </div>
          <div>
            <span className="font-semibold">Actualizado:</span>{" "}
            {user.updated_at ? String(user.updated_at) : "-"}
          </div>
        </div>
      </div>
      <PermissionsComponent
        user={user}
        permissions={permissions}
        handleOnSubmit={onSubmit}
      />
      <UserServicesComponent
        user={user}
        services={services}
        handleOnSubmit={syncService}
      />
    </>
  );
};

export default ShowUser;
