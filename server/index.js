require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimit } = require('./src/middlewares/rateLimiter');

const app = express();

// Security and Logging Middleware
app.use(helmet());
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

// Global Rate Limiting
app.use('/api', apiLimit);

// Routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/auth', authRoutes); // PRD specifies /auth/* format for endpoints

// Optional: Keep original /api/auth prefix for compatibility if needed
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => res.json({
  status: 'OK',
  service: 'DigitalCore Secure Auth Server',
  timestamp: new Date().toISOString()
}));

// Placeholder for user management (not specified in PRD but good practice)
// app.use('/api/user', require('./src/routes/userRoutes'));

// 404 handler
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled system error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DigitalCore Secure Auth Server running on port ${PORT}`);
  console.log(`   Email OTP: Supabase + Resend`);
  console.log(`   Phone OTP: Firebase Admin SDK`);
});
