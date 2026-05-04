export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // In development -- full stack trace to debug easily
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } 
  // In production
  else {
    if (err.isOperational) {
      // the trusted error
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // unknown bug (e.g., third-party package failed). Log it, but send a generic message.
      console.error('ERROR :', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  }
};