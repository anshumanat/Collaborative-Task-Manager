import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

type LoginPayload = {
  email: string;
  password: string;
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}
