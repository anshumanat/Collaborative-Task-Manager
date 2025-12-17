import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import type { Task } from "./useTasks";

type CreateTaskPayload = {
  title: string;
  description?: string;
  dueDate: string;
  priority: string;
  assignedToId: string;
};

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskPayload) =>
      apiFetch<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    // 🔹 Optimistic UI
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks =
        queryClient.getQueryData<Task[]>(["tasks"]);

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(["tasks"], [
          {
            id: "temp-id",
            title: newTask.title,
            status: "TODO",
            priority: newTask.priority,
            dueDate: newTask.dueDate,
            creatorId: "me",
            assignedToId: newTask.assignedToId,
          },
          ...previousTasks,
        ]);
      }

      return { previousTasks };
    },

    onError: (_err, _newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
