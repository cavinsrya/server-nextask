import prisma from "../utils/prisma.js";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema.js";
import type { Prisma } from "@prisma/client";

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const getUserTasksService = async (userId: string) => {
  return await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createTaskService = async (
  userId: string,
  data: CreateTaskInput,
) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      status: data.status,
      priority: data.priority,
      description: data.description,
      dueDate: data.dueDate,
      userId,
    },
  });
};

export const updateTaskService = async (
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) => {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existingTask) throw new Error("TASK_NOT_FOUND");
  if (existingTask.userId !== userId) throw new Error("UNAUTHORIZED");

  const updatePayload: Prisma.TaskUpdateInput = {};

  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.status !== undefined) updatePayload.status = data.status;
  if (data.priority !== undefined) updatePayload.priority = data.priority;
  if (data.description !== undefined)
    updatePayload.description = data.description;
  if (data.dueDate !== undefined) updatePayload.dueDate = data.dueDate;

  return await prisma.task.update({
    where: { id: taskId },
    data: updatePayload,
  });
};

export const deleteTaskService = async (userId: string, taskId: string) => {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existingTask) throw new Error("TASK_NOT_FOUND");
  if (existingTask.userId !== userId) throw new Error("UNAUTHORIZED");

  return await prisma.task.delete({
    where: { id: taskId },
  });
};
