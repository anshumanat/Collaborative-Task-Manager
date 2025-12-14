import { z } from "zod";

export const createTaskDto = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().optional(),
  dueDate: z.string().datetime("Invalid due date"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string().uuid("Invalid user ID"),
});

export const updateTaskDto = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters")
    .optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime("Invalid due date").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"])
    .optional(),
  assignedToId: z.string().uuid("Invalid user ID").optional(),
});

export type CreateTaskDto = z.infer<typeof createTaskDto>;
export type UpdateTaskDto = z.infer<typeof updateTaskDto>;
