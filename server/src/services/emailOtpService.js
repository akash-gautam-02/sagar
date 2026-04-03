const { Resend } = require('resend');
const supabase = require('../config/supabase');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Generate a 6-digit OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP via Resend directly
 * @param {string} email 
 */
const sendEmailOtp = async (email) => {
  const otp = generateOtp();
  const expiryMins = parseInt(process.env.OTP_EXPIRY_MINUTES) || 15;
  const expiry = Date.now() + expiryMins * 60 * 1000;

  try {
    // 1. Store/Upsert OTP in Supabase table 'public.otps'
    await supabase.from('otps').upsert({
      identifier: email,
      otp: otp,
      expiry: expiry,
      type: 'email'
    });

    // 2. Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default sender for new accounts
      to: email,
      subject: 'Your Login OTP - DigitalCore',
      html: `<strong>Your OTP is ${otp}</strong>. It will expire in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`
    });

    if (error) {
      throw new Error(`Resend Email failed: ${error.message}`);
    }

    return { success: true, otp }; // OTP returned for testing/admin purposes
  } catch (error) {
    console.error('Send Email OTP Service Error:', error.message);
    throw error;
  }
};

/**
 * Verify OTP received via Email from custom 'otps' table
 * @param {string} email 
 * @param {string} otp 
 */
const verifyEmailOtp = async (email, otp) => {
  const { data: record, error } = await supabase
    .from('otps')
    .select('*')
    .eq('identifier', email)
    .eq('otp', otp)
    .eq('type', 'email')
    .single();

  if (error || !record) {
    throw new Error('Invalid or expired OTP');
  }

  if (Date.now() > Number(record.expiry)) {
    throw new Error('OTP has expired. Please request a new one.');
  }

  // Cleanup OTP after verification
  await supabase.from('otps').delete().eq('identifier', email);

  // Return a pseudo-user (or however the controller handles it)
  // For matching authController, we'd ideally find or create the user in auth.users
  // but since we're using a custom table, we just return the email/id.
  return { success: true, user: { id: record.identifier, email } };
};

module.exports = {
  sendEmailOtp,
  verifyEmailOtp
};
