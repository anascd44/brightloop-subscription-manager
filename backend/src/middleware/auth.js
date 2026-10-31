const jwt = require('jsonwebtoken');
const db = require('../config/db');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication token required' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query(`SELECT u.id,u.name,u.email,u.is_active,r.name AS role
      FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=$1`, [decoded.sub]);
    if (!result.rows[0] || !result.rows[0].is_active) return res.status(401).json({ success: false, message: 'Account unavailable' });
    req.user = result.rows[0];
    next();
  } catch (err) { return res.status(401).json({ success: false, message: 'Invalid or expired token' }); }
}

function allowRoles(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next() : res.status(403).json({ success: false, message: 'Insufficient role permissions' });
}

function requirePermission(code) {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'ADMIN') return next();
      const result = await db.query(`SELECT 1 FROM user_permissions up JOIN permissions p ON p.id=up.permission_id WHERE up.user_id=$1 AND p.code=$2
        UNION SELECT 1 FROM users u JOIN role_permissions rp ON rp.role_id=u.role_id JOIN permissions p ON p.id=rp.permission_id WHERE u.id=$1 AND p.code=$2`, [req.user.id, code]);
      if (result.rowCount) return next();
      return res.status(403).json({ success: false, message: `Missing permission: ${code}` });
    } catch (err) { next(err); }
  };
}
module.exports = { authenticate, allowRoles, requirePermission };
