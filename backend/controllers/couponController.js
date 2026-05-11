const Coupon = require('../models/Coupon');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subtotal amount'
      });
    }

    const coupon = await Coupon.findByCode(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    if (!coupon.active) {
      return res.status(400).json({
        success: false,
        message: 'This coupon is no longer active'
      });
    }

    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return res.status(400).json({
        success: false,
        message: 'Coupon is not yet valid'
      });
    }

    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return res.status(400).json({
        success: false,
        message: 'Coupon expired'
      });
    }

    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({
        success: false,
        message: 'Coupon fully redeemed'
      });
    }

    if (coupon.min_order_amount && subtotal < parseFloat(coupon.min_order_amount)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount: £${parseFloat(coupon.min_order_amount).toFixed(2)}`
      });
    }

    let discountAmount;
    if (coupon.discount_type === 'percentage') {
      discountAmount = subtotal * (parseFloat(coupon.discount_value) / 100);
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount));
      }
    } else {
      discountAmount = parseFloat(coupon.discount_value);
    }

    discountAmount = Math.min(discountAmount, subtotal);

    res.json({
      success: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discount_type,
        discountValue: parseFloat(coupon.discount_value),
        discountAmount: parseFloat(discountAmount.toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};

const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll();
    res.json({
      success: true,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getAllCoupons
};
