import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

export type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  creatorId: string;
  assignedToId: string;
};

type TaskFilter = {
  type?: "assigned" | "created" | "overdue";
  status?: string;
  priority?: string;
  sort?: "asc" | "desc";
};

export function useTasks(filter?: TaskFilter) {
  return useQuery<Task[]>({
    queryKey: ["tasks", filter],
    queryFn: () => {
      const params = new URLSearchParams();

      if (filter?.status) params.append("status", filter.status);
      if (filter?.priority) params.append("priority", filter.priority);
      if (filter?.sort) params.append("sort", filter.sort);

      // 👇 IMPORTANT: map frontend type → backend view
      if (filter?.type === "assigned") {
        params.append("view", "assigned");
      }

      if (filter?.type === "created") {
        params.append("view", "created");
      }

      if (filter?.type === "overdue") {
        params.append("view", "overdue");
      }

      return apiFetch(`/tasks?${params.toString()}`);
    },
  });
}



