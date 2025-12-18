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
      const user = await AuthService.register(validatedData);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  // ---------------- LOGIN ----------------
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginDto.parse(req.body);
      const result = await AuthService.login(validatedData);

      res.cookie("token", result.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // true in production (HTTPS)
        path: "/",     // explicit for safe clearing
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
      sameSite: "lax",
      secure: false,
      path: "/", //  MUST match login cookie
    });

    return res.status(200).json({ message: "Logged out successfully" });
  }

  // ---------------- GET CURRENT USER ----------------
  static async me(req: Request, res: Response) {
    const userId = (req as any).user.id;

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
    const userId = (req as any).user.id;
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

