import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useState, useEffect, useRef } from "react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../hooks/useNotifications";
import { getSocket } from "../hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { data: notifications = [] } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🔔 Real-time socket updates
  useEffect(() => {
    const socket = getSocket();

    socket.on("task:assigned", () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:status-updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task:priority-updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      socket.off("task:assigned");
      socket.off("task:status-updated");
      socket.off("task:priority-updated");
    };
  }, [queryClient]);

  // ❌ Close notification dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="font-bold text-lg text-blue-600"
        >
          Task Manager
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/tasks/create" className="nav-link">
            Create Task
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative"
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-10 w-80 bg-white shadow-lg rounded border max-h-96 overflow-y-auto"
              >
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="text-sm font-semibold">
                    Notifications
                  </span>

                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead.mutate()}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead.mutate(n.id)}
                      className={`p-3 text-sm border-b cursor-pointer transition ${
                        n.read
                          ? "bg-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <div>{n.message}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="hidden md:block text-sm text-red-600 hover:underline"
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenu((v) => !v)}
            className="md:hidden text-xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-3">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenu(false)}
            className="block nav-link"
          >
            Dashboard
          </Link>
          <Link
            to="/tasks/create"
            onClick={() => setMobileMenu(false)}
            className="block nav-link"
          >
            Create Task
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenu(false)}
            className="block nav-link"
          >
            Profile
          </Link>
          <button
            onClick={logout}
            className="block text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}



