const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  // PostgreSQL duplicate key error
  if (err.code === '23505') {
    statusCode = 400;
    message = 'Record already exists';
  }

  // PostgreSQL foreign key error
  if (err.code === '23503') {
    statusCode = 400;
    message = 'Referenced record not found';
  }

  // PostgreSQL syntax error
  if (err.code === '42601') {
    statusCode = 400;
    message = 'Invalid query syntax';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;