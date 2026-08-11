export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong on our end';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};