"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TaskRepository {
    static async create(data) {
        return prisma.task.create({
            data: {
                ...data,
                description: data.description ?? "",
            },
        });
    }
    static async findById(taskId) {
        return prisma.task.findUnique({
            where: { id: taskId },
        });
    }
    static async findMany(filters) {
        return prisma.task.findMany({
            where: {
                creatorId: filters.creatorId,
                assignedToId: filters.assignedToId,
                status: filters.status,
                priority: filters.priority,
                dueDate: filters.dueDate,
            },
            orderBy: {
                dueDate: "asc",
            },
        });
    }
    static async update(taskId, data) {
        return prisma.task.update({
            where: { id: taskId },
            data,
        });
    }
    static async delete(taskId) {
        return prisma.task.delete({
            where: { id: taskId },
        });
    }
}
exports.TaskRepository = TaskRepository;
