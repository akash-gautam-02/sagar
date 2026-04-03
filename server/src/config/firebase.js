const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

try {
  const serviceAccount = require(path.isAbsolute(serviceAccountPath) 
    ? serviceAccountPath 
    : path.resolve(process.cwd(), serviceAccountPath));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('🔥 Firebase Admin initialized successfully');
} catch (error) {
  console.warn('⚠️ Warning: Firebase Service Account not found or invalid. Phone OTP may not work.');
  console.log('   Expected path:', path.resolve(process.cwd(), serviceAccountPath));
}

module.exports = admin;
