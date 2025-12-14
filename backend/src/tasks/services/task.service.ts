import { TaskRepository } from "../repositories/task.repository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskService {
  static async createTask(userId: string, data: CreateTaskDto) {
    const assignedUser = await prisma.user.findUnique({
      where: { id: data.assignedToId },
    });

    if (!assignedUser) {
      throw new Error("Assigned user not found");
    }

    return TaskRepository.create({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      priority: data.priority as TaskPriority,
      creatorId: userId,
      assignedToId: data.assignedToId,
    });
  }

  static async getTasks(userId: string, filters: {
    status?: TaskStatus;
    priority?: TaskPriority;
  }) {
    return TaskRepository.findMany({
      assignedToId: userId,
      status: filters.status,
      priority: filters.priority,
    });
  }

  static async updateTask(
    userId: string,
    taskId: string,
    data: UpdateTaskDto
  ) {
    const task = await TaskRepository.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.creatorId !== userId && task.assignedToId !== userId) {
      throw new Error("Not authorized to update this task");
    }

    return TaskRepository.update(taskId, {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      priority: data.priority as TaskPriority | undefined,
      status: data.status as TaskStatus | undefined,
    });
  }

  static async deleteTask(userId: string, taskId: string) {
    const task = await TaskRepository.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    if (task.creatorId !== userId) {
      throw new Error("Not authorized to delete this task");
    }

    return TaskRepository.delete(taskId);
  }
}
