import express from "express";
import cors from "cors";
import authRoutes from "./auth/routes/auth.routes";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(cookieParser());


app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

export default app;
