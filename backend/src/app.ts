import express from "express";
import cors from "cors";
import authRoutes from "./auth/routes/auth.routes";
import cookieParser from "cookie-parser";
import taskRoutes from "./tasks/routes/task.routes";


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cookieParser());
app.use("/api/tasks", taskRoutes);


app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

export default app;
