const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });
    const result = await db.query(`SELECT u.*,r.name AS role FROM users u JOIN roles r ON r.id=u.role_id WHERE LOWER(u.email)=LOWER($1)`, [email.trim()]);
    const user = result.rows[0];
    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } } });
  } catch (err) { next(err); }
});
router.get('/me', authenticate, (req, res) => res.json({ success: true, data: req.user }));
module.exports = router;
