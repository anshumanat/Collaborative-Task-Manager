"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuditService {
    static async log(userId, taskId, action) {
        return prisma.auditLog.create({
            data: {
                userId,
                taskId,
                action,
            },
        });
    }
}
exports.AuditService = AuditService;
