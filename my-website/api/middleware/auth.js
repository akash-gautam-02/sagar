const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');

/**
 * Middleware: Verify JWT token
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Please login again.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Invalid token. Please login again.' });
  }
};

module.exports = { verifyToken };
