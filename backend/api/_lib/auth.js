const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB
    const { query } = require('./db');
    const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);

    if (!result.rows[0]) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

const staffMiddleware = (req, res, next) => {
  if (!['STAFF', 'ADMIN'].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Staff access required' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, staffMiddleware };