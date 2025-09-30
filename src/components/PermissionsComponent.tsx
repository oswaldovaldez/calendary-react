import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";

type Permission = {
  name: string;
  value: string;
};

type User = {
  permissions?: Permission[];
};

type PermissionsComponentProps = {
  user: User;
  permissions: Permission[];
  handleOnSubmit: (selected: string[]) => void;
};

const PermissionsComponent = ({
  user,
  permissions,
  handleOnSubmit,
}: PermissionsComponentProps) => {
  // Estado para manejar los permisos seleccionados
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Inicializar con los permisos del usuario
  useEffect(() => {
    // setSelectedPermissions(user?.permissions || []);
    const permissionNames = user?.permissions?.map((p: any) => p.name) || [];
    setSelectedPermissions(permissionNames);
  }, [user]);

  // Función para manejar el cambio de checkbox
  const handlePermissionChange = (permissionValue: any) => {
    setSelectedPermissions((prev: any) => {
      if (prev.includes(permissionValue)) {
        // Si ya está seleccionado, lo removemos
        return prev.filter((permission: any) => permission !== permissionValue);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prev, permissionValue];
      }
    });
  };

  // Función para verificar si un permiso está seleccionado
  const isPermissionSelected = (permissionValue: any) => {
    return selectedPermissions.includes(`${permissionValue}`);
  };

  // Función para manejar el submit del formulario
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log("submit");
    //   console.log("Selected permissions:", selectedPermissions);
    handleOnSubmit(selectedPermissions);

    // Aquí puedes hacer lo que necesites con los permisos seleccionados
    // Por ejemplo, enviar a una API
    // updateUserPermissions(selectedPermissions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card neumo mt-5">
        <div className="card-header">
          <h3>Permisos</h3>
        </div>
        <div className="card-body">
          <div className="form-container">
            <div className="mt-2 columns-3 md:columns-4">
              {permissions.map((element: any, index: number) => (
                <div className="form-group" key={`permission-${index}`}>
                  <label
                    htmlFor={`permission-${element.value}`}
                    className="form-label flex! gap-1"
                  >
                    <input
                      type="checkbox"
                      id={`permission-${element.value}`}
                      checked={isPermissionSelected(element.value)}
                      onChange={() => handlePermissionChange(element.value)}
                    />
                    {element.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button className="btn neumo btn-success ml-auto" type="submit">
            <FaCheck />
          </button>
        </div>
      </div>
    </form>
  );
};

export default PermissionsComponent;
