import { verifyToken } from '../utils/authUtils.js';
import { errorResponse } from '../utils/response.js';
import prisma from '../config/database.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return errorResponse(res, 'No token provided', [], 401);
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return errorResponse(res, 'Invalid or expired token', [], 401);
    }

    const adminId = Number(decoded.id ?? decoded.adminId ?? decoded.sub);

    if (!Number.isInteger(adminId) || adminId <= 0) {
      return errorResponse(res, 'Invalid token payload', [], 401);
    }

    // Verify admin exists in database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      include: { profile: true },
    });

    if (!admin) {
      return errorResponse(res, 'Admin not found', [], 401);
    }

    req.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      profileId: admin.profileId,
      profile: admin.profile,
    };
    next();
  } catch (error) {
    next(error);
  }
};
