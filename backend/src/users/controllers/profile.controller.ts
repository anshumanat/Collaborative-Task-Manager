import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProfileController {
  static async getProfile(req: Request, res: Response) {
    const userId = (req as any).user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.json(user);
  }

  static async updateProfile(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { name } = req.body;

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Invalid name" });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    res.json(updated);
  }
}
