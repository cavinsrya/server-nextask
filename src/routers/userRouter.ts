import { Router } from "express";
import {
  register,
  login,
  updateProfile,
  logout,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { getMe } from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateProfile);
router.post("/logout", logout);

export default router;
