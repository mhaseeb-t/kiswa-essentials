const { pool } = require('../config/db');

const Order = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(20) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        items JSONB NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'PENDING',
        shipping_full_name VARCHAR(100),
        shipping_email VARCHAR(255),
        shipping_phone VARCHAR(50),
        shipping_line1 VARCHAR(255),
        shipping_line2 VARCHAR(255),
        shipping_city VARCHAR(100),
        shipping_postcode VARCHAR(20),
        shipping_country VARCHAR(50),
        tracking_number VARCHAR(100),
        courier VARCHAR(100),
        payment_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  generateOrderId() {
    return 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  },

  async create({ user_id, items, total, shippingAddress, paymentId, couponId }) {
    const orderId = this.generateOrderId();
    const query = `
      INSERT INTO orders (order_id, user_id, items, total, status,
        shipping_full_name, shipping_email, shipping_phone, shipping_line1, shipping_line2,
        shipping_city, shipping_postcode, shipping_country, payment_id)
      VALUES ($1, $2, $3, $4, 'PENDING', $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      orderId, user_id, JSON.stringify(items), total,
      shippingAddress.fullName, shippingAddress.email, shippingAddress.phone,
      shippingAddress.line1, shippingAddress.line2, shippingAddress.city,
      shippingAddress.postcode, shippingAddress.country, paymentId
    ];
    const result = await pool.query(query, values);

    if (couponId) {
      const Coupon = require('./Coupon');
      await Coupon.linkToOrder(result.rows[0].id, couponId);
      await Coupon.incrementUsage(couponId);
    }

    return result.rows[0];
  },

  async findByUserId(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT o.*, u.name as user_name, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findByOrderId(orderId) {
    const query = 'SELECT * FROM orders WHERE order_id = $1';
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  },

  async findAll(filters = {}) {
    let query = 'SELECT o.*, u.name as user_name, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      query += ` AND o.status = $${paramCount}`;
      values.push(filters.status);
      paramCount++;
    }

    query += ' ORDER BY o.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  async updateStatus(id, { status, trackingNumber, courier }) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      fields.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (trackingNumber) {
      fields.push(`tracking_number = $${paramCount}`);
      values.push(trackingNumber);
      paramCount++;
    }

    if (courier) {
      fields.push(`courier = $${paramCount}`);
      values.push(courier);
      paramCount++;
    }

    if (fields.length === 0) return null;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getStats() {
    const query = `
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total), 0) as total_revenue
      FROM orders
    `;
    const result = await pool.query(query);
    return result.rows[0];
  },

  async getRecent(limit = 10) {
    const query = 'SELECT o.*, u.name as user_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT $1';
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
};

module.exports = Order;