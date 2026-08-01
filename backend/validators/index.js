const { z } = require('zod');
const { SHARE_PERMISSIONS } = require('../constants');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const createDocSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

const updateDocSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

const shareDocSchema = z.object({
  email: z.string().email('Invalid email'),
  permission: z.enum(Object.values(SHARE_PERMISSIONS)).optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  createDocSchema,
  updateDocSchema,
  shareDocSchema,
};
