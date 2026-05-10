const { pool } = require('../config/db');

const Category = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        image VARCHAR(500),
        region_prices JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  async create({ id, name, description, image, region_prices }) {
    const query = `
      INSERT INTO categories (id, name, description, image, region_prices)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await pool.query(query, [id, name, description, image, JSON.stringify(region_prices || {})]);
    return result.rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM categories ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByName(name) {
    const query = 'SELECT * FROM categories WHERE LOWER(name) = LOWER($1)';
    const result = await pool.query(query, [name]);
    return result.rows[0];
  },

  async update(id, { name, description, image, region_prices }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    if (description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (image !== undefined) {
      fields.push(`image = $${paramCount}`);
      values.push(image);
      paramCount++;
    }
    if (region_prices !== undefined) {
      fields.push(`region_prices = $${paramCount}`);
      values.push(JSON.stringify(region_prices));
      paramCount++;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async getCount() {
    const query = 'SELECT COUNT(*) as count FROM categories';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
};

module.exports = Category;