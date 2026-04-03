const express = require('express');
const router = express.Router();
const validator = require('validator');
const twilioClient = require('../lib/twilio');
const { sendOTPEmail } = require('../lib/email');
const supabase = require('../lib/supabase');
const jwt = require('jsonwebtoken');

// In-memory OTP store (expires in 10 mins)
const otpStore = new Map();

// Helper: Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * POST /api/auth/send-otp
 * Body: { identifier: string } — email or phone
 */
router.post('/send-otp', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ error: 'Identifier is required' });

  const isEmail = validator.isEmail(identifier);
  const isPhone = validator.isMobilePhone(identifier, 'any', { strictMode: false });

  if (!isEmail && !isPhone) {
    return res.status(400).json({ error: 'Please enter a valid email or phone number' });
  }

  const otp = generateOTP();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  const type = isEmail ? 'email' : 'phone';

  otpStore.set(`${type}:${identifier}`, { otp, expiry });

  try {
    if (isEmail) {
      await sendOTPEmail(identifier, otp);
    } else {
      await twilioClient.messages.create({
        body: `Your DigitalCore OTP is: ${otp}. Valid for 10 minutes. Do not share this code.`,
        from: process.env.TWILIO_PHONE,
        to: identifier
      });
    }

    res.json({
      success: true,
      message: `OTP sent successfully`,
      type
    });
  } catch (error) {
    console.error('OTP Send Error:', error.message);
    res.status(500).json({ error: `Failed to send OTP. Please try again.` });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { identifier: string, otp: string }
 */
router.post('/verify-otp', async (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ error: 'Identifier and OTP are required' });
  }

  const isEmail = validator.isEmail(identifier);
  const type = isEmail ? 'email' : 'phone';
  const storeKey = `${type}:${identifier}`;
  const stored = otpStore.get(storeKey);

  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid verification code. Please try again.' });
  }
  if (Date.now() > stored.expiry) {
    otpStore.delete(storeKey);
    return res.status(400).json({ error: 'Verification code expired. Please request a new one.' });
  }

  otpStore.delete(storeKey);

  try {
    // Find or create user in Supabase
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    let user = users.find(u => isEmail ? u.email === identifier : u.phone === identifier);

    if (!user) {
      const userConfig = isEmail
        ? { email: identifier, email_confirm: true }
        : { phone: identifier, phone_confirm: true };

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser(userConfig);
      if (createError) throw createError;
      user = newUser.user;
    }

    // Log login activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'login',
      ip_address: req.ip,
      device_info: req.headers['user-agent'] || 'Unknown',
    }).catch(err => console.error('Activity log insert failed:', err.message));

    // Generate JWT (1 hour expiry for security)
    const token = jwt.sign(
      { userId: user.id, email: user.email, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Fetch profile
    const { data: profile } = await supabase
      .from('users_profile')
      .select('*')
      .eq('id', user.id)
      .single();

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email || profile?.email,
        phone: user.phone || profile?.phone,
        name: profile?.full_name || (isEmail ? identifier.split('@')[0] : identifier),
        role: profile?.role || 'user',
        avatar_url: profile?.avatar_url || null,
      }
    });
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

module.exports = router;
