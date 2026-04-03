import { successResponse, errorResponse } from '../utils/response.js';
import {
  getPortfolioData,
  getAbout,
  updateAbout,
  getContact,
  updateContact,
} from '../services/portfolioService.js';

// import { successResponse, errorResponse } from '../utils/response.js';
// import {
//   getPortfolioData,
//   getAbout,
//   updateAbout,
//   getContact,
//   updateContact,
// } from '../services/portfolioService.js';
import prisma from '../config/database.js';

export const getPortfolio = async (req, res, next) => {
  try {
    let profileId;

    if (req.params.slug) {
      // Find profile by slug
      const profile = await prisma.profile.findUnique({
        where: { slug: req.params.slug, isActive: true },
      });

      if (!profile) {
        return errorResponse(res, 'Profile not found', [], 404);
      }

      profileId = profile.id;
    } else {
      // Default portfolio - find the first active profile or one with slug 'default'
      const profile = await prisma.profile.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });

      if (!profile) {
        return errorResponse(res, 'No active profiles found', [], 404);
      }

      profileId = profile.id;
    }

    const data = await getPortfolioData(profileId);

    if (req.params.slug) {
      // For slug-specific, include profile info
      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        select: { id: true, name: true, slug: true, title: true },
      });

      return successResponse(res, 'Portfolio data retrieved successfully', {
        profile,
        ...data,
      });
    } else {
      return successResponse(res, 'Portfolio data retrieved successfully', data);
    }
  } catch (error) {
    next(error);
  }
};

export const getAboutData = async (req, res, next) => {
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
      // For backward compatibility, use default
      const profile = await prisma.profile.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
      if (!profile) {
        return errorResponse(res, 'No active profiles found', [], 404);
      }
      profileId = profile.id;
    }

    const data = await getAbout(profileId);
    return successResponse(res, 'About data retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updateAboutData = async (req, res, next) => {
  try {
    const data = await updateAbout(req.admin.profileId, req.body);
    return successResponse(res, 'About data updated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getContactData = async (req, res, next) => {
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

    const data = await getContact(profileId);
    return successResponse(res, 'Contact data retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updateContactData = async (req, res, next) => {
  try {
    const data = await updateContact(req.admin.profileId, req.body);
    return successResponse(res, 'Contact data updated successfully', data);
  } catch (error) {
    next(error);
  }
};
