const express = require('express');
const { validateCoupon, getAllCoupons } = require('../controllers/couponController');
const { protect, staff } = require('../middleware/auth');

const router = express.Router();

router.post('/validate', validateCoupon);
router.get('/', protect, staff, getAllCoupons);

module.exports = router;
