import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createTask,
  deleteTask,
  getMyTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = Router();

router.use(authenticateToken);

router.get("/my-tasks", getMyTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
