import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { Task } from "./useTasks";

type UpdateTaskPayload = {
  id: string;
  status?: string;
  priority?: string;
};

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateTaskPayload) =>
      apiFetch<Task>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
