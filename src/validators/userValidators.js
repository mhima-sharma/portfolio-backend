import { body, param, validationResult } from 'express-validator';

export const validateUpdateUserTheme = [
  body().custom((value) => {
    const hasUserId = Number.isInteger(Number(value.userId)) && Number(value.userId) > 0;
    const hasProfileId = Number.isInteger(Number(value.profileId)) && Number(value.profileId) > 0;
    const hasSlug = typeof value.slug === 'string' && value.slug.trim().length > 0;

    if (!hasUserId && !hasProfileId && !hasSlug) {
      throw new Error('Provide userId, profileId, or slug');
    }

    return true;
  }),
  body('userId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('userId must be a positive integer')
    .toInt(),
  body('profileId')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('profileId must be a positive integer')
    .toInt(),
  body('slug')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('slug cannot be empty'),
  body('selectedTheme')
    .trim()
    .notEmpty()
    .withMessage('selectedTheme is required')
    .isLength({ max: 100 })
    .withMessage('selectedTheme must be at most 100 characters'),
];

export const validateGetUserProfile = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('id must be a positive integer')
    .toInt(),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  return next();
};
