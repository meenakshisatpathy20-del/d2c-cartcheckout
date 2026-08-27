const { createToken } = require('../middleware/adminAuth');

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || 'admin@d2cmall.com';

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || 'D2CMall@2026';

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  if (
    email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      error: 'Invalid admin credentials'
    });
  }

  const token = createToken(ADMIN_EMAIL);

  res.json({
    success: true,
    token,
    admin: {
      email: ADMIN_EMAIL,
      name: 'D2C Mall Operations',
      role: 'WAREHOUSE_ADMIN'
    }
  });
};

const me = (req, res) => {
  res.json({
    success: true,
    admin: {
      email: req.admin.email,
      name: 'D2C Mall Operations',
      role: 'WAREHOUSE_ADMIN'
    }
  });
};

module.exports = {
  login,
  me
};