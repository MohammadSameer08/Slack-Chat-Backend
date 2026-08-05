import * as workspaceService from "../services/workspace.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  const workspace = await workspaceService.createWorkspace(userId, {
    name,
    description,
  });

  res.status(201).json({
    success: true,
    message: "Workspace created successfully",
    data: workspace,
  });
});

export const getWorkspaces = asyncHandler(async (req, res) => {
  // Implementation here
  const userId = req.user.id;
  const workspaces = await workspaceService.getWorkspaces(userId);
  res.status(200).json({
    success: true,
    message: "Workspaces retrieved successfully",
    data: workspaces,
  });
});

export const getWorkspaceById = asyncHandler(async (req, res) => {
  // Implementation here
  const workspaceId = req.params.id;
  const userId = req.user.id;
  const workspace = await workspaceService.getWorkspaceById(workspaceId, userId);
  res.status(200).json({
    success: true,
    message: "Workspace retrieved successfully",
    data: workspace,
  });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  // Implementation here
  res.status(200).json({
    success: true,
    message: "Workspace updated successfully",
    data: null,
  });
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
  // Implementation here
  res.status(200).json({
    success: true,
    message: "Workspace deleted successfully",
  });
});
