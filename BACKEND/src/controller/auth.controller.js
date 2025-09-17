import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { signToken } from '../utils/auth.js';
import wrapAsync from '../utils/tryCatchWrapper.js';
import { BadRequestError, ConflictError } from '../utils/errorHandler.js';

export const register = wrapAsync(async (req, res) => {
  const { name, email, password } = req.body;
  if(!email || !password){
    throw new BadRequestError('Email and password are required');
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if(existing){
    throw new ConflictError('Email already registered');
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  let user;
  try{
    user = await User.create({ name, email: email.toLowerCase(), password: hash });
  }catch(err){
    if (err && err.code === 11000) {
      throw new ConflictError('Email already registered');
    }
    throw err;
  }
  const token = signToken({ userId: user._id.toString() });
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

export const login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    throw new BadRequestError('Email and password are required');
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if(!user){
    throw new BadRequestError('Invalid credentials');
  }
  const ok = await bcrypt.compare(password, user.password);
  if(!ok){
    throw new BadRequestError('Invalid credentials');
  }
  const token = signToken({ userId: user._id.toString() });
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});


