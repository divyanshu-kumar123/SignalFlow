export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // If it's a 4xx code (client error), status is 'fail'. Otherwise 'error'.
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // We mark this as true so we know it's an error we predicted and threw intentionally
    this.isOperational = true;

    // Captures the stack trace to show us exactly where the error happened
    Error.captureStackTrace(this, this.constructor);
  }
}