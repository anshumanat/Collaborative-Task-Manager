import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) =>
      apiFetch(`/tasks/${taskId}`, {
        method: "DELETE",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
