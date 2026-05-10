const { query } = require('../_lib/db');
const { initDB } = require('../_lib/seed');

// GET /api/products/[id]
module.exports = async (req, res) => {
  await initDB();

  try {
    const { id } = req.query;
    const region = req.query.region || 'UK';

    const result = await query(
      `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1 AND p.is_active = true`,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = result.rows[0];
    product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
    product.price = product.region_prices?.[region] || product.price;

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};