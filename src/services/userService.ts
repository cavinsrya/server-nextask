import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { registerSchema } from "../schemas/userSchema.js";
import jwt from "jsonwebtoken";
import { loginSchema } from "../schemas/userSchema.js";
import { updateProfileSchema } from "../schemas/userSchema.js";

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const registerUserService = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  const newUser = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const loginUserService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const secretKey = process.env.JWT_SECRET || "fallback_secret_key";
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secretKey,
    { expiresIn: "1d" },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const updateUserService = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const updatePayload: Prisma.UserUpdateInput = {};

  if (data.name !== undefined) updatePayload.name = data.name;

  if (data.password !== undefined) {
    const saltRounds = 10;
    updatePayload.password = await bcrypt.hash(data.password, saltRounds);
  }

  return await prisma.user.update({
    where: { id: userId },
    data: updatePayload,
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};
