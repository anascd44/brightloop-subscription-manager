import { validationResult } from 'express-validator';
import { failure } from '../utils/apiResponse.js';
export function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) return failure(res, 'Validation failed', 422, result.array().map(({ path, msg }) => ({ field: path, message: msg })));
  next();
}
