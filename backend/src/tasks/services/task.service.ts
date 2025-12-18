import { TaskRepository } from "../repositories/task.repository";
import { CreateTaskDto, UpdateTaskDto } from "../dtos/task.dto";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { getIO } from "../../socket";
import { NotificationService } from "../../notifications/services/notification.service";
import { AuditService } from "../../audit/services/audit.service";

const prisma = new PrismaClient();

export class TaskService {
  // 🆕 CREATE TASK
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

    // 🔔 Persistent notification on creation
    await NotificationService.create(
      data.assignedToId,
      "TASK_ASSIGNED",
      `You were assigned a task: ${task.title}`
    );

    // 🔔 Real-time socket event
    const io = getIO();
    io.to(`user:${data.assignedToId}`).emit("task:assigned", {
      taskId: task.id,
      title: task.title,
      assignedBy: userId,
    });

    return task;
  }

  // 📄 LIST TASKS
  static async getTasks(
    userId: string,
    filters: {
      status?: TaskStatus;
      priority?: TaskPriority;
    }
  ) {
    return TaskRepository.findMany({
      assignedToId: userId,
      status: filters.status,
      priority: filters.priority,
    });
  }

  // ✏️ UPDATE TASK
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
    });

    const io = getIO();

    // 🔔 Status change
    if (data.status && data.status !== task.status) {
      io.to(`user:${task.creatorId}`).emit("task:status-updated", {
        taskId: updatedTask.id,
        status: updatedTask.status,
      });

      io.to(`user:${task.assignedToId}`).emit("task:status-updated", {
        taskId: updatedTask.id,
        status: updatedTask.status,
      });

      await NotificationService.create(
        task.creatorId,
        "TASK_STATUS_CHANGED",
        `Task "${updatedTask.title}" status changed to ${updatedTask.status}`
      );

      await AuditService.log(
         userId,
         updatedTask.id,
         `STATUS_CHANGED_TO_${updatedTask.status}`
       );
       
    }

    // 🔔 Priority change
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

    // 🔔 Assignee change (reassignment)
    if (data.assignedToId && data.assignedToId !== task.assignedToId) {
      io.to(`user:${data.assignedToId}`).emit("task:assigned", {
        taskId: updatedTask.id,
        title: updatedTask.title,
        assignedBy: userId,
      });

      await NotificationService.create(
        data.assignedToId,
        "TASK_ASSIGNED",
        `You were assigned a task: ${updatedTask.title}`
      );
    }

    return updatedTask;
  }

  // 🗑️ DELETE TASK
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
