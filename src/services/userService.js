import {
  findUserById,
  findUserBySlug,
  updateUserThemeById,
  updateUserThemeBySlug,
} from '../models/userModel.js';

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeTheme = (selectedTheme) => selectedTheme.trim();
const normalizeSlug = (slug) => slug.trim();

const mapUserRecord = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  profileId: user.profileId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  profile: {
    id: user.profileId,
    slug: user.slug,
    title: user.title,
    isActive: Boolean(user.isActive),
    selected_theme: user.selected_theme,
  },
});

const resolveUser = async ({ userId, slug, profileId }) => {
  if (Number.isInteger(userId) && userId > 0) {
    return findUserById(userId);
  }

  if (Number.isInteger(profileId) && profileId > 0) {
    return findUserById(profileId);
  }

  if (slug && slug.trim()) {
    return findUserBySlug(normalizeSlug(slug));
  }

  return null;
};

export const updateUserTheme = async ({ userId, profileId, slug, selectedTheme }) => {
  const existingUser = await resolveUser({ userId, profileId, slug });

  if (!existingUser) {
    throw createHttpError('User not found', 404);
  }

  if (slug && slug.trim()) {
    await updateUserThemeBySlug(normalizeSlug(slug), normalizeTheme(selectedTheme));
  } else {
    await updateUserThemeById(existingUser.id, normalizeTheme(selectedTheme));
  }

  const updatedUser = slug && slug.trim()
    ? await findUserBySlug(normalizeSlug(slug))
    : await findUserById(existingUser.id);

  return mapUserRecord(updatedUser);
};

export const getUserProfileById = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw createHttpError('User not found', 404);
  }

  return mapUserRecord(user);
};
