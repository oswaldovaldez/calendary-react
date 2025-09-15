import { Api } from "../services/api";
import { useAuthStore } from "../store/auth.store";
import { useRouter } from "@tanstack/react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  commerce: string;
};

export default function RegisterForm() {

  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const values: RegisterFormValues = {
    name: "",
    email: "",
    password: "",
    commerce: "",
  };
  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Campo requerido'),
    email: Yup.string().email('Correo Invalido').required('Campo requerido'),
    password: Yup.string().required('Campo requerido'),
    commerce: Yup.string().required('Campo requerido'),
  });
  
  const handleSubmit = async ( values: RegisterFormValues ) => {

    Api.registerUser(values)
      .then((res) => {
        console.log("Usuario registrado:", res);
        setAuth(res);
        router.navigate({ to: "/dashboard" });
      })
      .catch(console.error);
  }


  return (
    <div className="flex justify-center items-center min-h-screen max-w-lg w-lg">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <Formik initialValues={values} validationSchema={registerSchema} onSubmit={handleSubmit} >
          {({ errors, touched, isSubmitting }) => (
            <Form className="form-container">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nombre</label>
                <Field className={[ "input input-sm", errors.name && touched.name ? "input-invalid" : "" ]} type="text" name="name" />
                <ErrorMessage name="name" component="div" className="form-text-invalid" />
              </div>
              <div className="form-group">
                <label htmlFor="commerce" className="form-label">Comercio</label>
                <Field className={[ "input input-sm", errors.commerce && touched.commerce ? "input-invalid" : "" ]} type="text" name="commerce" />
                <ErrorMessage name="commerce" component="div" className="form-text-invalid" />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Correo Electronico</label>
                <Field className={[ "input input-sm", errors.email && touched.email ? "input-invalid" : "" ]} type="email" name="email" />
                <ErrorMessage name="email" component="div" className="form-text-invalid" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <Field className={[ "input input-sm", errors.password && touched.password ? "input-invalid" : "" ]} type="password" name="password" />
                <ErrorMessage name="password" component="div" className="form-text-invalid" />
              </div>
              <button className="btn btn-success mx-auto" type="submit" disabled={isSubmitting}>Registrar</button>
            </Form>
          )}
        </Formik>
      
      </div>
    </div>
  );
}
