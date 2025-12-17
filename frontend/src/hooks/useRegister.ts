import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}
