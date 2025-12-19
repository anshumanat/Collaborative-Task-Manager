import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import AppLayout from "../components/AppLayout";
import { useProfile } from "../hooks/useProfile";

type SectionProps = {
  title: string;
  type: "assigned" | "created" | "overdue";
  status: string;
  priority: string;
  sort: "asc" | "desc";
  currentUserId?: string;
};


function TaskSection({
  title,
  type,
  status,
  priority,
  sort,
  currentUserId,
}: SectionProps) {
  const { data, isLoading, isError } = useTasks({
    type,
    status,
    priority,
    sort,
  });

  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-600">
        Failed to load {title}
      </p>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      {data && data.length === 0 && (
        <p className="text-sm text-gray-500">No tasks found.</p>
      )}

      <ul className="space-y-3">
        {data?.map((task) => (
          <li
            key={task.id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow transition"
          >
            {/* Left */}
            <div>
              <p className="font-medium text-gray-900">
                {task.title}
              </p>
              {task.description && (
                 <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                   {task.description}
                 </p>
               )}
               
              <p className="text-xs text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status */}
              <select
                value={task.status}
                onChange={(e) =>
                  updateTask.mutate({
                    id: task.id,
                    status: e.target.value,
                  })
                }
                className="text-xs border rounded px-2 py-1 bg-gray-50"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>

              {/* Priority */}
              <select
                value={task.priority}
                onChange={(e) =>
                  updateTask.mutate({
                    id: task.id,
                    priority: e.target.value,
                  })
                }
                className="text-xs border rounded px-2 py-1 bg-gray-50"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {/* Delete */}
              {task.creatorId === currentUserId && (
                <button
                  onClick={() => {
                    if (window.confirm("Delete this task?")) {
                      deleteTask.mutate(task.id);
                    }
                  }}
                  className="text-xs text-red-600 border border-red-300 px-2 py-1 rounded hover:bg-red-50"
                >
                  Delete
                </button>
              )}
              
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const { data: profile } = useProfile();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Manage and track your tasks
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border rounded-lg p-4 flex flex-wrap gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 rounded text-sm"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
            className="border p-2 rounded text-sm"
          >
            <option value="asc">Due Date ↑</option>
            <option value="desc">Due Date ↓</option>
          </select>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <TaskSection
            title="Assigned to Me"
            type="assigned"
            status={status}
            priority={priority}
            sort={sort}
            currentUserId={profile?.id}
          />

          <TaskSection
            title="Created by Me"
            type="created"
            status={status}
            priority={priority}
            sort={sort}
            currentUserId={profile?.id}
          />

          <TaskSection
            title="Overdue Tasks"
            type="overdue"
            status={status}
            priority={priority}
            sort={sort}
            currentUserId={profile?.id}
          />
        </div>
      </div>
    </AppLayout>
  );
}

