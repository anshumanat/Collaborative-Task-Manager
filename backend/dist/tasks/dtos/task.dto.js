"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskDto = exports.createTaskDto = void 0;
const zod_1 = require("zod");
exports.createTaskDto = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters"),
    description: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().datetime("Invalid due date"),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
    assignedToId: zod_1.z.string().uuid("Invalid user ID"),
});
exports.updateTaskDto = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title is required")
        .max(100, "Title must be at most 100 characters")
        .optional(),
    description: zod_1.z.string().optional(),
    dueDate: zod_1.z.string().datetime("Invalid due date").optional(),
    priority: zod_1.z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    status: zod_1.z
        .enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"])
        .optional(),
    assignedToId: zod_1.z.string().uuid("Invalid user ID").optional(),
});
