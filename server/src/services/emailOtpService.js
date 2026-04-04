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
 */
const sendEmailOtp = async (email) => {
  const otp = generateOtp();
  const expiryMins = parseInt(process.env.OTP_EXPIRY_MINUTES) || 15;
  const expiry = Date.now() + (expiryMins * 60 * 1000);

  try {
    // 1. Store/Upsert OTP in Supabase table 'public.otps'
    // We use .upsert with a unique on 'identifier' or just 'identifier' check
    const { error: upsertError } = await supabase.from('otps').upsert({
      identifier: email,
      otp: otp,
      expiry: expiry,
      type: 'email'
    }, { onConflict: 'identifier' }); // Ensures one record per email

    if (upsertError) {
      console.error('Supabase Upsert Error:', upsertError);
      throw new Error(`Database save failed: ${upsertError.message}`);
    }

    // 2. Send email via Resend
    // Note: 'onboarding@resend.dev' only works for the account owner email.
    // If testing on a target email, you must verify the domain or use the owner email.
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'DigitalCore - Verification Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Verification Code</h2>
          <p>Use the code below to sign in to your DigitalCore account.</p>
          <h1 style="color: #000; letter-spacing: 5px; background: #f4f4f4; padding: 15px; display: inline-block;">${otp}</h1>
          <p>This code will expire in ${expiryMins} minutes.</p>
        </div>
      `
    });

    if (resendError) {
      console.error('Resend API Error:', resendError);
      throw new Error(`Email provider failed: ${resendError.message}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Send Email OTP Service Error:', error.message);
    throw error;
  }
};

/**
 * Verify OTP received via Email (Robust Logic)
 */
const verifyEmailOtp = async (email, otp) => {
  // Fetch latest record for this identifier
  const { data: record, error } = await supabase
    .from('otps')
    .select('*')
    .eq('identifier', email)
    .eq('type', 'email')
    .maybeSingle(); // Returns null instead of error if missing

  if (error) {
    process.env.NODE_ENV === 'development' && console.log('DEBUG: DB Query failed', error);
    throw new Error('System error during verification. Try again.');
  }

  if (!record) {
    throw new Error('No active OTP found for this email.');
  }

  // 1. Check Expiration
  if (Date.now() > Number(record.expiry)) {
    // Delete expired record
    await supabase.from('otps').delete().eq('id', record.id);
    throw new Error('OTP has expired. Please request a new one.');
  }

  // 2. Check Match (Case-Independant & Type-Safe)
  if (record.otp.toString().trim() !== otp.toString().trim()) {
    throw new Error('Incorrect code. Please check and try again.');
  }

  // 3. Success -> Cleanup!
  await supabase.from('otps').delete().eq('identifier', email);

  return { 
    success: true, 
    user: { id: record.identifier, email: record.identifier } 
  };
};

module.exports = {
  sendEmailOtp,
  verifyEmailOtp
};
