const { query } = require('../_lib/db');
const { initDB } = require('../_lib/seed');

// GET /api/categories
module.exports = async (req, res) => {
  await initDB();

  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};