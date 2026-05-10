const { pool } = require('../config/db');

const Product = {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL DEFAULT 0,
        original_price DECIMAL(10, 2),
        category_id VARCHAR(50) REFERENCES categories(id),
        stock INTEGER DEFAULT 0,
        images TEXT[],
        featured BOOLEAN DEFAULT false,
        region_prices JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
  },

  async create({ name, description, price, original_price, category_id, stock = 0, images = [], featured = false, region_prices = {} }) {
    const query = `
      INSERT INTO products (id, name, description, price, original_price, category_id, stock, images, featured, region_prices)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await pool.query(query, [name, name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(), description, price, original_price, category_id, stock, images, featured, JSON.stringify(region_prices)]);
    return result.rows[0];
  },

  async findAll(filters = {}, region = 'UK') {
    let query = `
      SELECT p.*, c.name as category_name, c.id as cat_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;
    const values = [];
    let paramCount = 1;

    if (filters.category_id) {
      query += ` AND p.category_id = $${paramCount}`;
      values.push(filters.category_id);
      paramCount++;
    }

    if (filters.minPrice) {
      query += ` AND p.price >= $${paramCount}`;
      values.push(filters.minPrice);
      paramCount++;
    }

    if (filters.maxPrice) {
      query += ` AND p.price <= $${paramCount}`;
      values.push(filters.maxPrice);
      paramCount++;
    }

    if (filters.search) {
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    if (filters.featured) {
      query += ` AND p.featured = true`;
    }

    if (filters.sort === 'price-low') {
      query += ' ORDER BY p.price ASC';
    } else if (filters.sort === 'price-high') {
      query += ' ORDER BY p.price DESC';
    } else {
      query += ' ORDER BY p.created_at DESC';
    }

    const result = await pool.query(query, values);
    // Adjust prices based on region
    return result.rows.map(p => ({
      ...p,
      price: p.region_prices?.[region] || p.price,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || []
    }));
  },

  async findById(id, region = 'UK') {
    const query = `
      SELECT p.*, c.name as category_name, c.id as cat_id
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1 AND p.is_active = true
    `;
    const result = await pool.query(query, [id]);
    if (result.rows[0]) {
      const product = result.rows[0];
      product.images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images || [];
      product.price = product.region_prices?.[region] || product.price;
      return product;
    }
    return null;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(data.name);
      paramCount++;
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(data.price);
      paramCount++;
    }
    if (data.original_price !== undefined) {
      fields.push(`original_price = $${paramCount}`);
      values.push(data.original_price);
      paramCount++;
    }
    if (data.category_id !== undefined) {
      fields.push(`category_id = $${paramCount}`);
      values.push(data.category_id);
      paramCount++;
    }
    if (data.stock !== undefined) {
      fields.push(`stock = $${paramCount}`);
      values.push(data.stock);
      paramCount++;
    }
    if (data.images !== undefined) {
      fields.push(`images = $${paramCount}`);
      values.push(data.images);
      paramCount++;
    }
    if (data.featured !== undefined) {
      fields.push(`featured = $${paramCount}`);
      values.push(data.featured);
      paramCount++;
    }
    if (data.region_prices !== undefined) {
      fields.push(`region_prices = $${paramCount}`);
      values.push(JSON.stringify(data.region_prices));
      paramCount++;
    }
    if (data.is_active !== undefined) {
      fields.push(`is_active = $${paramCount}`);
      values.push(data.is_active);
      paramCount++;
    }

    if (fields.length === 0) return null;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async getCount() {
    const query = 'SELECT COUNT(*) as count FROM products WHERE is_active = true';
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
};

module.exports = Product;