const serverless = require('serverless-http');
const app = require('../../api/app');

// We use serverless-http to wrap the Express app for Netlify Functions
module.exports.handler = serverless(app);
