"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_dto_1 = require("../dtos/auth.dto");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthController {
    // ---------------- REGISTER ----------------
    static async register(req, res) {
        try {
            const validatedData = auth_dto_1.registerDto.parse(req.body);
            const user = await auth_service_1.AuthService.register(validatedData);
            return res.status(201).json(user);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    // ---------------- LOGIN ----------------
    static async login(req, res) {
        try {
            const validatedData = auth_dto_1.loginDto.parse(req.body);
            const result = await auth_service_1.AuthService.login(validatedData);
            res.cookie("token", result.token, {
                httpOnly: true,
                sameSite: "lax",
                secure: false, // true in production (HTTPS)
                path: "/", // explicit for safe clearing
            });
            return res.status(200).json(result.user);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }
    // ---------------- LOGOUT ----------------
    static async logout(_req, res) {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: "/", //  MUST match login cookie
        });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    // ---------------- GET CURRENT USER ----------------
    static async me(req, res) {
        const userId = req.user.id;
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
    static async updateProfile(req, res) {
        const userId = req.user.id;
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
exports.AuthController = AuthController;
