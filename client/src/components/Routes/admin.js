import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";
import { useAuth } from "../../context/auth";
import { api } from "../../lib/api";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const { data } = await api.get("/api/v1/auth/admin-auth", {
          headers: { Authorization: auth?.token },
        });
        setOk(Boolean(data?.ok));
      } catch (e) {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}

