import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  // 🔐 Authenticate socket using JWT from HttpOnly cookie
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Unauthorized"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret"
      ) as { userId: string };

      socket.data.userId = decoded.userId;
      next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  // 🔗 Connection + room join
  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    const roomName = `user:${userId}`;

    socket.join(roomName);

    console.log(`🔌 Socket connected: user ${userId}`);

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: user ${userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
