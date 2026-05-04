/**
 * Wraps async Express route handlers to automatically catch unhandled promise rejections.
 * Eliminates the need for repetitive try-catch blocks in every controller.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};