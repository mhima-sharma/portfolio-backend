import { successResponse, errorResponse } from '../utils/response.js';
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from '../services/skillService.js';
import prisma from '../config/database.js';

export const create = async (req, res, next) => {
  try {
    const skill = await createSkill(req.admin.profileId, req.body);
    return successResponse(res, 'Skill created successfully', skill, 201);
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

    const skills = await getAllSkills(profileId);
    return successResponse(res, 'Skills retrieved successfully', skills);
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

    const skill = await getSkillById(parseInt(req.params.id), profileId);

    if (!skill) {
      return errorResponse(res, 'Skill not found', [], 404);
    }

    return successResponse(res, 'Skill retrieved successfully', skill);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const result = await updateSkill(parseInt(req.params.id), req.admin.profileId, req.body);
    if (result.count === 0) {
      return errorResponse(res, 'Skill not found or not authorized', [], 404);
    }
    return successResponse(res, 'Skill updated successfully', result);
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Skill not found', [], 404);
    }
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await deleteSkill(parseInt(req.params.id), req.admin.profileId);
    if (result.count === 0) {
      return errorResponse(res, 'Skill not found or not authorized', [], 404);
    }
    return successResponse(res, 'Skill deleted successfully', null);
  } catch (error) {
    if (error.code === 'P2025') {
      return errorResponse(res, 'Skill not found', [], 404);
    }
    next(error);
  }
};
