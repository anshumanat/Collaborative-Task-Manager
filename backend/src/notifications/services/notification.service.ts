import { PrismaClient } from "@prisma/client";
import { getIO } from "../../socket";

const prisma = new PrismaClient();

export class NotificationService {
  static async create(
    userId: string,
    type: string,
    message: string
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        message,
      },
    });

    const io = getIO();
    io.to(`user:${userId}`).emit("notification:new", notification);

    return notification;
  }

  static async list(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async markAsRead(userId: string, id: string) {
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }
}
