const { Resend } = require('resend');

// Initialize Resend with the API key from .env
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an OTP email to the user
 * @param {string} email - Destination email address
 * @param {string} otp - The 6-digit OTP code
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Auth <onboarding@resend.dev>', // Default testing address
      to: [email],
      subject: 'Your DigitalCore Verification Code',
      html: `
        <div style="font-family: 'Syne', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #0A0A0F; color: #FFFFFF; border-radius: 24px;">
          <h2 style="color: #6366F1; font-size: 24px; font-weight: 800; margin-bottom: 16px;">DIGITALCORE</h2>
          <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">Welcome to the future of digital solutions. Use the verification code below to complete your sign-in.</p>
          
          <div style="margin: 32px 0; padding: 24px; background-color: #1E1E2E; border-radius: 16px; text-align: center;">
            <h1 style="color: #FFFFFF; font-size: 48px; font-weight: 800; letter-spacing: 4px; margin: 0;">${otp}</h1>
            <p style="color: #6366F1; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-top: 8px;">Valid for 10 minutes</p>
          </div>
          
          <p style="color: #64748B; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #1E1E2E; margin: 24px 0;" />
          <p style="color: #64748B; font-size: 12px; text-align: center;">© 2024 DigitalCore Agency. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (err) {
    console.error('Failed to send OTP Email:', err);
    throw err;
  }
};

module.exports = { sendOTPEmail };
