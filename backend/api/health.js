const { Pool } = require('pg');

module.exports = async (req, res) => {
  // Get DATABASE_URL directly - Vercel env vars are already decoded
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return res.status(500).json({
      success: false,
      message: 'DATABASE_URL not configured',
      timestamp: new Date().toISOString()
    });
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 5000
  });

  try {
    await pool.query('SELECT 1');
    await pool.end();
    return res.json({
      success: true,
      message: 'Kiswa Essentials API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    try { await pool.end(); } catch (e) {}
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
