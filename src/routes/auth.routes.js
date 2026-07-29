import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  getCurrentUser,
  logout,
} from "../controllers/auth.controller.js";
import validateUser from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshToken);
router.route("/me").get(validateUser, getCurrentUser);
router.route("/logout").post(validateUser, logout);

export default router;
