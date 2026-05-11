const { pool } = require('../config/db');

const Wishlist = {
  tableName: 'wishlists',

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS wishlists (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
        product_id VARCHAR(50) REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `;
    await pool.query(query);
  },

  async add(userId, productId) {
    const query = `
      INSERT INTO wishlists (user_id, product_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING *
    `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows[0];
  },

  async remove(userId, productId) {
    const query = `
      DELETE FROM wishlists
      WHERE user_id = $1 AND product_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows[0];
  },

  async getByUser(userId) {
    const query = `
      SELECT w.id, w.product_id, w.created_at,
             p.name, p.price, p.original_price, p.image, p.images,
             p.stock, p.category_id, p.featured
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async exists(userId, productId) {
    const query = `
      SELECT id FROM wishlists
      WHERE user_id = $1 AND product_id = $2
    `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows.length > 0;
  }
};

module.exports = Wishlist;
