const axios = require('axios');
const admin = require('../config/firebase');

const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;

/**
 * Send Phone OTP via Firebase REST API
 * (This mimics the client-side behavior to get a sessionInfo)
 */
const sendPhoneOtp = async (phone) => {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key=${FIREBASE_API_KEY}`,
      {
        phoneNumber: phone
      }
    );

    return {
      success: true,
      sessionInfo: response.data.sessionInfo
    };
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;
    throw new Error(`Firebase Phone OTP failed: ${message}`);
  }
};

/**
 * Verify Phone OTP via Firebase REST API
 */
const verifyPhoneOtp = async (phone, otp, sessionInfo) => {
  try {
    const response = await axios.post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyAssertion?key=${FIREBASE_API_KEY}`,
      {
        postBody: `code=${otp}&sessionInfo=${sessionInfo}`,
        requestUri: "http://localhost" // Not really used but required
      }
    );

    // After verification, we fetch/create the user via Admin SDK for consistency
    const { localId, phoneNumber } = response.data;
    const userRecord = await admin.auth().getUser(localId);

    return {
      success: true,
      user: {
        id: localId,
        phone: phoneNumber || phone,
        email: userRecord.email
      }
    };
  } catch (error) {
    const message = error.response?.data?.error?.message || error.message;
    throw new Error(`Phone verification failed: ${message}`);
  }
};

module.exports = {
  sendPhoneOtp,
  verifyPhoneOtp
};
