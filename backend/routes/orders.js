const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
  getCustomers
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { staff } = require('../middleware/staff');
const { admin } = require('../middleware/admin');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.get('/', protect, staff, getOrders);
router.put('/:id/status', protect, staff, updateOrderStatus);
router.get('/admin/customers', protect, admin, getCustomers);

module.exports = router;