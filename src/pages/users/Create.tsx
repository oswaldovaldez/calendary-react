import React, { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router"; // 👈
import type { UserType } from "../../types";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import FormUser from "./FormUser";
import toast, { Toaster } from "react-hot-toast";

const Create = () => {
  const notify = (text) => toast.success(text);
  const token = useAuthStore((s) => s.token);
  const values: UserType = {
    name: "",
    email: "",
    password: "",
    permissions: [],
    data: [],
    roles: [],
  };

  const handleSubmit = async (values: any) => {
    Api.createUser({ ...values, _token: token ?? "" })
      .then((res) => {
        console.log(res);
        notify(res.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return <>
     <Toaster />
  <FormUser initialValues={values} onSubmit={handleSubmit} />;
  </>
};

export default Create;
