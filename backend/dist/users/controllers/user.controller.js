"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserController {
    static async list(req, res) {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return res.json(users);
    }
}
exports.UserController = UserController;
