"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const task_service_1 = require("../tasks/services/task.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
jest.mock("@prisma/client", () => {
    const actual = jest.requireActual("@prisma/client");
    return {
        ...actual,
        PrismaClient: jest.fn(() => ({
            user: {
                findUnique: jest.fn(),
            },
        })),
    };
});
jest.mock("../socket", () => ({
    getIO: () => ({
        to: () => ({
            emit: jest.fn(),
        }),
    }),
}));
jest.mock("../notifications/services/notification.service", () => ({
    NotificationService: {
        create: jest.fn(),
    },
}));
describe("TaskService.createTask", () => {
    const prisma = new client_1.PrismaClient();
    it("should throw error if assigned user does not exist", async () => {
        prisma.user.findUnique.mockResolvedValue(null);
        await expect(task_service_1.TaskService.createTask("user-1", {
            title: "Test Task",
            description: "Test",
            dueDate: new Date().toISOString(),
            priority: "HIGH",
            assignedToId: "invalid-user",
        })).rejects.toThrow("Assigned user not found");
    });
});
describe("TaskService.updateTask authorization", () => {
    it("should throw error if user is not creator or assignee", async () => {
        const mockTask = {
            id: "task-1",
            creatorId: "creator-1",
            assignedToId: "assignee-1",
            status: client_2.TaskStatus.TODO,
            priority: "HIGH",
            title: "Test Task",
        };
        jest
            .spyOn(require("../tasks/repositories/task.repository").TaskRepository, "findById")
            .mockResolvedValue(mockTask);
        await expect(task_service_1.TaskService.updateTask("unauthorized-user", "task-1", {
            status: client_2.TaskStatus.IN_PROGRESS,
        })).rejects.toThrow("Not authorized to update this task");
    });
});
describe("TaskService.updateTask audit logging", () => {
    it("should create audit log when task status changes", async () => {
        const mockTask = {
            id: "task-1",
            creatorId: "creator-1",
            assignedToId: "assignee-1",
            status: client_2.TaskStatus.TODO,
            priority: "HIGH",
            title: "Audit Test Task",
        };
        jest
            .spyOn(require("../tasks/repositories/task.repository").TaskRepository, "findById")
            .mockResolvedValue(mockTask);
        jest
            .spyOn(require("../tasks/repositories/task.repository").TaskRepository, "update")
            .mockResolvedValue({
            ...mockTask,
            status: client_2.TaskStatus.IN_PROGRESS,
        });
        const auditSpy = jest
            .spyOn(require("../audit/services/audit.service").AuditService, "log")
            .mockResolvedValue({});
        await task_service_1.TaskService.updateTask("creator-1", "task-1", {
            status: client_2.TaskStatus.IN_PROGRESS,
        });
        expect(auditSpy).toHaveBeenCalledWith("creator-1", "task-1", "STATUS_CHANGED_TO_IN_PROGRESS");
    });
});
