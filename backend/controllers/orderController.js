const Order = require('../models/Order');
const User = require('../models/User');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in order'
      });
    }

    const total = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const order = await Order.create({
      user_id: req.user.id,
      items,
      total,
      shippingAddress,
      paymentId
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findByUserId(req.user.id);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    let order = await Order.findById(req.params.id);

    if (!order) {
      order = await Order.findByOrderId(req.params.id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'STAFF' && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const orders = await Order.findAll({ status });

    res.json({
      success: true,
      orders,
      total: orders.length
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, courier } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const updatedOrder = await Order.updateStatus(order.id, { status, trackingNumber, courier });

    console.log(`[EMAIL] Order ${order.order_id} status updated to ${status}`);
    if (trackingNumber) {
      console.log(`[EMAIL] Tracking number: ${trackingNumber}, Courier: ${courier}`);
    }

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    const users = await User.getAll();

    const customers = await Promise.all(
      users
        .filter(u => u.role === 'CUSTOMER')
        .map(async (customer) => {
          const orderCount = await User.getCustomerOrderCount(customer.id);
          return {
            ...customer,
            orderCount
          };
        })
    );

    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
  getCustomers
};