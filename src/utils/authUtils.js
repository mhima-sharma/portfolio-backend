import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getRequiredEnv } from '../config/env.js';

export const generateToken = (adminId, profileId) => {
  const jwtSecret = getRequiredEnv('JWT_SECRET');

  return jwt.sign(
    { id: adminId, profileId },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    const jwtSecret = getRequiredEnv('JWT_SECRET');

    return jwt.verify(token, jwtSecret);
  } catch (error) {
    if (error.code === 'CONFIG_ERROR') {
      throw error;
    }

    return null;
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};
