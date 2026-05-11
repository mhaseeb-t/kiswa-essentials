const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await User.matchPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: {
          line1: user.address_line1,
          line2: user.address_line2,
          city: user.city,
          postcode: user.postcode,
          country: user.country
        },
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address) {
      if (address.line1) updateData.address_line1 = address.line1;
      if (address.line2) updateData.address_line2 = address.line2;
      if (address.city) updateData.city = address.city;
      if (address.postcode) updateData.postcode = address.postcode;
      if (address.country) updateData.country = address.country;
    }

    const user = await User.update(req.user.id, updateData);

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: {
          line1: user.address_line1,
          line2: user.address_line2,
          city: user.city,
          postcode: user.postcode,
          country: user.country
        },
        createdAt: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const user = await User.findByEmail(email);

    // Always return success to prevent email enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link'
      });
    }

    // Generate reset token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store token in database
    const { pool } = require('../config/db');
    await pool.query(
      `INSERT INTO password_resets (email, token, expires_at) VALUES ($1, $2, $3)`,
      [email, token, expiresAt]
    );

    // Log the email instead of sending (for now)
    console.log(`
========== PASSWORD RESET EMAIL ==========
To: ${email}
Subject: Reset your KISWA password

Click the link below to reset your password:
${FRONTEND_URL}/reset-password/${token}

This link expires in 1 hour.

If you didn't request this, ignore this email.
==========================================
`);

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link'
    });
  } catch (error) {
    next(error);
  }
};

const validateResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { pool } = require('../config/db');

    const result = await pool.query(
      `SELECT email, expires_at, used FROM password_resets WHERE token = $1`,
      [token]
    );

    if (!result.rows[0]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const resetRecord = result.rows[0];

    if (resetRecord.used) {
      return res.status(400).json({
        success: false,
        message: 'This reset link has already been used'
      });
    }

    if (new Date(resetRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This reset link has expired'
      });
    }

    res.json({
      success: true,
      email: resetRecord.email
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const { pool } = require('../config/db');

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Validate token
    const result = await pool.query(
      `SELECT email, expires_at, used FROM password_resets WHERE token = $1`,
      [token]
    );

    if (!result.rows[0]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const resetRecord = result.rows[0];

    if (resetRecord.used) {
      return res.status(400).json({
        success: false,
        message: 'This reset link has already been used'
      });
    }

    if (new Date(resetRecord.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This reset link has expired'
      });
    }

    // Update user password
    const user = await User.findByEmail(resetRecord.email);
    await User.updatePassword(user.id, password);

    // Mark token as used
    await pool.query(
      `UPDATE password_resets SET used = true WHERE token = $1`,
      [token]
    );

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  validateResetToken,
  resetPassword
};