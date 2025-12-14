import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", TaskController.create);
router.get("/", TaskController.list);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.delete);

export default router;
