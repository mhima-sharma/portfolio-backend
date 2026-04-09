import { successResponse } from '../utils/response.js';
import { getUserProfileById, updateUserTheme } from '../services/userService.js';

export const updateTheme = async (req, res, next) => {
  try {
    const { userId, profileId, slug, selectedTheme } = req.body;
    const updatedUser = await updateUserTheme({ userId, profileId, slug, selectedTheme });

    return successResponse(res, 'User theme updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileById(Number(req.params.id));

    return successResponse(res, 'User profile retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};
