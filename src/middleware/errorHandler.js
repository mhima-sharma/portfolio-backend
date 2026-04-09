import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === 'CONFIG_ERROR') {
    return errorResponse(
      res,
      'Server configuration error. Please verify required environment variables.',
      [],
      500
    );
  }

  if (err.statusCode) {
    return errorResponse(res, err.message, err.errors || [], err.statusCode);
  }

  // Prisma database connection error
  if (err.code === 'P1001') {
    return errorResponse(
      res,
      'Database connection failed. Please try again in a moment.',
      [],
      503
    );
  }

  // Prisma unique constraint error
  if (err.code === 'P2002') {
    return errorResponse(
      res,
      `${err.meta?.target?.[0] || 'Field'} already exists`,
      [],
      400
    );
  }

  // Prisma not found error
  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found', [], 404);
  }

  // Validation errors
  if (err.status === 400 && err.array) {
    return errorResponse(res, 'Validation failed', err.array(), 400);
  }

  if (err.message === 'Admin account is misconfigured') {
    return errorResponse(
      res,
      'Admin account configuration is incomplete. Please verify the stored password hash.',
      [],
      500
    );
  }

  if (['ECONNREFUSED', 'ENOTFOUND', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR'].includes(err.code)) {
    return errorResponse(
      res,
      'Database connection failed. Please verify your MySQL configuration.',
      [],
      503
    );
  }

  return errorResponse(res, 'Internal server error', [], 500);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, 'Route not found', [], 404);
};
