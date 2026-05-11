// Search products endpoint for autocomplete and full search
const { Pool } = require('pg');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 10000,
  });

  try {
    const { q, limit = 10, type = 'autocomplete', region = 'UK' } = req.query;

    if (!q || q.trim().length < 2) {
      res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
      await pool.end();
      return;
    }

    const searchTerm = `%${q.trim()}%`;
    const searchLimit = Math.min(parseInt(limit) || 10, 20);

    let sql;
    let params;

    if (type === 'full') {
      // Full search - returns more details for search results page
      sql = `
        SELECT p.id, p.name, p.slug, p.price, p.images, p.category_name,
               p.description, p.stock_quantity, p.is_active
        FROM (
          SELECT p.*, c.name as category_name
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.is_active = true
          AND (p.name ILIKE $1 OR p.description ILIKE $1 OR c.name ILIKE $1)
        ) p
        ORDER BY
          CASE WHEN p.name ILIKE $2 THEN 0 ELSE 1 END,
          p.created_at DESC
        LIMIT $3
      `;
      params = [searchTerm, `${q.trim()}%`, searchLimit];
    } else {
      // Autocomplete - returns minimal data for dropdown
      sql = `
        SELECT p.id, p.name, p.slug, p.price, p.images, p.category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
        AND (p.name ILIKE $1 OR p.description ILIKE $1)
        ORDER BY
          CASE WHEN p.name ILIKE $2 THEN 0 ELSE 1 END,
          p.name ASC
        LIMIT $3
      `;
      params = [searchTerm, `${q.trim()}%`, searchLimit];
    }

    const result = await pool.query(sql, params);

    const products = result.rows.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.region_prices?.[region] || p.price,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
      category_name: p.category_name,
      description: type === 'full' ? p.description : undefined,
      stock_quantity: type === 'full' ? p.stock_quantity : undefined,
    }));

    res.json({ success: true, products, total: products.length, query: q });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
};