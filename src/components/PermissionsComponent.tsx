import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";

const PermissionsComponent = ({ user, permissions, handleOnSubmit }) => {
  // Estado para manejar los permisos seleccionados
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // Inicializar con los permisos del usuario
  useEffect(() => {
      // setSelectedPermissions(user?.permissions || []);
      const permissionNames = user?.permissions?.map((p) => p.name) || [];
      setSelectedPermissions(permissionNames);
  }, [user]);

  // Función para manejar el cambio de checkbox
  const handlePermissionChange = (permissionValue) => {
    setSelectedPermissions((prev) => {
      if (prev.includes(permissionValue)) {
        // Si ya está seleccionado, lo removemos
        return prev.filter((permission) => permission !== permissionValue);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prev, permissionValue];
      }
    });
  };

  // Función para verificar si un permiso está seleccionado
  const isPermissionSelected = (permissionValue) => {
    return selectedPermissions.includes(permissionValue);
  };

  // Función para manejar el submit del formulario
  const handleSubmit = (e) => {
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
              {permissions.map((element, index) => (
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
