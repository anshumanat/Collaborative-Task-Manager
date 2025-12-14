import { Request, Response } from "express";
import { TaskService } from "../services/task.service";
import { createTaskDto, updateTaskDto } from "../dtos/task.dto";
import { TaskPriority, TaskStatus } from "@prisma/client";

export class TaskController {
  static async create(req: Request, res: Response) {
    try {
      const validatedData = createTaskDto.parse(req.body);
      const userId = (req as any).user.id;

      const task = await TaskService.createTask(userId, validatedData);
      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      const status = req.query.status as TaskStatus | undefined;
      const priority = req.query.priority as TaskPriority | undefined;

      const tasks = await TaskService.getTasks(userId, {
        status,
        priority,
      });

      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const taskId = req.params.id;
      const userId = (req as any).user.id;

      const validatedData = updateTaskDto.parse(req.body);

      const task = await TaskService.updateTask(
        userId,
        taskId,
        validatedData
      );

      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const taskId = req.params.id;
      const userId = (req as any).user.id;

      await TaskService.deleteTask(userId, taskId);
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  }
}
