import { failure } from '../utils/apiResponse.js';
export function notFound(req, res) { return failure(res, `Route not found: ${req.method} ${req.originalUrl}`, 404); }
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === '23505') return failure(res, 'A record with this value already exists', 409);
  if (err.code === '23503') return failure(res, 'Referenced record does not exist or is still in use', 400);
  if (err.code === '23514' || err.code === '22P02') return failure(res, 'Invalid data supplied', 400);
  return failure(res, process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Internal server error'), err.status || 500);
}
