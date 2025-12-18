import { io } from "socket.io-client";
import { queryClient } from "./queryClient";

export const socket = io("http://localhost:5000", {
  withCredentials: true,
});

// 🔁 Helper: refetch all task queries
const refreshTasks = () => {
  queryClient.invalidateQueries({ queryKey: ["tasks"] });
};

// Listen to backend events
socket.on("task:assigned", refreshTasks);
socket.on("task:status-updated", refreshTasks);
socket.on("task:priority-updated", refreshTasks);
