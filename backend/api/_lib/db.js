const { Pool } = require('pg');

let pool = null;

const getPool = () => {
  if (!pool && process.env.DATABASE_URL) {
    const isLocal = process.env.DATABASE_URL.includes('localhost');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
};

const query = async (text, params) => {
  const p = getPool();
  if (!p) throw new Error('Database pool not initialized');
  return p.query(text, params);
};

const initDB = async () => {
  try {
    const p = getPool();
    if (!p) return;

    await p.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'CUSTOMER',
        phone VARCHAR(50),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        postcode VARCHAR(20),
        country VARCHAR(50) DEFAULT 'UK',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('DB init error:', error);
  }
};

module.exports = { getPool, query, initDB };
