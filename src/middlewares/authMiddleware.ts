import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Access Denied. No token provided." });
    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET || "fallback_secret_key";

    const decoded = jwt.verify(token, secretKey) as {
      id: string;
      email: string;
    };

    req.user = decoded;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token." });
  }
};
