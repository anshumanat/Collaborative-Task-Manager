import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuditService {
  static async log(
    userId: string,
    taskId: string,
    action: string
  ) {
    return prisma.auditLog.create({
      data: {
        userId,
        taskId,
        action,
      },
    });
  }
}
