import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

export type User = {
  id: string;
  name: string;
  email: string;
};

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => apiFetch("/users"),
  });
}
