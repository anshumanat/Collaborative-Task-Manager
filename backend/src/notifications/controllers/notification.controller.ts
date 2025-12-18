import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  static async list(req: Request, res: Response) {
    const userId = (req as any).user.id;

    const notifications = await NotificationService.list(userId);
    res.json(notifications);
  }

  static async markRead(req: Request, res: Response) {
    const userId = (req as any).user.id;
    const { id } = req.params;

    await NotificationService.markAsRead(userId, id);
    res.json({ success: true });
  }
}
