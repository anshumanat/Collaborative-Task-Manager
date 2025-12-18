import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/me", ProfileController.getProfile);
router.put("/me", ProfileController.updateProfile);

export default router;
