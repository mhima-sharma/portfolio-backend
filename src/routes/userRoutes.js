import express from 'express';
import * as userController from '../controllers/userController.js';
import {
  validateGetUserProfile,
  validateUpdateUserTheme,
  handleValidationErrors,
} from '../validators/userValidators.js';

const router = express.Router();

router.put('/user/theme', validateUpdateUserTheme, handleValidationErrors, userController.updateTheme);
router.get('/user/:id', validateGetUserProfile, handleValidationErrors, userController.getUserProfile);

export default router;
