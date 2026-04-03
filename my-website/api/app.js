require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Essential environment variable validation
const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
  console.warn(`⚠️ Warning: Missing environment variables: ${missingEnv.join(', ')}`);
}

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Recommended for SPAs calling their own APIs
}));
app.use(morgan('dev'));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Rate Limiting
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increased for testing reliability
  message: { error: 'Too many OTP requests. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please slow down.' }
});

// Routes
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');

// Create a main router to handle prefixes
const mainRouter = express.Router();

mainRouter.use('/auth/send-otp', otpLimiter);
mainRouter.use('/auth', authRouter);
mainRouter.use('/user', apiLimiter, userRouter);

mainRouter.get('/health', (req, res) => res.json({
  status: 'OK',
  service: 'DigitalCore Auth Server',
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV
}));

// Mount the main router under multiple common paths for compatibility
app.use('/.netlify/functions/api', mainRouter);
app.use('/api', mainRouter);

// 404 handler
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
