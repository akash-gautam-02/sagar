const twilio = require('twilio');

if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
  throw new Error('Missing Twilio credentials in .env');
}

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

module.exports = client;
