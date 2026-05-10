require('dotenv').config();
const { pool } = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const seedDatabase = async () => {
  try {
    console.log('Connecting to PostgreSQL...');
    await pool.query('SELECT 1');
    console.log('Connected to PostgreSQL');

    // Create tables
    console.log('Creating tables...');
    await User.createTable();
    await Category.createTable();
    await Product.createTable();
    await Order.createTable();
    console.log('Tables created');

    // Clear existing data
    await pool.query('DELETE FROM orders');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users WHERE email IN ($1, $2)', ['admin@kiswa.com', 'staff@kiswa.com']);
    console.log('Cleared existing data');

    // Seed categories
    console.log('Seeding categories...');
    const categories = [
      { name: 'Kurtas', image: 'https://picsum.photos/400/300?random=10' },
      { name: 'Shalwar Kameez', image: 'https://picsum.photos/400/300?random=11' },
      { name: 'Shawls', image: 'https://picsum.photos/400/300?random=12' },
      { name: 'Perfumes', image: 'https://picsum.photos/400/300?random=13' }
    ];

    for (const cat of categories) {
      await Category.create(cat);
    }
    console.log('Categories seeded');

    const allCategories = await Category.findAll();

    // Seed products
    console.log('Seeding products...');
    const products = [
      {
        name: 'Premium White Cotton Kurta',
        description: 'Elegant white cotton kurta, perfect for daily wear and special occasions. Features subtle embroidery on the collar and cuffs.',
        price: 45.99,
        category_id: allCategories[0].id,
        stock: 25,
        images: ['https://picsum.photos/400/400?random=20'],
        is_active: true
      },
      {
        name: 'Classic Black Kurta',
        description: 'Timeless black kurta with minimalistic design. Made from premium cotton blend for ultimate comfort.',
        price: 49.99,
        category_id: allCategories[0].id,
        stock: 20,
        images: ['https://picsum.photos/400/400?random=21'],
        is_active: true
      },
      {
        name: 'Embroidered Cream Kurta',
        description: 'Beautiful cream-colored kurta with intricate hand embroidery on the chest and sleeves.',
        price: 65.99,
        category_id: allCategories[0].id,
        stock: 15,
        images: ['https://picsum.photos/400/400?random=22'],
        is_active: true
      },
      {
        name: 'Traditional Shalwar Kameez Set',
        description: 'Complete shalwar kameez set including matching dupatta. Features classic embroidery on the kameez.',
        price: 79.99,
        category_id: allCategories[1].id,
        stock: 18,
        images: ['https://picsum.photos/400/400?random=23'],
        is_active: true
      },
      {
        name: 'Designer Shalwar Kameez',
        description: 'Premium designer shalwar kameez with modern cut and elegant embellishments.',
        price: 129.99,
        category_id: allCategories[1].id,
        stock: 12,
        images: ['https://picsum.photos/400/400?random=24'],
        is_active: true
      },
      {
        name: 'Cashmere Blend Shawl',
        description: 'Luxurious cashmere blend shawl, perfect for winter. Features traditional paisley pattern.',
        price: 89.99,
        category_id: allCategories[2].id,
        stock: 30,
        images: ['https://picsum.photos/400/400?random=25'],
        is_active: true
      },
      {
        name: 'Embroidered Wool Shawl',
        description: 'Warm wool shawl with delicate embroidery along the borders. Ideal for cooler evenings.',
        price: 55.99,
        category_id: allCategories[2].id,
        stock: 22,
        images: ['https://picsum.photos/400/400?random=26'],
        is_active: true
      },
      {
        name: 'Oud Deodorant Spray',
        description: 'Long-lasting oud fragrance deodorant spray. Provides all-day freshness and confidence.',
        price: 24.99,
        category_id: allCategories[3].id,
        stock: 50,
        images: ['https://picsum.photos/400/400?random=27'],
        is_active: true
      },
      {
        name: 'Musk Attar Oil',
        description: 'Pure musk attar oil for traditional fragrance lovers. Comes in elegant glass bottle.',
        price: 34.99,
        category_id: allCategories[3].id,
        stock: 35,
        images: ['https://picsum.photos/400/400?random=28'],
        is_active: true
      },
      {
        name: 'Premium Attar Collection',
        description: 'Set of 3 premium attar oils: Rose, Sandalwood, and Amber. Perfect gift set.',
        price: 59.99,
        category_id: allCategories[3].id,
        stock: 20,
        images: ['https://picsum.photos/400/400?random=29'],
        is_active: true
      }
    ];

    for (const product of products) {
      await Product.create(product);
    }
    console.log('Products seeded');

    // Seed admin user
    console.log('Creating admin user...');
    await User.create({
      name: 'Admin User',
      email: 'admin@kiswa.com',
      password: 'admin123',
      role: 'ADMIN',
      phone: '+44-1234567890'
    });
    console.log('Admin created: admin@kiswa.com / admin123');

    // Seed staff user
    console.log('Creating staff user...');
    await User.create({
      name: 'Staff User',
      email: 'staff@kiswa.com',
      password: 'staff123',
      role: 'STAFF',
      phone: '+44-1234567891'
    });
    console.log('Staff created: staff@kiswa.com / staff123');

    console.log('\n✓ Database seeding completed successfully!');
    console.log('\nLogin Credentials:');
    console.log('  Admin: admin@kiswa.com / admin123');
    console.log('  Staff: staff@kiswa.com / staff123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();