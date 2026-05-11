const { pool } = require('../config/db');

const Coupon = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) DEFAULT 0,
        max_discount DECIMAL(10,2),
        usage_limit INTEGER,
        usage_count INTEGER DEFAULT 0,
        valid_from TIMESTAMP,
        valid_until TIMESTAMP,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);

    const orderCouponsQuery = `
      CREATE TABLE IF NOT EXISTS order_coupons (
        order_id INTEGER REFERENCES orders(id),
        coupon_id INTEGER REFERENCES coupons(id),
        PRIMARY KEY (order_id, coupon_id)
      )
    `;
    await pool.query(orderCouponsQuery);
  },

  async create({ code, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, validFrom, validUntil }) {
    const query = `
      INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, valid_from, valid_until)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount || 0,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findByCode(code) {
    const query = 'SELECT * FROM coupons WHERE UPPER(code) = $1';
    const result = await pool.query(query, [code.toUpperCase()]);
    return result.rows[0];
  },

  async findById(id) {
    const query = 'SELECT * FROM coupons WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findAll() {
    const query = 'SELECT * FROM coupons ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  async incrementUsage(id) {
    const query = 'UPDATE coupons SET usage_count = usage_count + 1 WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async linkToOrder(orderId, couponId) {
    const query = 'INSERT INTO order_coupons (order_id, coupon_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
    await pool.query(query, [orderId, couponId]);
  }
};

module.exports = Coupon;
