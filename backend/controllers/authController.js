const asyncHandler = require('../middleware/asyncHandler');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json(result);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  res.json({ user });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await authService.listUsers(req.user._id);
  res.json({ users });
});

module.exports = { register, login, getMe, listUsers };
