import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import authRoutes from "./auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import taskRoutes from "./tasks/routes/task.routes";
import profileRoutes from "./users/routes/profile.routes";
import notificationRoutes from "./notifications/routes/notification.routes";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./users/routes/user.routes";


const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin:[ 
    "http://localhost:5173",
  "https://collaborative-task-manager-six.vercel.app",
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "OK" });
});

app.use(errorHandler);

export default app;
