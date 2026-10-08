# The Grand Auravelle — Technical Deployment Guide

This repository contains the complete, upgraded, responsive, and secure codebase for The Grand Auravelle Pool Villa's digital platform.

## Directory Structure

```text
auravelle-website/
├── index.html           # Main website (Live data sync, SEO, Mobile optimized)
├── admin.html           # Secure admin control dashboard
├── admin-login.html     # Admin authentication portal
├── style.css            # Complete responsive stylesheet
├── script.js            # Main interaction & API scripting
├── privacy.html         # Required legal page
├── terms.html           # Required legal page
├── site.webmanifest     # PWA & app icons configurations
├── images/              # Assets & optimized photographs
├── backend/             # Node.js API server & environment files
│   ├── server.js        # Express API & Security gateway
│   ├── package.json     # Node dependencies
│   └── .env.example     # Template for secret variables
└── database/
    └── schema.sql       # Complete Supabase database creation script
```

## Security Upgrade Completed
- **No exposed credentials:** Supabase connection logic moved to a secure Node.js backend.
- **Valid Authentication:** Admin dashboard is protected via JWT token exchange instead of hardcoded plaintext passwords.
- **Row Level Security (RLS) Enforced:** Public access strictly blocked from modifying or accessing customer booking data. Only the service role key on your server can manipulate records.

## Automated Sync System
When you log into `/admin.html` and update:
1. Phone Number / Email / WhatsApp link
2. Price displays (e.g. ₹8,000)
3. Room details (adding a new suite, editing prices/photos)

**The `index.html` main website will automatically sync these updates on next page load without editing the code.**

---

## 🚀 How to Deploy to Production

### Step 1: Set Up Backend (Render / Railway / Heroku)
1. Navigate to the `backend/` folder.
2. Deploy this folder to a service like [Render](https://render.com) (Web Service) or [Railway](https://railway.app).
3. Set your environment variables in their dashboard:
   - `SUPABASE_URL`: (from your Supabase project)
   - `SUPABASE_SERVICE_KEY`: (from your Supabase project settings. MUST use `service_role` key, not `anon` key)
   - `FRONTEND_URL`: `https://thegrandauravelle.com`
   - `ADMIN_PASSWORD_HASH`: Create one using `bcrypt`, or simply set `ADMIN_PASSWORD=your_secure_password`.
   - `JWT_SECRET`: A random long string (e.g. `KanthalloorVilla2026SecretKeySecure`)

### Step 2: Set Up Database (Supabase)
1. Log into your Supabase account.
2. Go to the **SQL Editor**.
3. Open `database/schema.sql`, copy all the text, paste it into the editor, and click **RUN**.
4. This action will build your tables, establish database security rules, and populate the default room pricing and settings.

### Step 3: Deploy Frontend (Netlify / Vercel / Hostinger)
1. Open `script.js` and `admin-login.html`.
2. Locate the line at the top:
   ```javascript
   const API_BASE = window.location.origin + '/api'; // Look for this rule
   ```
   **Change it to your deployed backend URL:**
   ```javascript
   const API_BASE = 'https://your-backend-service-url.onrender.com/api';
   ```
3. Deploy the entire folder (except the `backend` and `database` folders) to Netlify or your preferred host.

---

### Fallback / Offline Testing Mode
The frontend is designed with progressive enhancement. If the backend server is offline or fails to load, `index.html` seamlessly falls back to beautifully styled hardcoded descriptions and images of the rooms, and `admin.html` switches to Local Sandbox Mode so you can still preview the experience.

Enjoy your brand new platform!
