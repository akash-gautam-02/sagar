# 📋 PRD — Email & Phone OTP Authentication System

**Project:** Secure OTP-based Auth System  
**Stack:** Node.js + Supabase + Firebase + Resend  
**Version:** 1.0  
**Author:** Akash  

---

## 1. 🎯 Overview (Project Ka Maqsad)

Ek robust authentication system banana hai jisme users apna **email ya phone number** daal ke OTP verify karein aur securely login/register kar sakein. System do providers use karega:

- **Supabase Auth** → Email OTP ke liye
- **Google Firebase Auth** → Phone Number OTP (SMS) ke liye
- **Resend** → Custom branded email delivery ke liye
- **JWT** → Session management ke liye

---

## 2. 🔐 Authentication Flows

### Flow A — Email OTP (via Supabase + Resend)

```
User enters email
      ↓
Backend calls Supabase Auth (signInWithOtp)
      ↓
Supabase triggers email via Resend SMTP
      ↓
User receives 6-digit OTP in inbox
      ↓
User submits OTP to backend
      ↓
Backend verifies OTP via Supabase (verifyOtp)
      ↓
JWT token issue karein → User logged in ✅
```

### Flow B — Phone OTP (via Firebase Auth)

```
User enters phone number (+91XXXXXXXXXX)
      ↓
Backend calls Firebase Admin SDK
      ↓
Firebase sends SMS OTP via its network
      ↓
User submits OTP to backend
      ↓
Backend verifies OTP via Firebase Admin
      ↓
JWT token issue karein → User logged in ✅
```

---

## 3. 🧩 System Components

| Component | Responsibility | Provider |
|---|---|---|
| Auth Controller | Routes handle karna | Express.js |
| Email OTP Service | OTP send/verify via email | Supabase + Resend |
| Phone OTP Service | OTP send/verify via SMS | Firebase Auth |
| Token Service | JWT generate + validate | jsonwebtoken |
| User Store | User data persist karna | Supabase DB (PostgreSQL) |

---

## 4. 📡 API Endpoints (Detailed)

### 4.1 Email OTP

#### `POST /auth/email/send-otp`
- **Purpose:** Email par OTP bhejo
- **Request Body:**
  ```json
  { "email": "user@example.com" }
  ```
- **Internal Action:** Supabase `auth.signInWithOtp({ email })` call hoga, jo Resend ke zariye email deliver karega
- **Response:**
  ```json
  { "message": "OTP sent to email", "success": true }
  ```

#### `POST /auth/email/verify-otp`
- **Purpose:** Email OTP verify karo aur JWT lo
- **Request Body:**
  ```json
  { "email": "user@example.com", "otp": "123456" }
  ```
- **Internal Action:** Supabase `auth.verifyOtp({ email, token, type: 'email' })` call hoga
- **Response:**
  ```json
  {
    "success": true,
    "token": "<JWT>",
    "user": { "id": "...", "email": "..." }
  }
  ```

---

### 4.2 Phone OTP

#### `POST /auth/phone/send-otp`
- **Purpose:** Phone number par SMS OTP bhejo
- **Request Body:**
  ```json
  { "phone": "+919876543210" }
  ```
- **Internal Action:** Firebase Admin SDK se custom token generate hoga, client-side Firebase SDK se SMS trigger hoga  
  *(Ya alternatively: Firebase REST API via server-side flow)*
- **Response:**
  ```json
  { "message": "OTP sent via SMS", "success": true, "sessionInfo": "..." }
  ```

#### `POST /auth/phone/verify-otp`
- **Purpose:** Phone OTP verify karo aur JWT lo
- **Request Body:**
  ```json
  { "phone": "+919876543210", "otp": "654321", "sessionInfo": "..." }
  ```
- **Internal Action:** Firebase Admin SDK se OTP verify hoga
- **Response:**
  ```json
  {
    "success": true,
    "token": "<JWT>",
    "user": { "id": "...", "phone": "..." }
  }
  ```

---

## 5. 🗃️ Database Schema (Supabase PostgreSQL)

### Table: `users`

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Auto-generated unique ID |
| `email` | TEXT (unique, nullable) | User ka email |
| `phone` | TEXT (unique, nullable) | User ka phone number |
| `auth_provider` | ENUM | `'email'` ya `'phone'` |
| `is_verified` | BOOLEAN | OTP verify hua ya nahi |
| `created_at` | TIMESTAMP | Registration time |
| `last_login` | TIMESTAMP | Last successful login |

> **Note:** Ek user ke paas email **ya** phone dono mein se kuch bhi ho sakta hai, dono bhi ho sakte hain (account linking ke liye).

---

## 6. 🔑 Security Rules

1. **OTP Expiry:** Har OTP sirf **10 minutes** ke liye valid hoga
2. **Rate Limiting:** Ek phone/email se max **5 OTP requests per 15 minutes**
3. **JWT Expiry:** Access token = **24 hours**, Refresh token = **7 days**
4. **JWT Secret:** Strong secret use karna (`akash_secure_123@jwt` — production mein aur strong rakhna)
5. **Phone Format:** Sirf E.164 format accept karo (`+91XXXXXXXXXX`)
6. **HTTPS Only:** Production mein sirf HTTPS pe run karo
7. **Supabase RLS:** Row Level Security enable rakho har table pe

