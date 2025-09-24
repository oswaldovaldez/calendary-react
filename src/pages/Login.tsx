import { Api } from "../services/api";
import { useAuthStore } from "../store/auth.store";
import { useRouter } from "@tanstack/react-router"; // 👈
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type LoginFormValues = {
  email: string;
  password: string;
};

function Login() {
  const setAuth = useAuthStore((s) => s.setAuth);

  const values: LoginFormValues = {
    email: "",
    password: "",
  };
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Correo Invalido").required("Campo requerido"),
    password: Yup.string().required("Campo requerido"),
  });

  const handleSubmit = async (values: LoginFormValues) => {
    Api.login(values)
      .then((res) => {
        setAuth(res);
        router.navigate({ to: "/dashboard" });
      })
      .catch(console.error);
  };

  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen max-w-lg w-lg mx-auto">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        <Formik
          initialValues={values}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="form-container">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Correo Electronico
                </label>
                <Field
                  className={[
                    "input input-sm",
                    errors.email && touched.email ? "input-invalid" : "",
                  ]}
                  type="email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <Field
                  className={[
                    "input input-sm",
                    errors.password && touched.password ? "input-invalid" : "",
                  ]}
                  type="password"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="form-text-invalid"
                />
              </div>
              <button
                className="btn neumo btn-success mx-auto"
                type="submit"
                disabled={isSubmitting}
              >
                Iniciar Sesión
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;
