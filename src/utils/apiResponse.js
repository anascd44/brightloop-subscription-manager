export const success = (res, message, data = null, status = 200, meta) => res.status(status).json({ success: true, message, data, ...(meta ? { meta } : {}) });
export const failure = (res, message, status = 400, errors) => res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
