const { query } = require('../_lib/db');
const jwt = require('jsonwebtoken');

// GET /api/orders/my (protected)
module.exports = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [decoded.id]);

    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};