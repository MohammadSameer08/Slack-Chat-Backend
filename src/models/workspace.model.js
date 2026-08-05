import mongoose from "mongoose";
import { WORKSPACE_ROLES } from "../constants/workspace.constants.js";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: Object.values(WORKSPACE_ROLES),
          default: WORKSPACE_ROLES.MEMBER,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, versionKey: false },
);

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
