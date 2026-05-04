import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

// /**
//  * @desc    Register a new user
//  * @route   POST /api/auth/register
//  * @access  Public
//  */
export const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both email and password', 400));
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists with this email', 400));
  }

  // Create user. The pre-save hook in the User model will automatically hash the password.
  const user = await User.create({
    email,
    password_hash: password, 
  });

  if (user) {
    res.status(201).json({
      status: 'success',
      data: {
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } else {
    return next(new AppError('Invalid user data received', 400));
  }
});

// /**
//  * @desc    Authenticate a user & get token
//  * @route   POST /api/auth/login
//  * @access  Public
//  */
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both email and password', 400));
  }

  // Explicitly select the password_hash since we set select: false in the model
  const user = await User.findOne({ email }).select('+password_hash');

  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  res.status(200).json({
    status: 'success',
    data: {
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});