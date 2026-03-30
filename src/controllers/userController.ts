import type { Request, Response } from "express";
import { registerSchema } from "../schemas/userSchema.js";
import { registerUserService } from "../services/userService.js";
import { loginSchema } from "../schemas/userSchema.js";
import { loginUserService } from "../services/userService.js";
import { updateProfileSchema } from "../schemas/userSchema.js";
import { updateUserService } from "../services/userService.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import prisma from "../utils/prisma.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = registerSchema.parse(req.body);

    const newUser = await registerUserService(parsedData);

    res.status(201).json({
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }

    if (error.message === "EMAIL_ALREADY_EXISTS") {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const result = await loginUserService(parsedData);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }

    if (error.message === "INVALID_CREDENTIALS") {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const parsedData = updateProfileSchema.parse(req.body);
    const updatedUser = await updateUserService(userId, parsedData);

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: updatedUser });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
      return;
    }
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};
