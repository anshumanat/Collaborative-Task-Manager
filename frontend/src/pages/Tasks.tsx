import { useEffect, useState } from "react";
import { fetchTasks } from "../api/api";

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch {
        setError("Failed to load tasks");
      }
    };

    loadTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} — {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
