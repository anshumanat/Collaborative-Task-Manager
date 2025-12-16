import { useTasks } from "../hooks/useTasks";

export default function Dashboard() {
  const { data, isLoading, isError } = useTasks();

  if (isLoading) {
    return <p className="p-6">Loading tasks...</p>;
  }

  if (isError) {
    return <p className="p-6 text-red-500">Failed to load tasks</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      <ul className="space-y-2">
        {data?.map((task) => (
          <li
            key={task.id}
            className="border p-3 rounded flex justify-between"
          >
            <span>{task.title}</span>
            <span className="text-sm text-gray-500">
              {task.status} · {task.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
