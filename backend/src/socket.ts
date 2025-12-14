import { Server } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import cookie from "cookie";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

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

  io.on("connection", (socket) => {
  const userId = socket.data.userId;
  const roomName = `user:${userId}`;

  socket.join(roomName);

  console.log(`Socket connected for user ${userId} in room ${roomName}`);
});

 
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
