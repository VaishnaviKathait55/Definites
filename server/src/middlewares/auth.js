import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication token is required.', 'AUTH_REQUIRED');
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new ApiError(401, 'User session is no longer valid.', 'SESSION_INVALID');
    }

    req.auth = { token, user };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, 'Authentication token is invalid or expired.', 'TOKEN_INVALID');
  }
});

export function requireRole(...roles) {
  return function enforceRole(req, _res, next) {
    if (!req.auth?.user || !roles.includes(req.auth.user.role)) {
      return next(new ApiError(403, 'You do not have access to this resource.', 'FORBIDDEN'));
    }

    next();
  };
}
