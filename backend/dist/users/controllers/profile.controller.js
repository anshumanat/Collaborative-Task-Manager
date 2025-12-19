"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProfileController {
    static async getProfile(req, res) {
        const userId = req.user.id;
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
    static async updateProfile(req, res) {
        const userId = req.user.id;
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
exports.ProfileController = ProfileController;
