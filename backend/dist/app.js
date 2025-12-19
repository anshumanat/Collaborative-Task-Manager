"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./auth/routes/auth.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const task_routes_1 = __importDefault(require("./tasks/routes/task.routes"));
const profile_routes_1 = __importDefault(require("./users/routes/profile.routes"));
const notification_routes_1 = __importDefault(require("./notifications/routes/notification.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const user_routes_1 = __importDefault(require("./users/routes/user.routes"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/tasks", task_routes_1.default);
app.use("/api/profile", profile_routes_1.default);
app.use("/api/notifications", notification_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.get("/health", (_req, res) => {
    res.json({ status: "OK" });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
