import React, { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router"; // 👈
import type { UserType } from "../../types";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import FormUser from "./FormUser";
import { useNotificationStore } from "../../store/notification.store";

// import toast, { Toaster } from "react-hot-toast";

const Create = () => {
  const notify = useNotificationStore((state) => state.notify);
  const token = useAuthStore((s) => s.token);
  const values: UserType = {
    name: "",
    email: "",
    password: "",
    permissions: [],
    data: [],
    role: 0,
  };

  const handleSubmit = async (values: any) => {
    Api.createUser({ ...values, _token: token ?? "" })
      .then((res) => {
        notify("success", res.message);
      })
      .catch((error) => {
        console.log(error);
        notify("error", "Algo salió mal ❌");
      });
  };
  return (
    <>
      <FormUser initialValues={values} onSubmit={handleSubmit} />
    </>
  );
};

export default Create;
