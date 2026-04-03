const rateLimit = require('express-rate-limit');

/**
 * Standard API rate limit (Global)
 */
const apiLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 requests per 15 mins
  message: { error: 'Too many requests. Please slow down.' }
});

/**
 * Rate limiting for OTP abuse prevention (5 OTP requests per 15 mins per IP/email/phone)
 */
const emailLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many email OTP requests. Please wait 15 minutes.' }
});

const phoneLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many phone OTP requests. Please wait 15 minutes.' }
});

module.exports = {
  apiLimit,
  emailLimit,
  phoneLimit
};
