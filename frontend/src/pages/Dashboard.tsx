import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useDeleteTask } from "../hooks/useDeleteTask";

type SectionProps = {
  title: string;
  type: "assigned" | "created" | "overdue";
  status: string;
  priority: string;
  sort: "asc" | "desc";
};

function TaskSection({
  title,
  type,
  status,
  priority,
  sort,
}: SectionProps) {
  const { data, isLoading, isError } = useTasks({
    type,
    status,
    priority,
    sort,
  });

  // ✅ Hooks must be here
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  if (isLoading) return <p>Loading {title}...</p>;
  if (isError) return <p className="text-red-500">Failed to load {title}</p>;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {data && data.length === 0 && (
        <p className="text-sm text-gray-500">No tasks</p>
      )}

      <ul className="space-y-2">
        {data?.map((task) => (
          <li
            key={task.id}
            className="border p-3 rounded flex justify-between items-center"
          >
            <div className="font-medium">{task.title}</div>

            <div className="flex gap-2 items-center">
              {/* Status */}
              <select
                value={task.status}
                onChange={(e) =>
                  updateTask.mutate({
                    id: task.id,
                    status: e.target.value,
                  })
                }
                className="border p-1 rounded text-sm"
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
                className="border p-1 rounded text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => {
                  const confirmed = window.confirm("Delete this task?");
                  if (confirmed) {
                    deleteTask.mutate(task.id);
                  }
                }}
                className="text-red-600 text-sm border px-2 rounded"
              >
                Delete
              </button>
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        >
          <option value="asc">Due Date ↑</option>
          <option value="desc">Due Date ↓</option>
        </select>
      </div>

      {/* Sections */}
      <TaskSection
        title="Assigned to Me"
        type="assigned"
        status={status}
        priority={priority}
        sort={sort}
      />

      <TaskSection
        title="Created by Me"
        type="created"
        status={status}
        priority={priority}
        sort={sort}
      />

      <TaskSection
        title="Overdue Tasks"
        type="overdue"
        status={status}
        priority={priority}
        sort={sort}
      />
    </div>
  );
}

