import React, { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router"; // 👈
import type { UserType } from "../../types";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import FormUser from "./FormUser";

const Create = () => {
  const token = useAuthStore((s) => s.token);
  const values: UserType = {
    name: "",
    email: "",
    password: "",
    permissions: [],
    data: [],
    roles: [],
  };

  const handleSubmit = async (values: UserType) => {
    console.log(values);
  };
  return <FormUser initialValues={values} onSubmit={handleSubmit} />;
};

export default Create;
