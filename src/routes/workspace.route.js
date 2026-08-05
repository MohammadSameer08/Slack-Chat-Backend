import { Router } from "express";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  //   updateWorkspace,
  //   deleteWorkspace,
} from "../controllers/workspace.controller.js";
import validateUser from "../middleware/auth.middleware.js";
const router = Router();

router.post("/", validateUser, createWorkspace);
router.get("/", validateUser, getWorkspaces);
router.get("/:id", validateUser, getWorkspaceById);
// router.put("/:id", validateUser, updateWorkspace);
// router.delete("/:id", validateUser, deleteWorkspace);

export default router;
