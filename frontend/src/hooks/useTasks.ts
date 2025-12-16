import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
};

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => apiFetch("/tasks"),
  });
}
