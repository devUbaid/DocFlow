const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/token');

const register = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw ApiError.conflict('Email already registered');

  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();

  const token = signToken({ id: user._id, role: user.role });
  return { token, user };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) throw ApiError.unauthorized('Invalid credentials');

  const match = await user.comparePassword(password);
  if (!match) throw ApiError.unauthorized('Invalid credentials');

  const token = signToken({ id: user._id, role: user.role });
  return { token, user };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

const listUsers = async (excludeId) => {
  return User.find({ _id: { $ne: excludeId } }).select('name email avatar').lean();
};

module.exports = { register, login, getMe, listUsers };
