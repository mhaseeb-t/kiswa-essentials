const { pool } = require('../config/db');

const seedDatabase = async () => {
  try {
    // First, ensure columns exist
    try {
      await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT`);
    } catch (e) {}
    try {
      await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS region_prices JSONB DEFAULT '{}'`);
    } catch (e) {}

    // Create categories (using only safe columns)
    const categories = [
      { id: 'kurtas', name: 'Kurtas' },
      { id: 'shalwar-kameez', name: 'Shalwar Kameez' },
      { id: 'shawls', name: 'Shawls' },
      { id: 'perfumes', name: 'Perfumes' },
      { id: 'waistcoats', name: 'Waistcoats' },
    ];

    for (const cat of categories) {
      await pool.query(
        `INSERT INTO categories (id, name)
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [cat.id, cat.name]
      );
    }
    console.log('Categories seeded');

    // Create products
    const products = [
      { id: 'prod-001', name: 'Embroidered Silk Kurta', description: 'Hand-embroidered pure silk kurta with intricate gold thread work.', category_id: 'kurtas', price: 89.99, stock: 25, featured: true },
      { id: 'prod-002', name: 'Classic White Cotton Kurta', description: 'Minimalist white cotton kurta with subtle embroidery.', category_id: 'kurtas', price: 59.99, stock: 50, featured: true },
      { id: 'prod-003', name: 'Royal Shalwar Kameez Set', description: 'Luxurious embroidered shalwar kameez.', category_id: 'shalwar-kameez', price: 129.99, stock: 15, featured: true },
      { id: 'prod-004', name: 'Cotton Summer Shalwar Kameez', description: 'Lightweight cotton shalwar kameez.', category_id: 'shalwar-kameez', price: 89.99, stock: 30, featured: false },
      { id: 'prod-005', name: 'Pashmina Wool Shawl', description: '100% pure pashmina wool shawl.', category_id: 'shawls', price: 79.99, stock: 40, featured: true },
      { id: 'prod-006', name: 'Embroidered Wool Shawl', description: 'Intricate embroidery on premium wool.', category_id: 'shawls', price: 59.99, stock: 35, featured: false },
      { id: 'prod-007', name: 'Oud Premium Perfume', description: 'Rich oud-based fragrance.', category_id: 'perfumes', price: 49.99, stock: 60, featured: true },
      { id: 'prod-008', name: 'Rose & Sandal Attar', description: 'Traditional attar blend.', category_id: 'perfumes', price: 39.99, stock: 45, featured: true },
      { id: 'prod-009', name: 'Velvet Embroidered Waistcoat', description: 'Luxurious velvet waistcoat.', category_id: 'waistcoats', price: 79.99, stock: 20, featured: true },
      { id: 'prod-010', name: 'Cotton Brocade Waistcoat', description: 'Traditional brocade waistcoat.', category_id: 'waistcoats', price: 59.99, stock: 25, featured: false },
    ];

    for (const prod of products) {
      await pool.query(
        `INSERT INTO products (id, name, description, category_id, price, stock, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, stock = EXCLUDED.stock, featured = EXCLUDED.featured`,
        [prod.id, prod.name, prod.description, prod.category_id, prod.price, prod.stock, prod.featured]
      );
    }
    console.log('Products seeded');

    // Create sample coupons
    const coupons = [
      { code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_order_amount: 50, max_discount: 20, usage_limit: 100, valid_from: new Date(), valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), active: true },
      { code: 'SAVE20', discount_type: 'fixed', discount_value: 20, min_order_amount: 100, usage_limit: 50, valid_from: new Date(), valid_until: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), active: true },
      { code: 'SUMMER25', discount_type: 'percentage', discount_value: 25, min_order_amount: 75, max_discount: 50, usage_limit: null, valid_from: new Date(), valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), active: true },
    ];

    for (const coupon of coupons) {
      await pool.query(
        `INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, valid_from, valid_until, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (code) DO UPDATE SET
         discount_type = EXCLUDED.discount_type, discount_value = EXCLUDED.discount_value, min_order_amount = EXCLUDED.min_order_amount,
         max_discount = EXCLUDED.max_discount, usage_limit = EXCLUDED.usage_limit, active = EXCLUDED.active`,
        [coupon.code, coupon.discount_type, coupon.discount_value, coupon.min_order_amount, coupon.max_discount, coupon.usage_limit, coupon.valid_from, coupon.valid_until, coupon.active]
      );
    }
    console.log('Coupons seeded');

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await pool.query(
      `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password`,
      ['admin-001', 'Admin User', 'admin@kiswa.com', hashedPassword, 'ADMIN']
    );
    console.log('Admin user created');

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};

module.exports = seedDatabase;