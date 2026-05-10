const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'STAFF')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Staff or Admin privileges required.'
    });
  }
};

module.exports = { staff };
