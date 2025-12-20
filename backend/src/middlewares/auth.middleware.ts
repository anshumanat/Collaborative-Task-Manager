import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token =
  req.cookies?.token ||
  req.headers.authorization?.split(" ")[1];


  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as { userId: string };

    (req as any).user = { id: decoded.userId };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
