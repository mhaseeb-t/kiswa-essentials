const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  tableName: 'users',

  async createTable() {
    const query = `
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
    `;
    await pool.query(query);
  },

  async create({ name, email, password, role = 'CUSTOMER', phone, address_line1, address_line2, city, postcode, country = 'UK' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (name, email, password, role, phone, address_line1, address_line2, city, postcode, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, name, email, role, phone, address_line1, address_line2, city, postcode, country, created_at
    `;
    const values = [name, email, hashedPassword, role, phone, address_line1, address_line2, city, postcode, country];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT id, name, email, role, phone, address_line1, address_line2, city, postcode, country, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'email', 'phone', 'address_line1', 'address_line2', 'city', 'postcode', 'country'];

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = $${paramCount}`);
        values.push(data[field]);
        paramCount++;
      }
    }

    if (fields.length === 0) return null;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, phone, address_line1, address_line2, city, postcode, country, created_at`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async matchPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async getAll() {
    const query = 'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  async getCustomerOrderCount(userId) {
    const query = 'SELECT COUNT(*) as count FROM orders WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  },

  async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`;
    await pool.query(query, [hashedPassword, id]);
  }
};

module.exports = User;