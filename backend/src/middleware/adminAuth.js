const crypto = require('crypto');

const SECRET = process.env.ADMIN_AUTH_SECRET || 'd2c-mall-admin-secret';

const createToken = (email) => {
  const timestamp = Date.now().toString();
  const payload = `${email}:${timestamp}`;

  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('hex');

  return Buffer.from(`${payload}:${signature}`).toString('base64url');
};

const verifyToken = (token) => {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const [email, timestamp, signature] = decoded.split(':');

    if (!email || !timestamp || !signature) return null;

    const payload = `${email}:${timestamp}`;

    const expected = crypto
      .createHmac('sha256', SECRET)
      .update(payload)
      .digest('hex');

    if (signature.length !== expected.length) return null;

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expected)
      )
    ) {
      return null;
    }

    if (Date.now() - Number(timestamp) > 8 * 60 * 60 * 1000) {
      return null;
    }

    return { email };
  } catch {
    return null;
  }
};

const adminAuth = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const admin = verifyToken(header.slice(7));

  if (!admin) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired admin session'
    });
  }

  req.admin = admin;
  next();
};

module.exports = {
  createToken,
  verifyToken,
  adminAuth
};