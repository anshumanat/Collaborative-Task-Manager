import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  static async list(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const notifications = await NotificationService.list(userId);
      return res.json(notifications);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async markRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const notificationId = req.params.id;

      await NotificationService.markAsRead(userId, notificationId);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async markAllRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;

      await NotificationService.markAllAsRead(userId);
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}

