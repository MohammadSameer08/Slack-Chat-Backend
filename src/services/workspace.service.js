import * as workspaceRepository from "../repositories/workspace.repository.js";
import { WORKSPACE_ROLES } from "../constants/workspace.constants.js";
import { NotFoundError, ForbiddenError } from "../error/error.js";

export const createWorkspace = async (userId, workspaceData) => {
  // Build the workspace object with business logic
  const workspace = {
    name: workspaceData.name,
    description: workspaceData.description || "",
    owner: userId,
    members: [
      {
        user: userId,
        role: WORKSPACE_ROLES.OWNER,
        joinedAt: new Date(),
      },
    ],
  };

  // Save to database via repository
  return await workspaceRepository.createWorkspace(workspace);
};

export const getWorkspaces = async (userId) => {
  // Fetch workspaces from the database via repository
  return await workspaceRepository.getWorkspacesByUserId(userId);
};

export const getWorkspaceById = async (workspaceId, userId) => {
  // Fetch workspace from repository
  const workspace = await workspaceRepository.getWorkspaceById(workspaceId);

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  // Check if user is a member of the workspace
  const isMember = workspace.members.some((member) =>
    member.user._id.equals(userId),
  );

  if (!isMember) {
    throw new ForbiddenError("Access denied");
  }

  return workspace;
};

export const updateWorkspace = async (workspaceId, userId, workspaceData) => {
  // Fetch the workspace
  const workspace = await workspaceRepository.getWorkspaceById(workspaceId);

  if (!workspace) {
    throw new NotFoundError("Workspace not found");
  }

  // Check if user is owner or admin
  const isOwner = workspace.owner._id.equals(userId);
  const userMember = workspace.members.find((member) =>
    member.user._id.equals(userId),
  );
  const isAdmin = userMember && userMember.role === WORKSPACE_ROLES.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Only owner and admin can update workspace");
  }

  // Update the workspace with the new data (handle partial updates)
  if (workspaceData.name !== undefined) {
    workspace.name = workspaceData.name;
  }

  if (workspaceData.description !== undefined) {
    workspace.description = workspaceData.description;
  }

  return await workspaceRepository.updateWorkspace(workspace);
};
