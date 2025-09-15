import React, { useEffect, useState } from 'react'
import { Input,Select } from '../../components/forms'

import { Api } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
const Create = () => {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password:"",
      role:""
    });
  
  

  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="form p6">
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} label='Nombre' name='name' type='text' />
              <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} label='Correo' name='email' type='email' />
              <Input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} label='Contraseña' name='password' type='password' />
              <Select name="role" value={formData.role}  onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={[{label:"Super Administrador",value:"superadmin"},{label:"Adminstrador",value:"admin",},{label:"Dueño",value:"owner"},{label:"Colaborador",value:"staff"}]}/>

            </div>
          </div>
          <div className="card-footer">
            <button type='submit' className="btn btn-success">Crear</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Create