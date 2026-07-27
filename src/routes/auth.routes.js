import { Router } from "express";
import {
  register,
  login,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshToken);

export default router;
