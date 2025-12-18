import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import {
  useNotifications,
  useMarkNotificationRead,
} from "../hooks/useNotifications";
import { useEffect } from "react";
import { getSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";


export default function Navbar() {
    const logout = useLogout();
    const [open, setOpen] = useState(false);

    const { data: notifications = [] } = useNotifications();
    const markRead = useMarkNotificationRead();
    
    const unreadCount = notifications.filter((n) => !n.read).length;
    const queryClient = useQueryClient();
    
    useEffect(() => {
      const socket = getSocket();
    
      socket.on("task:assigned", () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    
      socket.on("task:status-updated", () => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      });
    
      return () => {
        socket.off("task:assigned");
        socket.off("task:status-updated");
      };
    }, [queryClient]);
    
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="font-bold text-lg text-blue-600">
            Collaborative Task Manager
          </Link>
          <Link
            to="/profile"
            className="text-gray-700 hover:text-blue-600"
          >
            Profile
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            to="/tasks/create"
            className="text-gray-700 hover:text-blue-600"
          >
            Create Task
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>
          
        {open && (
         <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded border z-50">
           <div className="p-2 text-sm font-semibold border-b">
             Notifications
           </div>
       
           {notifications.length === 0 ? (
             <div className="p-3 text-sm text-gray-500">
               No notifications
             </div>
           ) : (
             notifications.map((n) => (
               <div
                 key={n.id}
                 className={`p-3 text-sm border-b cursor-pointer ${
                   n.read ? "bg-white" : "bg-gray-100"
                 }`}
                 onClick={() => markRead.mutate(n.id)}
               >
                 <div>{n.message}</div>
                 <div className="text-xs text-gray-400">
                   {new Date(n.createdAt).toLocaleString()}
                 </div>
               </div>
             ))
           )}
         </div>
       )}
       

          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
