import { successResponse, errorResponse } from '../utils/response.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../services/projectService.js';
import prisma from '../config/database.js';

export const create = async (req, res, next) => {
  try {
    const project = await createProject(req.admin.profileId, req.body);
    return successResponse(res, 'Project created successfully', project, 201);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    let profileId;

    if (req.params.slug) {
      const profile = await prisma.profile.findUnique({
        where: { slug: req.params.slug, isActive: true },
      });
      if (!profile) {
        return errorResponse(res, 'Profile not found', [], 404);
      }
      profileId = profile.id;
    } else {
      const profile = await prisma.profile.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
      if (!profile) {
        return errorResponse(res, 'No active profiles found', [], 404);
      }
      profileId = profile.id;
    }

    const projects = await getAllProjects(profileId);
    return successResponse(res, 'Projects retrieved successfully', projects);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    let profileId;

    if (req.params.slug) {
      const profile = await prisma.profile.findUnique({
        where: { slug: req.params.slug, isActive: true },
      });
      if (!profile) {
        return errorResponse(res, 'Profile not found', [], 404);
      }
      profileId = profile.id;
    } else {
      const profile = await prisma.profile.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
      if (!profile) {
        return errorResponse(res, 'No active profiles found', [], 404);
      }
      profileId = profile.id;
    }

    const project = await getProjectById(parseInt(req.params.id), profileId);

    if (!project) {
      return errorResponse(res, 'Project not found', [], 404);
    }

    return successResponse(res, 'Project retrieved successfully', project);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const project = await updateProject(parseInt(req.params.id), req.admin.profileId, req.body);
    return successResponse(res, 'Project updated successfully', project);
  } catch (error) {
    if (error.message === 'Project not found') {
      return errorResponse(res, 'Project not found or not authorized', [], 404);
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteProject(parseInt(req.params.id), req.admin.profileId);
    if (result.count === 0) {
      return errorResponse(res, 'Project not found or not authorized', [], 404);
    }
    return successResponse(res, 'Project deleted successfully', null);
  } catch (error) {
    next(error);
  }
};