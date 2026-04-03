const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { emailLimit, phoneLimit } = require('../middlewares/rateLimiter');

// Email OTP Endpoints
router.post('/email/send-otp', emailLimit, authController.sendEmailOtp);
router.post('/email/verify-otp', authController.verifyEmailOtp);

// Phone OTP Endpoints
router.post('/phone/send-otp', phoneLimit, authController.sendPhoneOtp);
router.post('/phone/verify-otp', authController.verifyPhoneOtp);

module.exports = router;
