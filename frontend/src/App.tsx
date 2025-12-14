import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socket.on("task:assigned", (data) => {
      console.log("🔔 Task assigned:", data);
      alert(`New task assigned: ${data.title}`);
    });

    socket.on("task:updated", (data) => {
      console.log("🔄 Task updated:", data);
      alert(`Task status updated: ${data.status}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Collaborative Task Manager</h2>
      <p>Socket.io client connected.</p>
      <p>Open console to see real-time events.</p>
    </div>
  );
}

export default App;

