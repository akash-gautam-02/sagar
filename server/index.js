require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true
}));
app.use(express.json());

// Rate Limiting for OTP abuse prevention (5 OTP requests per 15 mins)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many OTP requests. Please wait 15 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests. Please slow down.' }
});

// Routes
app.use('/api/auth/send-otp', otpLimiter);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', apiLimiter, require('./routes/users'));

// Health check
app.get('/health', (req, res) => res.json({
  status: 'OK',
  service: 'DigitalCore Auth Server',
  timestamp: new Date().toISOString()
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DigitalCore Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
