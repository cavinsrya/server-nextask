import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema.js";
import {
  createTaskService,
  deleteTaskService,
  getUserTasksService,
  updateTaskService,
} from "../services/taskService.js";

export const getMyTasks = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const tasks = await getUserTasksService(userId);

    res
      .status(200)
      .json({ message: "Tasks retrieved successfully", data: tasks });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const parsedData = createTaskSchema.parse(req.body);
    const newTask = await createTaskService(userId, parsedData);

    res
      .status(201)
      .json({ message: "Task created successfully", data: newTask });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    console.error("Create Task Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id as string;
    const parsedData = updateTaskSchema.parse(req.body);

    const updatedTask = await updateTaskService(userId, taskId, parsedData);
    res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error: any) {
    if (error.message === "TASK_NOT_FOUND") {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (error.message === "UNAUTHORIZED") {
      res
        .status(403)
        .json({ message: "You do not have permission to update this task" });
      return;
    }
    console.error("Update Task Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.id as string;

    await deleteTaskService(userId, taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    if (error.message === "TASK_NOT_FOUND") {
      res.status(404).json({ message: "Task not found" });
      return;
    }
    if (error.message === "UNAUTHORIZED") {
      res
        .status(403)
        .json({ message: "You do not have permission to delete this task" });
      return;
    }
    console.error("Delete Task Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
