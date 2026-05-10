// Seed initial data
const { initDB } = require('./db');

const categories = [
  { id: 'kurtas', name: 'Kurtas' },
  { id: 'shalwar-kameez', name: 'Shalwar Kameez' },
  { id: 'shawls', name: 'Shawls' },
  { id: 'perfumes', name: 'Perfumes' },
  { id: 'waistcoats', name: 'Waistcoats' },
];

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

const seedDatabase = async () => {
  try {
    const { query } = require('./db');

    // Seed categories
    for (const cat of categories) {
      await query(
        `INSERT INTO categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [cat.id, cat.name]
      );
    }

    // Seed products
    for (const prod of products) {
      await query(
        `INSERT INTO products (id, name, description, category_id, price, stock, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price`,
        [prod.id, prod.name, prod.description, prod.category_id, prod.price, prod.stock, prod.featured]
      );
    }

    // Seed admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await query(
      `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password`,
      ['admin-001', 'Admin User', 'admin@kiswa.com', hashedPassword, 'ADMIN']
    );

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

module.exports = { seedDatabase, initDB };