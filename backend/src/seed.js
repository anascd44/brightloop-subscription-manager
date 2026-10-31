require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db');
(async () => {
  try {
    const name = process.env.ADMIN_NAME || 'Brightloop Admin';
    const email = (process.env.ADMIN_EMAIL || 'admin@brightloop.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!password || password.length < 9 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) throw new Error('Set ADMIN_PASSWORD in .env (9+ chars, upper/lowercase and special character)');
    const hash = await bcrypt.hash(password, 12);
    await db.query(`INSERT INTO users(name,email,password_hash,role_id) VALUES($1,$2,$3,(SELECT id FROM roles WHERE name='ADMIN')) ON CONFLICT(email) DO NOTHING`, [name,email,hash]);
    console.log(`Admin seed checked for ${email}. If it already existed, its password was not changed.`);
  } catch (e) { console.error(e.message); process.exitCode=1; }
  finally { await db.pool.end(); }
})();
