# 🚀 Vercel Deployment – Final Professional Setup Guide

## 📌 Project: Full Stack Website (React + Node API)

---

## ✅ 1. Environment Variables Setup

Go to: **Vercel Dashboard → Settings → Environment Variables**

Add the following:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

JWT_SECRET=your_random_secret_string

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE=your_number

RESEND_API_KEY=your_resend_key

FRONTEND_URL=https://your-site.vercel.app
```

### ⚠️ Notes:

* JWT_SECRET → strong random string
* FRONTEND_URL → must match your deployed domain

---

## ✅ 2. vercel.json Configuration (SPA Routing Fix)

Create or update `vercel.json` in root folder:

```json
{
  "builds": [
    {
      "src": "my-website/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/my-website/dist/index.html"
    }
  ]
}
```

### 🎯 Purpose:

* Fix white screen issue
* Enable React Router navigation

---

## ✅ 3. Backend API Setup

Create file:

```
api/index.js
```

Add:

```js
const app = require('../my-website/api/app');
module.exports = app;
```

### 🎯 Purpose:

* Allows Vercel to detect backend functions

---

## ✅ 4. Root package.json Setup

Add dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  }
}
```

### 🎯 Purpose:

* Required for serverless backend execution

---

## ✅ 5. Auth Route Fix (Frontend + Backend Match)

File:

```
my-website/api/routes/auth.js
```

Update routes:

```js
router.post('/send-otp', sendOtp);
router.post('/email/send-otp', sendOtp);
```

### 🎯 Purpose:

* Fix mismatch between frontend API calls and backend routes

---

## ✅ 6. CORS Configuration

In backend (`app.js` or `server.js`):

```js
const cors = require("cors");

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 🎯 Purpose:

* Allow frontend to communicate with backend securely

---

## ✅ 7. Final Deployment

Run in terminal:

```
npx vercel --prod
```

---

# 🔥 Final Checklist

✔ Environment variables added
✔ Routing fixed
✔ Backend connected
✔ Auth routes aligned
✔ CORS configured
✔ Production deployment done

---

# ⚠️ Common Mistakes

* Wrong ENV values
* Missing FRONTEND_URL
* Twilio / Resend not configured properly
* API path mismatch

---

# 🧪 Testing

Check backend:

```
https://your-site.vercel.app/api
```

### Result:

* Response = Working
* Error = Config issue

---

# 💡 Pro Tip

If login/OTP fails:
👉 Problem is 99% in ENV variables or API setup

---

## 🚀 Status: Production Ready

Your full stack app is now ready for deployment and testing.
