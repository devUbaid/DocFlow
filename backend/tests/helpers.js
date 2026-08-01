const User = require('../models/User');
const { signToken } = require('../utils/token');

const makeUser = async (overrides = {}) => {
  const data = {
    name: 'Test User',
    email: `test-${Date.now()}@demo.com`,
    ...overrides,
  };
  const user = new User(data);
  await user.setPassword(overrides.password || 'password123');
  await user.save();
  return user;
};

const authHeader = (user) => {
  const token = signToken({ id: user._id, role: user.role });
  return `Bearer ${token}`;
};

module.exports = { makeUser, authHeader };
