const jwt = require('jsonwebtoken');

const secret = () => process.env.JWT_SECRET || 'dev-insecure-secret';
const expiresIn = () => process.env.JWT_EXPIRES_IN || '7d';

const signToken = (payload) => jwt.sign(payload, secret(), { expiresIn: expiresIn() });

const verifyToken = (token) => jwt.verify(token, secret());

module.exports = { signToken, verifyToken };
