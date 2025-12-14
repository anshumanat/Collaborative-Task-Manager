import { TaskRepository } from "../repositories/task.repository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { getIO } from "../../socket";

const prisma = new PrismaClient();

export class TaskService {
  static async createTask(userId: string, data: CreateTaskDto) {
    const assignedUser = await prisma.user.findUnique({
      where: { id: data.assignedToId },
    });

    if (!assignedUser) {
      throw new Error("Assigned user not found");
    }

    const task = await TaskRepository.create({
      title: data.title,
      description: data.description,
      dueDate: new Date(data.dueDate),
      priority: data.priority as TaskPriority,
      creatorId: userId,
      assignedToId: data.assignedToId,
    }); 
    
    const io = getIO();
    io.to(`user:${data.assignedToId}`).emit("task:assigned", {
      taskId: task.id,
      title: task.title,
      assignedBy: userId,
    });
    
    return task;

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

    const updatedTask = await TaskRepository.update(taskId, {
       ...data,
       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
       priority: data.priority as TaskPriority | undefined,
       status: data.status as TaskStatus | undefined,
     });
     
     if (data.status) {
       const io = getIO();
     
       io.to(`user:${updatedTask.creatorId}`).emit("task:updated", {
         taskId: updatedTask.id,
         status: updatedTask.status,
       });
     
       io.to(`user:${updatedTask.assignedToId}`).emit("task:updated", {
         taskId: updatedTask.id,
         status: updatedTask.status,
       });
     }
     
     return updatedTask;
     
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
