import { useEffect } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
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
       <div>
         {loggedIn ? (
           <Tasks />
         ) : (
           <Login onLogin={() => setLoggedIn(true)} />
         )}
       </div>
     );
   }

export default App;

