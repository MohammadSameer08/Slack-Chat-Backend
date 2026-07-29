import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import validateUser from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshToken);
router.route("/me").get(validateUser, getCurrentUser);
router.route("/logout").post(validateUser, logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

export default router;
