# 🚀 DigitalCore - Premium Full-Stack Auth Platform

A modern, secure, and production-ready authentication platform featuring dual-mode (Email/Phone) OTP verification, session management, and a sleek user dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fakash-gautam-02%2Fsagar)
[![Netlify Status](https://api.netlify.com/api/v1/badges/afd1cd9f-b886-4331-a9ee-2b08e9fe3010/deploy-status)](https://app.netlify.com/sites/afd1cd9f-b886-4331-a9ee-2b08e9fe3010/deploys)

## ✨ Features

- 🔐 **Dual-Mode OTP**: Secure login via Email (Resend) or Phone (Twilio).
- 👤 **Dynamic Dashboard**: User profile management and real-time activity logs.
- 🛸 **Serverless Architecture**: Built with Vite (React) and Express, deployed via Netlify/Vercel Functions.
- 🎨 **Premium UI**: Modern glassmorphism design with Tailwind CSS and Framer Motion.
- ⚡ **Performance**: Optimized for lightning-fast speeds and high availability.
- 🛠 **Refactored**: Clean codebase transition from agency template to core auth platform.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Framer Motion, Axios.
- **Backend**: Node.js (Express), Serverless Functions.
- **Database**: Supabase (RLS enabled).
- **Communication**: Resend (Email), Twilio (SMS).
- **Security**: JWT tokens, Helmet, Rate Limiter.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 20.x
- Supabase account
- Twilio & Resend API keys

### 2. Installation
```bash
git clone https://github.com/akash-gautam-02/sagar.git
cd my-website
npm install
```

### 3. Environment Variables
Create a `.env` file in `my-website/` or set these on your deployment platform:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `TWILIO_SID`
- `TWILIO_TOKEN`
- `TWILIO_PHONE`
- `RESEND_API_KEY`
- `JWT_SECRET`

### 4. Development & Build
```bash
# Run locally
npm run dev

# Build for production
npm run build
```

## 🏗 Deployment

The project is pre-configured for **Netlify** (`netlify.toml`) and **Vercel** (`vercel.json`) with automated serverless function handling.

---

### 📄 Documentation
For a deep dive into the development process, see the [Zero to Hero PRD](./ZERO_TO_HERO_PRD.md).
