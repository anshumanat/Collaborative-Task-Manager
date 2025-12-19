"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
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
        const cookies = cookie_1.default.parse(cookieHeader);
        const token = cookies.token;
        if (!token) {
            return next(new Error("Unauthorized"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
            socket.data.userId = decoded.userId;
            next();
        }
        catch (error) {
            return next(new Error("Unauthorized"));
        }
    });
    // 🔗 Connection + room join
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        const roomName = `user:${userId}`;
        socket.join(roomName);
        console.log(`🔌 Socket connected → user:${userId}`);
        socket.on("disconnect", () => {
            console.log(`❌ Socket disconnected → user:${userId}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
