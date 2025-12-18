import { useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/client";

export function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    await apiFetch("/api/auth/logout", {
      method: "POST",
    });

    navigate("/login");
  };

  return logout;
}
