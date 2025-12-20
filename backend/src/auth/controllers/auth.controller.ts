import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerDto, loginDto } from "../dtos/auth.dto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthController {
  // ---------------- REGISTER ----------------
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerDto.parse(req.body);
      const result = await AuthService.register(validatedData);

      // Set auth cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return res.status(201).json(result.user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // ---------------- LOGIN ----------------
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginDto.parse(req.body);
      const result = await AuthService.login(validatedData);

      const isProd = process.env.NODE_ENV === "production";

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
      });

      return res.status(200).json(result.user);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  // ---------------- LOGOUT ----------------
  static async logout(_req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  }

  // ---------------- GET CURRENT USER ----------------
  static async me(req: Request, res: Response) {
    const userId = (req as any).user?.id;

    // ✅ IMPORTANT GUARD (prevents Prisma crash)
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.json(user);
  }

  // ---------------- UPDATE PROFILE ----------------
  static async updateProfile(req: Request, res: Response) {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return res.json(updatedUser);
  }
}


