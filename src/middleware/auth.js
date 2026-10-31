import jwt from 'jsonwebtoken';
import { failure } from '../utils/apiResponse.js';
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return failure(res, 'Authentication required', 401);
  try { req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET); next(); }
  catch { return failure(res, 'Invalid or expired token', 401); }
}
export const authorize = (...roles) => (req, res, next) => roles.includes(req.user?.role) ? next() : failure(res, 'You do not have permission to perform this action', 403);
