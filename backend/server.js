require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { pool, connectDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      message: 'Kiswa Essentials API is running with PostgreSQL',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database tables and start server
const startServer = async () => {
  try {
    await connectDB();

    // Create tables
    const User = require('./models/User');
    const Category = require('./models/Category');
    const Product = require('./models/Product');
    const Order = require('./models/Order');

    await User.createTable();
    await Category.createTable();
    await Product.createTable();
    await Order.createTable();

    // Add missing columns to existing tables
    try {
      await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT`);
      await pool.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS region_prices JSONB DEFAULT '{}'`);
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2)`);
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS region_prices JSONB DEFAULT '{}'`);
      await pool.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false`);
    } catch (e) {
      console.log('Columns may already exist:', e.message);
    }

    console.log('All tables created successfully');

    // Seed database with sample data
    const seedDatabase = require('./seeds/data');
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;