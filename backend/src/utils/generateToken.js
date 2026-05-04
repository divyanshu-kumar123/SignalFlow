import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token (JWT) for user authentication.
 * 
 * @param {string} userId - The MongoDB ObjectId of the user
 * @returns {string} - JWT string
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};