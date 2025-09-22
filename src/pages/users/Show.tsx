import React, { useEffect, useState } from "react";

import { useParams } from "@tanstack/react-router";
import { Api } from "../../services/api";
import { useAuthStore } from "../../store/auth.store";
import type { userType } from "../../types";

const Show = () => {
  const { userId } = useParams({ from: "/users/$userId" });
  const token = useAuthStore((s) => s.token);
  const [userData, setUserData] = useState<userType>({
    commerces: [],
    created_at: "",
    email: "",
    email_verified_at: "",
    id: 0,
    name: "",
    permissions: [],
    roles: [],
    updated_at: "",
  });
  useEffect(() => {
    Api.showUser({ _token: token ?? "", user_id: userId })
      .then((res: any) => {
        setUserData(res);
        // console.log(res);
      })
      .catch(console.log);
  }, []);

  return (
    <div>
      <div className="card">
        <div className="card-body">
          <span>Id:{userData.id}</span>
          <br />
          <span>Nombre:{userData.name}</span>
          <br />
          <span>Email:{userData.email}</span>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Show;
