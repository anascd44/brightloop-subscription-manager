require('dotenv').config();
const app = require('./app');
const { pool } = require('./config/db');
const port = process.env.PORT || 5000;
if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('Missing DATABASE_URL or JWT_SECRET in backend/.env');
  process.exit(1);
}
const server = app.listen(port, () => console.log(`Brightloop API listening on http://localhost:${port}`));
async function shutdown() { server.close(async () => { await pool.end(); process.exit(0); }); }
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
