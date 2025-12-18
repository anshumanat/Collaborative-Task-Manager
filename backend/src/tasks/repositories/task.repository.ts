import { PrismaClient, TaskPriority, TaskStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskRepository {
  static async create(data: {
    title: string;
    description?: string;
    dueDate: Date;
    priority: TaskPriority;
    creatorId: string;
    assignedToId: string;
  }) {
    return prisma.task.create({
      data: {
        ...data,
        description: data.description ?? "",
      },
    });
  }

  static async findById(taskId: string) {
    return prisma.task.findUnique({
      where: { id: taskId },
    });
  }

  static async findMany(filters: {
    creatorId?: string;
    assignedToId?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }) {
    return prisma.task.findMany({
      where: {
        creatorId: filters.creatorId,
        assignedToId: filters.assignedToId,
        status: filters.status,
        priority: filters.priority,
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  }

  static async update(
    taskId: string,
    data: Partial<{
      title: string;
      description?: string;
      dueDate: Date;
      priority: TaskPriority;
      status: TaskStatus;
      assignedToId: string;
    }>
  ) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  static async delete(taskId: string) {
    return prisma.task.delete({
      where: { id: taskId },
    });
  }
}

