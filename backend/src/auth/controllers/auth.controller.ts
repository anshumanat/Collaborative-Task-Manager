import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerDto, loginDto } from "../dtos/auth.dto";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerDto.parse(req.body);
      const user = await AuthService.register(validatedData);
      return res.status(201).json(user);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginDto.parse(req.body);
      const result = await AuthService.login(validatedData);
      res.cookie("token", result.token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // later true in production
      });
      
      return res.status(200).json(result.user);

    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
    static async logout(_req: Request, res: Response) {
      res.clearCookie("token");
      return res.status(200).json({ message: "Logged out successfully" });
   }

}
