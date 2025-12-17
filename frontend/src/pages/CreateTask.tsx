import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask } from "../hooks/useCreateTask";
import { useNavigate } from "react-router-dom";


const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.string(),
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

  const createTaskMutation = useCreateTask();
  const navigate = useNavigate();


  const onSubmit = (data: TaskFormData) => {
    const payload = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    };
  
    createTaskMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };
  
  

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-bold mb-4">Create Task</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <input
            {...register("title")}
            placeholder="Title"
            className="w-full border p-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Due Date */}
        <div>
          <input
            type="date"
            {...register("dueDate")}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Priority */}
        <div>
          <select
            {...register("priority")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          {errors.priority && (
            <p className="text-red-500 text-sm">{errors.priority.message}</p>
          )}
        </div>

        {/* Assignee */}
        <div>
          <input
            {...register("assignedToId")}
            placeholder="Assigned User ID"
            className="w-full border p-2 rounded"
          />
          {errors.assignedToId && (
            <p className="text-red-500 text-sm">
              {errors.assignedToId.message}
            </p>
          )}
        </div>

        {createTaskMutation.isError && (
          <p className="text-red-500 text-sm">
            {(createTaskMutation.error as Error).message}
          </p>
        )}
        

        <button
          type="submit"
          disabled={createTaskMutation.isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {createTaskMutation.isLoading ? "Creating..." : "Create Task"}
        </button>
        
      </form>
    </div>
  );
}
