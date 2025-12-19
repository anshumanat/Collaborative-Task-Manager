"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
class NotificationController {
    static async list(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await notification_service_1.NotificationService.list(userId);
            return res.json(notifications);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async markRead(req, res) {
        try {
            const userId = req.user.id;
            const notificationId = req.params.id;
            await notification_service_1.NotificationService.markAsRead(userId, notificationId);
            return res.json({ success: true });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    static async markAllRead(req, res) {
        try {
            const userId = req.user.id;
            await notification_service_1.NotificationService.markAllAsRead(userId);
            return res.json({ success: true });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.NotificationController = NotificationController;
