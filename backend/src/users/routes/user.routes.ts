import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);
router.get("/", UserController.list);

export default router;
