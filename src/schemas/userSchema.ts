import * as Yup from "yup";

export const userSchema = Yup.object().shape({
    name: Yup.string().required("Campo requerido"),
    email: Yup.string().email("Correo Invalido").required("Campo requerido"),
    password: Yup.string().required("Campo requerido"),
  });
export const userSchemaEdit = Yup.object().shape({
    name: Yup.string().required("Campo requerido"),
    email: Yup.string().email("Correo Invalido").required("Campo requerido"),
    
  });