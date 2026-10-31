import { Router } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { success, failure } from '../utils/apiResponse.js';
const router = Router();
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()], validate, async (req,res,next) => {
  try {
    const { rows } = await query('SELECT id, name, email, password_hash, role, is_active FROM staff WHERE email=$1', [req.body.email]);
    const staff = rows[0];
    if (!staff || !staff.is_active || !(await bcrypt.compare(req.body.password, staff.password_hash))) return failure(res, 'Invalid email or password', 401);
    const token = jwt.sign({ sub: staff.id, role: staff.role, email: staff.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
    return success(res, 'Login successful', { token, tokenType: 'Bearer', expiresIn: process.env.JWT_EXPIRES_IN || '8h', user: { id: staff.id, name: staff.name, email: staff.email, role: staff.role } });
  } catch(e) { next(e); }
});
router.get('/me', authenticate, async (req,res,next) => {
  try { const { rows } = await query('SELECT id,name,email,role,is_active,created_at FROM staff WHERE id=$1',[req.user.sub]); if(!rows[0]) return failure(res,'User not found',404); return success(res,'Current user retrieved',rows[0]); } catch(e){next(e);}
});
export default router;
