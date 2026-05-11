const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
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

  // Ensure users table exists
  const ensureUsersTable = async () => {
    await pool.query(`
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
  };

  try {
    await ensureUsersTable();

    const url = req.url || '';
    const { type, id, search, search_type, search_query, category_id, featured, sort, minPrice, maxPrice, color, size, in_stock, region = 'UK' } = req.query;

    // Filters endpoint - get available filter options
    if (url.includes('/filters')) {
      const [colorsResult, sizesResult, priceResult] = await Promise.all([
        pool.query('SELECT DISTINCT color FROM product_variants WHERE color IS NOT NULL AND color != \'\' ORDER BY color'),
        pool.query('SELECT DISTINCT size FROM product_variants WHERE size IS NOT NULL AND size != \'\' ORDER BY size'),
        pool.query('SELECT MIN(price) as min_price, MAX(price) as max_price FROM products WHERE is_active = true')
      ]);

      res.json({
        success: true,
        filters: {
          colors: colorsResult.rows.map(r => r.color),
          sizes: sizesResult.rows.map(r => r.size),
          priceRange: {
            min: priceResult.rows[0]?.min_price || 0,
            max: priceResult.rows[0]?.max_price || 1000
          }
        }
      });
      await pool.end();
      return;
    }

    // Categories endpoint
    if (url.includes('/cat') || type === 'categories') {
      const result = await pool.query('SELECT * FROM categories ORDER BY name');
      res.json({ success: true, categories: result.rows });
      await pool.end();
      return;
    }

    // Register endpoint
    if (type === 'register' || url.includes('/register')) {
      const { name, email, password } = req.body || {};

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Please provide name, email and password' });
        await pool.end();
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        await pool.end();
        return;
      }

      // Check if user exists
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows[0]) {
        res.status(400).json({ success: false, message: 'User already exists with this email' });
        await pool.end();
        return;
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const crypto = require('crypto');
      const userId = crypto.randomBytes(8).toString('hex');

      const result = await pool.query(
        `INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, 'CUSTOMER') RETURNING id, name, email, role`,
        [userId, name, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.status(201).json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
      await pool.end();
      return;
    }

    // Login endpoint
    if (type === 'login' || url.includes('/login')) {
      const { email, password } = req.body || {};
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password required' });
        await pool.end();
        return;
      }

      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (!result.rows[0]) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        await pool.end();
        return;
      }

      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        await pool.end();
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
      await pool.end();
      return;
    }

    // Single product by ID (url like /api/products/uuid) - but not /reviews
    const productIdMatch = url.match(/\/api\/products\/([^\/\?]+)/);
    if (productIdMatch && !url.includes('/reviews')) {
      const productId = productIdMatch[1];
      const result = await pool.query(
        'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1 AND p.is_active = true',
        [productId]
      );

      if (!result.rows[0]) {
        res.status(404).json({ success: false, message: 'Product not found' });
        await pool.end();
        return;
      }

      const product = result.rows[0];
      product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
      product.price = product.region_prices?.[region] || product.price;

      res.json({ success: true, data: product });
      await pool.end();
      return;
    }

    // Search endpoint
    if (search_query) {
      const searchTerm = `%${search_query.trim()}%`;
      const searchLimit = search_type === 'full' ? 20 : 10;
      const isFullSearch = search_type === 'full';

      let sql = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true
        AND (p.name ILIKE $1 OR p.description ILIKE $1 OR c.name ILIKE $1)
        ORDER BY
          CASE WHEN p.name ILIKE $2 THEN 0 ELSE 1 END,
          p.created_at DESC
        LIMIT $3
      `;
      const params = [searchTerm, `${search_query.trim()}%`, searchLimit];
      const result = await pool.query(sql, params);

      const products = result.rows.map(p => ({
        ...p,
        price: p.region_prices?.[region] || p.price,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
        category_name: p.category_name,
      }));

      res.json({ success: true, products, total: products.length, query: search_query });
      await pool.end();
      return;
    }

    // Analytics endpoints
    if (url.includes('/analytics/overview')) {
      const client = await pool.connect();
      try {
        const totalRevenue = await client.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'CANCELLED'");
        const totalOrders = await client.query('SELECT COUNT(*) as count FROM orders');
        const todayOrders = await client.query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURRENT_DATE");
        const todayRevenue = await client.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status != 'CANCELLED'");

        res.json({
          success: true,
          data: {
            total_revenue: parseFloat(totalRevenue.rows[0].total),
            total_orders: parseInt(totalOrders.rows[0].count),
            orders_today: parseInt(todayOrders.rows[0].count),
            revenue_today: parseFloat(todayRevenue.rows[0].total)
          }
        });
      } finally {
        client.release();
        await pool.end();
      }
      return;
    }

    if (url.includes('/analytics/recent-orders')) {
      const result = await pool.query(`
        SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC LIMIT 10
      `);
      res.json({ success: true, orders: result.rows });
      await pool.end();
      return;
    }

    if (url.includes('/analytics/top-products')) {
      const result = await pool.query(`
        SELECT p.id, p.name, p.images, SUM(oi.quantity) as total_sold, SUM(oi.price * oi.quantity) as revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.id, p.name, p.images
        ORDER BY total_sold DESC LIMIT 10
      `);
      const products = result.rows.map(p => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || []
      }));
      res.json({ success: true, products });
      await pool.end();
      return;
    }

    if (url.includes('/analytics/sales-chart')) {
      const result = await pool.query(`
        SELECT DATE(created_at) as date, COUNT(*) as orders, SUM(total) as revenue
        FROM orders
        WHERE created_at > NOW() - INTERVAL '30 days' AND status != 'CANCELLED'
        GROUP BY DATE(created_at)
        ORDER BY date
      `);
      res.json({ success: true, sales: result.rows });
      await pool.end();
      return;
    }

    // Products list (default)
    let sql = `SELECT p.*, c.name as category_name
               FROM products p
               LEFT JOIN categories c ON p.category_id = c.id
               WHERE p.is_active = true`;
    const params = [];
    let paramCount = 1;

    if (search) {
      sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    if (category_id) {
      sql += ` AND p.category_id = $${paramCount}`;
      params.push(category_id);
      paramCount++;
    }

    if (featured === 'true') {
      sql += ` AND p.featured = true`;
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

    if (color) {
      sql += ` AND p.id IN (SELECT product_id FROM product_variants WHERE LOWER(color) = LOWER($${paramCount}))`;
      params.push(color);
      paramCount++;
    }

    if (size) {
      sql += ` AND p.id IN (SELECT product_id FROM product_variants WHERE LOWER(size) = LOWER($${paramCount}))`;
      params.push(size);
      paramCount++;
    }

    if (in_stock === 'true') {
      sql += ` AND p.stock_quantity > 0`;
    }

    if (sort === 'price-low' || sort === 'price_asc') sql += ' ORDER BY p.price ASC';
    else if (sort === 'price-high' || sort === 'price_desc') sql += ' ORDER BY p.price DESC';
    else if (sort === 'name-asc' || sort === 'name_asc') sql += ' ORDER BY p.name ASC';
    else sql += ' ORDER BY p.created_at DESC';

    const result = await pool.query(sql, params);

    const products = result.rows.map(p => ({
      ...p,
      price: p.region_prices?.[region] || p.price,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || []
    }));

    res.json({ success: true, products, total: products.length });

    // ===== REVIEWS ENDPOINTS =====

    // Product reviews endpoint (GET/POST /api/products/:id/reviews)
    const reviewsMatch = url.match(/\/api\/products\/([^\/]+)\/reviews/);
    if (reviewsMatch) {
      const productId = reviewsMatch[1];

      if (req.method === 'GET') {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const reviewsResult = await pool.query(
          `SELECT r.*, u.name as user_name,
           EXISTS(SELECT 1 FROM orders o WHERE o.user_id = r.user_id AND o.product_ids::text LIKE '%' || $1 || '%' AND o.status = 'delivered') as has_verified_purchase
           FROM reviews r
           LEFT JOIN users u ON r.user_id = u.id
           WHERE r.product_id = $1
           ORDER BY r.created_at DESC
           LIMIT $2 OFFSET $3`,
          [productId, limit, offset]
        );

        const statsResult = await pool.query(
          'SELECT COUNT(*) as total, COALESCE(AVG(rating)::numeric, 0) as average FROM reviews WHERE product_id = $1',
          [productId]
        );

        res.json({
          success: true,
          reviews: reviewsResult.rows,
          stats: {
            total: parseInt(statsResult.rows[0].total),
            average: parseFloat(statsResult.rows[0].average)
          },
          pagination: { page, limit, total: parseInt(statsResult.rows[0].total) }
        });
        await pool.end();
        return;
      }

      if (req.method === 'POST') {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          res.status(401).json({ success: false, message: 'Authentication required' });
          await pool.end();
          return;
        }

        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const { rating, comment } = req.body || {};

          if (!rating || rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
            await pool.end();
            return;
          }

          // Check if user already reviewed this product
          const existingReview = await pool.query(
            'SELECT id FROM reviews WHERE product_id = $1 AND user_id = $2',
            [productId, decoded.id]
          );

          if (existingReview.rows[0]) {
            res.status(400).json({ success: false, message: 'You have already reviewed this product' });
            await pool.end();
            return;
          }

          const result = await pool.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [productId, decoded.id, rating, comment || '']
          );

          res.status(201).json({ success: true, review: result.rows[0] });
        } catch (err) {
          if (err.name === 'JsonWebTokenError') {
            res.status(401).json({ success: false, message: 'Invalid token' });
          } else {
            throw err;
          }
        }
        await pool.end();
        return;
      }
    }

    // User reviews endpoint (GET /api/reviews)
    if (url.match(/\/api\/reviews$/) && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        await pool.end();
        return;
      }
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query(
          `SELECT r.*, p.name as product_name, p.images as product_image
           FROM reviews r
           LEFT JOIN products p ON r.product_id = p.id
           WHERE r.user_id = $1
           ORDER BY r.created_at DESC`,
          [decoded.id]
        );
        res.json({ success: true, reviews: result.rows });
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
          throw err;
        }
      }
      await pool.end();
      return;
    }

    // ===== INVENTORY ENDPOINTS =====

    // Get inventory for a product (GET /api/products/:id/inventory)
    const invProdMatch = url.match(/\/api\/products\/([^\/\?]+)\/inventory/);
    if (invProdMatch && req.method === 'GET') {
      const productId = invProdMatch[1];
      const invResult = await pool.query('SELECT * FROM inventory WHERE product_id = $1', [productId]);
      const inventory = invResult.rows[0] || { product_id: productId, quantity: 0, low_stock_threshold: 5 };
      res.json({ success: true, data: inventory });
      await pool.end();
      return;
    }

    // Update inventory (PUT /api/products/:id/inventory) - Admin only
    if (invProdMatch && req.method === 'PUT') {
      const productId = invProdMatch[1];
      const { quantity, increment, decrement, low_stock_threshold } = req.body || {};

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Admin authorization required' });
        await pool.end();
        return;
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.id]);
        if (!userResult.rows[0] || userResult.rows[0].role !== 'ADMIN') {
          res.status(403).json({ success: false, message: 'Admin access required' });
          await pool.end();
          return;
        }

        const existing = await pool.query('SELECT * FROM inventory WHERE product_id = $1', [productId]);
        const threshold = low_stock_threshold || (existing.rows[0]?.low_stock_threshold || 5);
        const oldQty = existing.rows[0]?.quantity || 0;

        if (existing.rows[0]) {
          let newQuantity = existing.rows[0].quantity;
          if (typeof quantity === 'number') {
            newQuantity = quantity;
          } else if (increment) {
            newQuantity += increment;
          } else if (decrement) {
            newQuantity = Math.max(0, newQuantity - decrement);
          }

          await pool.query(
            `UPDATE inventory SET quantity = $1, low_stock_threshold = $2,
             last_restocked = CASE WHEN $1 > $3 THEN CURRENT_TIMESTAMP ELSE last_restocked END,
             updated_at = CURRENT_TIMESTAMP WHERE product_id = $4`,
            [newQuantity, threshold, oldQty, productId]
          );

          if (newQuantity > 0 && newQuantity <= threshold) {
            await pool.query(
              'INSERT INTO low_stock_alerts (product_id, quantity) VALUES ($1, $2)',
              [productId, newQuantity]
            );
          }
        } else {
          const initQty = typeof quantity === 'number' ? quantity : (increment || 0);
          await pool.query(
            `INSERT INTO inventory (product_id, quantity, low_stock_threshold, last_restocked)
             VALUES ($1, $2, $3, CASE WHEN $2 > 0 THEN CURRENT_TIMESTAMP ELSE NULL END)`,
            [productId, initQty, threshold]
          );
        }

        const result = await pool.query('SELECT * FROM inventory WHERE product_id = $1', [productId]);
        res.json({ success: true, data: result.rows[0] });
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
          throw err;
        }
      }
      await pool.end();
      return;
    }

    // Get all inventory (GET /api/inventory) - Admin only
    if (url.includes('/api/inventory') && !url.includes('/alerts') && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Admin authorization required' });
        await pool.end();
        return;
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.id]);
        if (!userResult.rows[0] || userResult.rows[0].role !== 'ADMIN') {
          res.status(403).json({ success: false, message: 'Admin access required' });
          await pool.end();
          return;
        }

        const result = await pool.query(`
          SELECT i.*, p.name as product_name, p.image as product_image, p.price as product_price, p.is_active
          FROM inventory i
          JOIN products p ON p.id = i.product_id
          ORDER BY i.quantity ASC
        `);

        res.json({ success: true, data: result.rows });
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
          throw err;
        }
      }
      await pool.end();
      return;
    }

    // Low stock alerts (GET /api/inventory/alerts) - Admin only
    if (url.includes('/api/inventory/alerts') && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Admin authorization required' });
        await pool.end();
        return;
      }

      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [decoded.id]);
        if (!userResult.rows[0] || userResult.rows[0].role !== 'ADMIN') {
          res.status(403).json({ success: false, message: 'Admin access required' });
          await pool.end();
          return;
        }

        const lowStockResult = await pool.query(`
          SELECT i.*, p.name as product_name, p.image as product_image, p.price as product_price
          FROM inventory i
          JOIN products p ON p.id = i.product_id
          WHERE i.quantity <= i.low_stock_threshold AND i.quantity > 0
          ORDER BY i.quantity ASC
        `);

        const outOfStockResult = await pool.query(`
          SELECT i.*, p.name as product_name, p.image as product_image, p.price as product_price
          FROM inventory i
          JOIN products p ON p.id = i.product_id
          WHERE i.quantity = 0
          ORDER BY i.updated_at DESC
        `);

        res.json({
          success: true,
          data: {
            lowStock: lowStockResult.rows,
            outOfStock: outOfStockResult.rows,
            total: lowStockResult.rows.length + outOfStockResult.rows.length
          }
        });
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ success: false, message: 'Invalid token' });
        } else {
          throw err;
        }
      }
      await pool.end();
      return;
    }

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    await pool.end();
  }
};