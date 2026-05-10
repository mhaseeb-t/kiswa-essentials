const { query } = require('../_lib/db');
const jwt = require('jsonwebtoken');

// POST /api/orders
module.exports = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { items, shippingAddress, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderId = 'ORD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const result = await query(
      `INSERT INTO orders (order_id, user_id, items, total, status, shipping_full_name, shipping_email, shipping_phone, shipping_line1, shipping_line2, shipping_city, shipping_postcode, shipping_country, payment_id)
       VALUES ($1, $2, $3, $4, 'PENDING', $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        orderId, decoded.id, JSON.stringify(items), total,
        shippingAddress.fullName, shippingAddress.email, shippingAddress.phone,
        shippingAddress.line1, shippingAddress.line2, shippingAddress.city,
        shippingAddress.postcode, shippingAddress.country, paymentId
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};