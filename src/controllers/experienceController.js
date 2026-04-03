import { successResponse, errorResponse } from '../utils/response.js';
import {
  createExperience,
  getAllExperience,
  getExperienceById,
  updateExperience,
  deleteExperience,
} from '../services/experienceService.js';
import prisma from '../config/database.js';

export const create = async (req, res, next) => {
  try {
    const experience = await createExperience(req.admin.profileId, req.body);
    return successResponse(res, 'Experience created successfully', experience, 201);
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

    const experience = await getAllExperience(profileId);
    return successResponse(res, 'Experience retrieved successfully', experience);
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

    const experience = await getExperienceById(parseInt(req.params.id), profileId);

    if (!experience) {
      return errorResponse(res, 'Experience not found', [], 404);
    }

    return successResponse(res, 'Experience retrieved successfully', experience);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await updateExperience(parseInt(req.params.id), req.admin.profileId, req.body);
    if (result.count === 0) {
      return errorResponse(res, 'Experience not found or not authorized', [], 404);
    }
    return successResponse(res, 'Experience updated successfully', result);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteExperience(parseInt(req.params.id), req.admin.profileId);
    if (result.count === 0) {
      return errorResponse(res, 'Experience not found or not authorized', [], 404);
    }
    return successResponse(res, 'Experience deleted successfully', null);
  } catch (error) {
    next(error);
  }
};