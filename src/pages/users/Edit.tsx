import React, { useState, useEffect } from "react";
import { Input, Select } from "../../components/forms";
import { useForm } from "../../hooks/useForm";
import { useAuthStore } from "../../store/auth.store";
import { Api } from "../../services/api";
import { useParams } from "@tanstack/react-router";

const Edit = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const { userId } = useParams({ from: "/users/$userId/edit"});
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    Api.showUser({ _token: token??'',user_id:userId })
    .then((res)=>{
      setFormData({...res,role:res.roles[0].id});
    })
    .catch(console.log);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form p6">
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                label="Nombre"
                name="name"
                type="text"
              />
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                label="Correo"
                name="email"
                type="email"
              />
              <Input
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                label="Contraseña"
                name="password"
                type="password"
              />
              <Select
                name="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                options={[
                  { label: "Super Administrador", value: "superadmin" },
                  { label: "Adminstrador", value: "admin" },
                  { label: "Dueño", value: "owner" },
                  { label: "Colaborador", value: "staff" },
                ]}
              />
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-success">
              Crear
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Edit;
