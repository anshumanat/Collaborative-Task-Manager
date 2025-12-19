import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask } from "../hooks/useCreateTask";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useUsers } from "../hooks/useUsers";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assignedToId: z.string().min(1, "Assignee is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

export default function CreateTask() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  const { data: users = [], isLoading: usersLoading } = useUsers();
  const createTaskMutation = useCreateTask();
  const navigate = useNavigate();

  const onSubmit = (data: TaskFormData) => {
    createTaskMutation.mutate(
      {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      },
      {
        onSuccess: () => {
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto">
        <div className="bg-white border rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-6">
            Create New Task
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title
              </label>
              <input
                {...register("title")}
                placeholder="Task title"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Optional description"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full border rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Assignee (✅ USER DROPDOWN) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Assign To
              </label>
              <select
                {...register("assignedToId")}
                disabled={usersLoading}
                className="w-full border rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {usersLoading ? "Loading users..." : "Select user"}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assignedToId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.assignedToId.message}
                </p>
              )}
            </div>

            {/* Backend Error */}
            {createTaskMutation.isError && (
              <p className="text-red-600 text-sm">
                {(createTaskMutation.error as Error).message}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="border px-4 py-2 rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={createTaskMutation.isPending}
                className="bg-blue-600 text-white px-5 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {createTaskMutation.isPending
                  ? "Creating..."
                  : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

