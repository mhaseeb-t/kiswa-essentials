const { query } = require('../_lib/db');

// GET /api/health
module.exports = async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({
      success: true,
      message: 'Kiswa Essentials API is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
};