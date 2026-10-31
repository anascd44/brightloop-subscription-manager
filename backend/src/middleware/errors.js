function notFound(req, res) { res.status(404).json({ success: false, message: 'API route not found' }); }
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === '23505') return res.status(409).json({ success: false, message: 'A record with this value already exists' });
  if (err.code === '23503') return res.status(400).json({ success: false, message: 'Related record does not exist or is in use' });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
}
module.exports = { notFound, errorHandler };
