"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const task_dto_1 = require("../dtos/task.dto");
class TaskController {
    static async create(req, res) {
        try {
            const validatedData = task_dto_1.createTaskDto.parse(req.body);
            const userId = req.user.id;
            const task = await task_service_1.TaskService.createTask(userId, validatedData);
            return res.status(201).json(task);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    static async list(req, res) {
        try {
            const userId = req.user.id;
            const status = req.query.status;
            const priority = req.query.priority;
            const view = req.query.view;
            const filters = {
                status,
                priority,
            };
            if (view === "assigned") {
                filters.assignedToId = userId;
            }
            if (view === "created") {
                filters.creatorId = userId;
            }
            if (view === "overdue") {
                filters.assignedToId = userId;
                filters.overdue = true;
            }
            const tasks = await task_service_1.TaskService.getTasks(userId, filters);
            return res.status(200).json(tasks);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const taskId = req.params.id;
            const userId = req.user.id;
            const validatedData = task_dto_1.updateTaskDto.parse(req.body);
            const task = await task_service_1.TaskService.updateTask(userId, taskId, validatedData);
            return res.status(200).json(task);
        }
        catch (error) {
            return res.status(403).json({ message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const taskId = req.params.id;
            const userId = req.user.id;
            await task_service_1.TaskService.deleteTask(userId, taskId);
            return res.status(200).json({ message: "Task deleted successfully" });
        }
        catch (error) {
            return res.status(403).json({ message: error.message });
        }
    }
}
exports.TaskController = TaskController;
