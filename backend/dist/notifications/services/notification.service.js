"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const client_1 = require("@prisma/client");
const socket_1 = require("../../socket");
const prisma = new client_1.PrismaClient();
class NotificationService {
    static async create(userId, type, message) {
        const notification = await prisma.notification.create({
            data: {
                userId,
                type,
                message,
            },
        });
        const io = (0, socket_1.getIO)();
        io.to(`user:${userId}`).emit("notification:new", notification);
        return notification;
    }
    static async list(userId) {
        return prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
    }
    static async markAsRead(userId, notificationId) {
        return prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId,
            },
            data: {
                read: true,
            },
        });
    }
    static async markAllAsRead(userId) {
        await prisma.notification.updateMany({
            where: {
                userId,
                read: false,
            },
            data: {
                read: true,
            },
        });
    }
}
exports.NotificationService = NotificationService;
