const { Pool } = require('pg');

module.exports = async (req, res) => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    return res.status(500).json({
      success: false,
      message: 'DATABASE_URL not configured',
      timestamp: new Date().toISOString()
    });
  }

  const isLocal = dbUrl.includes('localhost');
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: isLocal ? false : { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 10000,
  });

  try {
    const result = await pool.query('SELECT 1 as connected, now() as server_time');
    await pool.end();
    return res.json({
      success: true,
      message: 'Kiswa Essentials API is running',
      database: 'connected',
      mode: isLocal ? 'local' : 'production',
      serverTime: result.rows[0].server_time,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    try { await pool.end(); } catch (e) {}
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
};
