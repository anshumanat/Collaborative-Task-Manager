"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
const socket_1 = require("../../socket");
const notification_service_1 = require("../../notifications/services/notification.service");
const audit_service_1 = require("../../audit/services/audit.service");
const prisma = new client_2.PrismaClient();
class TaskService {
    // 🆕 CREATE TASK
    static async createTask(userId, data) {
        const assignedUser = await prisma.user.findUnique({
            where: { id: data.assignedToId },
        });
        if (!assignedUser) {
            throw new Error("Assigned user not found");
        }
        const task = await task_repository_1.TaskRepository.create({
            title: data.title,
            description: data.description ?? "",
            dueDate: new Date(data.dueDate),
            priority: data.priority,
            creatorId: userId,
            assignedToId: data.assignedToId,
        });
        // 🔔 Persistent notification
        await notification_service_1.NotificationService.create(data.assignedToId, "TASK_ASSIGNED", `You were assigned a task: ${task.title}`);
        // 🔔 Real-time event
        const io = (0, socket_1.getIO)();
        io.to(`user:${data.assignedToId}`).emit("task:assigned", {
            taskId: task.id,
            title: task.title,
            assignedBy: userId,
        });
        return task;
    }
    // 📄 LIST TASKS (Assigned / Created / Overdue)
    static async getTasks(userId, filters) {
        // 🔴 OVERDUE TASKS
        if (filters.overdue) {
            return task_repository_1.TaskRepository.findMany({
                assignedToId: userId,
                status: { not: client_1.TaskStatus.COMPLETED },
                priority: filters.priority,
                dueDate: { lt: new Date() },
            });
        }
        // 🔵 ASSIGNED / CREATED TASKS
        return task_repository_1.TaskRepository.findMany({
            creatorId: filters.creatorId,
            assignedToId: filters.assignedToId,
            status: filters.status,
            priority: filters.priority,
        });
    }
    // ✏️ UPDATE TASK
    static async updateTask(userId, taskId, data) {
        const task = await task_repository_1.TaskRepository.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        if (task.creatorId !== userId && task.assignedToId !== userId) {
            throw new Error("Not authorized to update this task");
        }
        const updatedTask = await task_repository_1.TaskRepository.update(taskId, {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        });
        const io = (0, socket_1.getIO)();
        // 🔔 STATUS CHANGE
        if (data.status && data.status !== task.status) {
            io.to(`user:${task.creatorId}`).emit("task:status-updated", {
                taskId: updatedTask.id,
                status: updatedTask.status,
            });
            io.to(`user:${task.assignedToId}`).emit("task:status-updated", {
                taskId: updatedTask.id,
                status: updatedTask.status,
            });
            await notification_service_1.NotificationService.create(task.creatorId, "TASK_STATUS_CHANGED", `Task "${updatedTask.title}" status changed to ${updatedTask.status}`);
            await audit_service_1.AuditService.log(userId, updatedTask.id, `STATUS_CHANGED_TO_${updatedTask.status}`);
        }
        // 🔔 PRIORITY CHANGE
        if (data.priority && data.priority !== task.priority) {
            io.to(`user:${task.creatorId}`).emit("task:priority-updated", {
                taskId: updatedTask.id,
                priority: updatedTask.priority,
            });
            io.to(`user:${task.assignedToId}`).emit("task:priority-updated", {
                taskId: updatedTask.id,
                priority: updatedTask.priority,
            });
        }
        // 🔔 ASSIGNEE CHANGE
        if (data.assignedToId && data.assignedToId !== task.assignedToId) {
            io.to(`user:${data.assignedToId}`).emit("task:assigned", {
                taskId: updatedTask.id,
                title: updatedTask.title,
                assignedBy: userId,
            });
            await notification_service_1.NotificationService.create(data.assignedToId, "TASK_ASSIGNED", `You were assigned a task: ${updatedTask.title}`);
        }
        return updatedTask;
    }
    // 🗑️ DELETE TASK
    static async deleteTask(userId, taskId) {
        const task = await task_repository_1.TaskRepository.findById(taskId);
        if (!task) {
            throw new Error("Task not found");
        }
        if (task.creatorId !== userId) {
            throw new Error("Not authorized to delete this task");
        }
        return task_repository_1.TaskRepository.delete(taskId);
    }
}
exports.TaskService = TaskService;
