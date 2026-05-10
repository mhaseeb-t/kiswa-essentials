const { query } = require('../_lib/db');
const { initDB } = require('../_lib/seed');

// GET /api/products
module.exports = async (req, res) => {
  await initDB();

  try {
    const { category_id, minPrice, maxPrice, search, sort, featured, region = 'UK' } = req.query;

    let sql = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = true`;
    const params = [];
    let paramCount = 1;

    if (category_id) {
      sql += ` AND p.category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (minPrice) {
      sql += ` AND p.price >= $${paramCount}`;
      params.push(parseFloat(minPrice));
      paramCount++;
    }

    if (maxPrice) {
      sql += ` AND p.price <= $${paramCount}`;
      params.push(parseFloat(maxPrice));
      paramCount++;
    }

    if (search) {
      sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (featured === 'true') {
      sql += ` AND p.featured = true`;
    }

    if (sort === 'price-low') sql += ` ORDER BY p.price ASC`;
    else if (sort === 'price-high') sql += ` ORDER BY p.price DESC`;
    else sql += ` ORDER BY p.created_at DESC`;

    const result = await query(sql, params);

    const products = result.rows.map(p => ({
      ...p,
      price: p.region_prices?.[region] || p.price,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || []
    }));

    res.json({ success: true, products, total: products.length });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};