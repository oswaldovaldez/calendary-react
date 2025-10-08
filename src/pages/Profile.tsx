import React, { useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { ShieldUser } from "lucide-react";

const Profile: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    return <div className="text-center mt-5">Cargando información...</div>;
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes hacer tu lógica de cambio de contraseña vía API
    console.log({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Información del usuario */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div
                className="rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{
                  backgroundColor: "#ccc",
                  width: 80,
                  height: 80,
                }}
              >
                <ShieldUser className="text-3xl" style={{ color: "var(--color-text-secondary)" }} />
              </div>
              <h5 className="card-title mb-0 text-capitalize">{user.name}</h5>
              <p className="text-muted mb-1">{user.email}</p>
              <p>
                <span className="badge bg-primary">
                  {user.roles?.[0]?.name || "Usuario"}
                </span>
              </p>
              <small className="text-muted">
                Registrado el {new Date(user.created_at).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="col-md-8">
          <div className="card shadow-sm my-3">
            <div className="card-header bg-light fw-bold">
              Información del Usuario
            </div>
            <div className="card-body">
              <p>
                <strong>Correo electrónico:</strong> {user.email}
              </p>
              <p>
                <strong>Color de calendario:</strong>{" "}
                <span
                  className="badge"
                  style={{
                    backgroundColor: user.data?.calendar_color,
                    color: "white",
                  }}
                >
                  {user.data?.calendar_color}
                </span>
              </p>
              <p>
                <strong>Roles:</strong>{" "}
                {user.roles?.map((r: any) => (
                  <span key={r.id} className="badge bg-secondary me-1">
                    {r.name}
                  </span>
                ))}
              </p>
              {/* <p>
                <strong>Permisos directos:</strong>{" "}
                {user.permissions?.length ? (
                  user.permissions.map((p: any) => (
                    <span key={p.id} className="badge bg-info text-dark me-1">
                      {p.name}
                    </span>
                  ))
                ) : (
                  <em>No tiene permisos directos</em>
                )}
              </p> */}
            </div>
          </div>

          {/* Comercios */}
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-light fw-bold">Comercios</div>
            <div className="card-body">
              {user.commerces?.length ? (
                user.commerces.map((c: any) => (
                  <div key={c.id} className="mb-3 border-bottom pb-2">
                    <h6 className="mb-0">{c.name}</h6>
                    <small className="text-muted">{c.email}</small>
                    <p className="mb-1">{c.address}</p>
                    <span className="badge bg-success">
                      {c.data?.website || "Sin sitio web"}
                    </span>
                  </div>
                ))
              ) : (
                <p>No está asociado a ningún comercio.</p>
              )}
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div className="card shadow-sm">
            <div className="card-header bg-light fw-bold">
              Cambiar Contraseña
            </div>
            <div className="card-body">
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label">Contraseña actual</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Actualizar contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
