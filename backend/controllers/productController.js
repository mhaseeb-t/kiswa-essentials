const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const { category_id, minPrice, maxPrice, search, sort, page = 1, limit = 10, region = 'UK', featured } = req.query;

    const filters = {};
    if (category_id) filters.category_id = category_id;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (search) filters.search = search;
    if (sort) filters.sort = sort;
    if (featured === 'true') filters.featured = true;

    const products = await Product.findAll(filters, region);

    res.json({
      success: true,
      products,
      total: products.length
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { region = 'UK' } = req.query;
    const product = await Product.findById(req.params.id, region);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, original_price, category_id, stock, images, featured, region_prices, is_active } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      original_price,
      category_id,
      stock,
      images,
      featured,
      region_prices,
      is_active
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, original_price, category_id, stock, images, featured, region_prices, is_active } = req.body;

    const updatedProduct = await Product.update(req.params.id, {
      name,
      description,
      price,
      original_price,
      category_id,
      stock,
      images,
      featured,
      region_prices,
      is_active
    });

    res.json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.delete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};