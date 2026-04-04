const express = require('express');
const router = express.Router();
const validator = require('validator');
const twilioClient = require('../lib/twilio');
const { sendOTPEmail } = require('../lib/email');
const supabase = require('../lib/supabase');
const jwt = require('jsonwebtoken');

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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  const type = isEmail ? 'email' : 'phone';

  try {
    // 1. Store OTP in Supabase (essential for serverless)
    // We use upsert to replace old OTP if it exists for this user
    const { error: dbError } = await supabase
      .from('otps')
      .upsert({
        identifier,
        otp,
        expiry,
        type,
        created_at: new Date().toISOString()
      }, { onConflict: 'identifier' });

    if (dbError) throw dbError;

    // 2. Send OTP
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
    res.status(500).json({ error: `Failed to send OTP (${error.message}). Please try again.` });
  }
});

/**
 * Alias routes for frontend compatibility (AuthContext.jsx)
 */
router.post('/email/send-otp', (req, res, next) => {
  req.body.identifier = req.body.email; // Map "email" to "identifier"
  next();
}, async (req, res) => {
  // Transfer control to main send-otp handler
  req.url = '/send-otp';
  router.handle(req, res);
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

  try {
    // 1. Fetch OTP from Supabase
    const { data: stored, error: fetchError } = await supabase
      .from('otps')
      .select('*')
      .eq('identifier', identifier)
      .single();

    if (fetchError || !stored || stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid verification code.' });
    }

    if (Date.now() > Number(stored.expiry)) {
      await supabase.from('otps').delete().eq('identifier', identifier);
      return res.status(400).json({ error: 'Verification code expired.' });
    }

    // 2. Clear OTP after success
    await supabase.from('otps').delete().eq('identifier', identifier);

    // 3. Find or create user in Supabase
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const isEmail = validator.isEmail(identifier);
    let user = users.find(u => isEmail ? u.email === identifier : (u.phone === identifier || u.user_metadata?.phone === identifier));

    if (!user) {
      const userConfig = isEmail
        ? { email: identifier, email_confirm: true }
        : { phone: identifier, phone_confirm: true };

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser(userConfig);
      if (createError) throw createError;
      user = newUser.user;
    }

    // 4. Log login activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'login',
      ip_address: req.ip || req.headers['x-forwarded-for'] || 'Unknown',
      device_info: req.headers['user-agent'] || 'Unknown',
    }).catch(err => console.error('Activity log insert failed:', err.message));

    // 5. Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: '12h' } // Increased to 12h for better UX
    );

    // 6. Fetch profile
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
    res.status(500).json({ error: `Authentication failed: ${error.message}` });
  }
});

/**
 * Alias verify routes for frontend compatibility
 */
router.post('/email/verify-otp', (req, res, next) => {
  req.body.identifier = req.body.email;
  next();
}, async (req, res) => {
  req.url = '/verify-otp';
  router.handle(req, res);
});

router.post('/phone/verify-otp', (req, res, next) => {
  req.body.identifier = req.body.phone;
  next();
}, async (req, res) => {
  req.url = '/verify-otp';
  router.handle(req, res);
});

module.exports = router;

