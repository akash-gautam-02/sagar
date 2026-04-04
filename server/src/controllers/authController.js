const { sendEmailOtp, verifyEmailOtp } = require('../services/emailOtpService');
const { sendPhoneOtp, verifyPhoneOtp, verifyFirebaseToken } = require('../services/phoneOtpService');
const { generateTokens } = require('../services/jwtService');
const supabase = require('../config/supabase');

/**
 * Send OTP via Email
 */
exports.sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required', success: false });

  try {
    const result = await sendEmailOtp(email);
    res.json({ message: 'OTP sent to email', success: true });
  } catch (error) {
    console.error('Send Email OTP Controller Error:', error.message);
    res.status(500).json({ error: error.message, success: false });
  }
};

/**
 * Verify OTP via Email
 */
exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required', success: false });

  try {
    const { user } = await verifyEmailOtp(email, otp);
    
    // Sync with our custom users table in Supabase (if needed, as per PRD Section 5)
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        auth_provider: 'email',
        is_verified: true,
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    const { accessToken, refreshToken } = generateTokens(dbUser);

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: { id: dbUser.id, email: dbUser.email }
    });
  } catch (error) {
    console.error('Verify Email OTP Controller Error:', error.message);
    res.status(500).json({ error: error.message, success: false });
  }
};

/**
 * Send OTP via Phone
 */
exports.sendPhoneOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required', success: false });

  try {
    const { sessionInfo } = await sendPhoneOtp(phone);
    res.json({ message: 'OTP sent via SMS', success: true, sessionInfo });
  } catch (error) {
    console.error('Send Phone OTP Controller Error:', error.message);
    res.status(500).json({ error: error.message, success: false });
  }
};

/**
 * Verify OTP via Phone
 */
exports.verifyPhoneOtp = async (req, res) => {
  const { phone, otp, sessionInfo, firebaseToken } = req.body;
  
  // Validation: Must have either firebaseToken OR (phone + otp + sessionInfo)
  if (!firebaseToken && (!phone || !otp || !sessionInfo)) {
    return res.status(400).json({ 
      error: 'Either firebaseToken or (phone, otp, sessionInfo) is required', 
      success: false 
    });
  }

  try {
    let user;
    if (req.body.firebaseToken) {
      // 🔥 VERIFY TOKEN FROM FRONTEND SDK
      const result = await verifyFirebaseToken(req.body.firebaseToken);
      user = result.user;
    } else {
      // LEGACY SERVER-SIDE VERIFY
      const result = await verifyPhoneOtp(phone, otp, sessionInfo);
      user = result.user;
    }

    // Sync with users table
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        phone: user.phone || phone,
        auth_provider: 'phone',
        is_verified: true,
        last_login: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    const { accessToken, refreshToken } = generateTokens(dbUser);

    res.json({
      success: true,
      token: accessToken,
      refreshToken,
      user: { id: dbUser.id, phone: dbUser.phone }
    });
  } catch (error) {
    console.error('Verify Phone OTP Controller Error:', error.message);
    res.status(500).json({ error: error.message, success: false });
  }
};
