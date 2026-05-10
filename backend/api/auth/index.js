const { query } = require('../_lib/db');
const { initDB } = require('../_lib/seed');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
// GET /api/auth/login
const handler = async (req, res) => {
  await initDB();

  const { method } = req;

  try {
    if (method === 'POST') {
      // Register
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Name, email and password required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }

      const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows[0]) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = 'user-' + Date.now();
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

      await query(
        `INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, 'CUSTOMER')`,
        [userId, name, email, hashedPassword]
      );

      res.status(201).json({
        success: true,
        token,
        user: { id: userId, name, email, role: 'CUSTOMER' }
      });
    } else if (method === 'GET') {
      // Login
      const { email, password } = req.query;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }

      const result = await query('SELECT * FROM users WHERE email = $1', [email]);

      if (!result.rows[0]) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = handler;