---

## 7. ⚙️ Firebase Setup (Step-by-Step)

Firebase phone auth ke liye tumhe Firebase project setup karna hoga:

### Steps:
1. [Firebase Console](https://console.firebase.google.com) pe jao
2. **New Project** banao (ya existing use karo)
3. **Authentication** section mein jao → **Sign-in method**
4. **Phone** enable karo
5. **Project Settings** → **Service Accounts** → **Generate New Private Key**
6. Jo JSON file download hogi, usse `firebase-service-account.json` naam do aur project root mein rakho
7. `.env` mein Firebase config add karo (neeche dekho)

---

## 8. 📧 Resend Setup (Email Delivery)

1. [resend.com](https://resend.com) pe account banao
2. **API Keys** section mein jao → **Create API Key**
3. Apna **domain verify** karo (ya test ke liye `onboarding@resend.dev` use karo)
4. Supabase Dashboard → **Authentication** → **SMTP Settings** mein Resend ki details daalo:
   - SMTP Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: `<RESEND_API_KEY>`

---

## 9. 🔧 .env File — Complete Configuration

Tumhare current `.env` mein ye sab variables hone chahiye. Jo **missing** hain wo add karo:

```dotenv
# ── Server ──────────────────────────────────────────
PORT=5000
FRONTEND_URL=http://localhost:5173

# ── Supabase ────────────────────────────────────────
SUPABASE_URL=https://fxavbxdlbjewzahngfzo.supabase.co
SUPABASE_SERVICE_KEY=<tumhara_existing_key>

# ── Resend (Email OTP Delivery) ─────────────────────
RESEND_API_KEY=<resend_se_generate_kiya_actual_api_key>

# ── JWT ─────────────────────────────────────────────
JWT_SECRET=akash_secure_123@jwt
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ── Firebase (Phone OTP) ─────────────────────────────
# Firebase Console → Project Settings → General → Web API Key
FIREBASE_API_KEY=AIzaSy_XXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Firebase Console → Project Settings → General
FIREBASE_PROJECT_ID=your-firebase-project-id

# Firebase Console → Project Settings → General
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com

# Firebase Console → Project Settings → Service Accounts → Generate Key
# JSON file ka path (ya full JSON content as string)
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# ── OTP Config ───────────────────────────────────────
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5
RATE_LIMIT_WINDOW_MINUTES=15
```

### ⚠️ Important Notes:
- `RESEND_API_KEY` — Jo tumne `.env` mein daala hai wo Supabase key jaisi lagti hai, **galat hai**. Resend dashboard se actual key lo jo `re_XXXX` se start hoti hai
- `FIREBASE_SERVICE_ACCOUNT_PATH` → Ye JSON file **gitignore** mein zaroor daalo
- Production mein `JWT_SECRET` ko aur zyada strong karo (64+ random characters)

---

## 10. 📁 Recommended Folder Structure

```
project-root/
├── src/
│   ├── controllers/
│   │   └── authController.js       ← Email & Phone OTP endpoints
│   ├── services/
│   │   ├── emailOtpService.js      ← Supabase email OTP logic
│   │   ├── phoneOtpService.js      ← Firebase phone OTP logic
│   │   └── jwtService.js           ← Token generate/verify
│   ├── middlewares/
│   │   ├── authMiddleware.js       ← JWT validate karo
│   │   └── rateLimiter.js          ← Rate limiting
│   ├── routes/
│   │   └── authRoutes.js           ← /auth/email/* & /auth/phone/*
│   └── config/
│       ├── supabase.js             ← Supabase client init
│       └── firebase.js             ← Firebase Admin SDK init
├── firebase-service-account.json   ← 🔒 GITIGNORE KARO
├── .env                            ← 🔒 GITIGNORE KARO
├── .env.example                    ← Public template (no real values)
└── prd.md                          ← Ye document
```

---

## 11. 🚀 Development Checklist

- [ ] Supabase project mein Email OTP enable karo (Auth → Providers → Email)
- [ ] Supabase mein SMTP settings mein Resend configure karo
- [ ] Firebase project banao, Phone Auth enable karo
- [ ] Firebase Service Account JSON download karo
- [ ] Sabhi `.env` variables correctly fill karo
- [ ] `users` table Supabase mein create karo (schema Section 5 mein hai)
- [ ] Rate limiting middleware lagao
- [ ] CORS configure karo (`FRONTEND_URL` ke liye)
- [ ] Production mein HTTPS enforce karo

---

## 12. 🌐 Frontend Integration Points

Frontend (`http://localhost:5173`) ko ye flows handle karne hain:

| Action | API Call | Frontend Action |
|---|---|---|
| Email OTP bhejo | `POST /auth/email/send-otp` | OTP input form dikhao |
| Email OTP verify | `POST /auth/email/verify-otp` | JWT store karo (localStorage/cookie) |
| Phone OTP bhejo | `POST /auth/phone/send-otp` | sessionInfo store karo |
| Phone OTP verify | `POST /auth/phone/verify-otp` | JWT store karo |
| Protected route | Header: `Authorization: Bearer <JWT>` | Auto-attach JWT |

---

*PRD Version 1.0 — Akash ka OTP Auth System*