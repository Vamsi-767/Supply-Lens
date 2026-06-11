# Quick Start Deployment Guide

## 30-Minute Deployment Overview

Your application is configured for deployment. Follow this quick guide to go live.

---

## What Was Done ✅

### Backend Configuration
- ✅ Updated `application.yml` to use environment variables
- ✅ Created `application-railway.yml` for Railway
- ✅ Updated `SecurityConfig.java` for dynamic CORS
- ✅ All secrets moved to environment variables

### Frontend Configuration
- ✅ Created `package.json` with React + Vite
- ✅ Created `vite.config.js`
- ✅ Created `vercel.json` for Vercel deployment
- ✅ Created API service with JWT handling
- ✅ Created environment files

### Documentation
- ✅ DEPLOYMENT_GUIDE_RAILWAY.md - Step-by-step backend setup
- ✅ DEPLOYMENT_GUIDE_VERCEL.md - Step-by-step frontend setup
- ✅ ENVIRONMENT_VARIABLES_GUIDE.md - All env var reference
- ✅ DEPLOYMENT_CHECKLIST.md - Complete verification checklist
- ✅ DEPLOYMENT_CONFIGURATION_SUMMARY.md - Architecture overview

---

## Quick Deployment (5 Simple Steps)

### Step 1: Backend → Railway (15 minutes)

```bash
# 1. Go to railway.app → Create project
# 2. Add MySQL plugin
# 3. Copy Database URL, Username, Password

# 4. Generate JWT Secret
openssl rand -hex 32

# 5. Push backend to GitHub (create repo if needed)
cd inventory-management-system-backend
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 6. In Railway Dashboard:
#    - Import from GitHub
#    - Add environment variables:
DATABASE_URL=<from MySQL>
DATABASE_USER=<from MySQL>
DATABASE_PASSWORD=<from MySQL>
JWT_SECRET=<generated above>
ALLOWED_ORIGINS=http://localhost:3000
SPRING_PROFILES_ACTIVE=railway
# 7. Deploy - Railway will give you URL like: https://app-prod-xxx.up.railway.app
```

**Your Backend URL**: `https://inventory-backend-prod-xxx.up.railway.app/api`

### Step 2: Frontend → Vercel (10 minutes)

```bash
# 1. Push frontend to GitHub
cd inventory-mangement-system-frontend/frontend
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 2. Go to vercel.com → Import GitHub repo → Select frontend folder

# 3. In Vercel Environment Variables, add:
VITE_API_URL=https://inventory-backend-prod-xxx.up.railway.app/api

# 4. Deploy - Vercel will give you URL like: https://your-app.vercel.app
```

**Your Frontend URL**: `https://your-app.vercel.app`

### Step 3: Update Backend CORS (2 minutes)

```bash
# In Railway Dashboard:
# Go to Variables and update:
ALLOWED_ORIGINS=https://your-app.vercel.app,https://yourdomain.com
# Click "Redeploy"
```

### Step 4: Add Custom Domain - GoDaddy (5 minutes)

#### In Railway:
```
Settings → Domains → Add → yourdomain.com
Copy CNAME value
```

#### In Vercel:
```
Settings → Domains → Add → yourdomain.com
```

#### In GoDaddy:
```
DNS Management:
- Add CNAME: @ → cname.vercel-dns.com
- Add CNAME: api → <railway cname>
```

### Step 5: Test Everything (3 minutes)

```bash
# 1. Open frontend in browser
https://yourdomain.com

# 2. Check browser console for errors
# 3. Try login/signup
# 4. Test API calls
# 5. Check backend health
https://api.yourdomain.com/api/actuator/health
```

---

## Key Environment Variables

### Railway Backend
```
DATABASE_URL=mysql://user:pass@host:port/db
DATABASE_USER=user
DATABASE_PASSWORD=password
JWT_SECRET=<strong-32-char-secret>
ALLOWED_ORIGINS=https://yourdomain.com,https://your-app.vercel.app
SPRING_PROFILES_ACTIVE=railway
```

### Vercel Frontend
```
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

---

## Verify Deployment Works

### Backend Checks
```bash
curl https://inventory-backend-prod-xxx.up.railway.app/api/actuator/health
# Should return: {"status":"UP"}

curl https://inventory-backend-prod-xxx.up.railway.app/api/swagger-ui.html
# Should show Swagger documentation
```

### Frontend Checks
```bash
# Open in browser: https://your-app.vercel.app
# Check browser console (F12) - should have no errors
# Login page should load
# API call should work (check Network tab)
```

---

## If Something Goes Wrong

### Backend Won't Start
1. Check Railway logs: Dashboard → Logs
2. Verify all environment variables are set
3. Check JWT_SECRET is at least 32 characters
4. Check DATABASE_URL is correct format

### Frontend API Calls Fail
1. Check VITE_API_URL in Vercel (Settings → Environment Variables)
2. Check backend CORS: `ALLOWED_ORIGINS` must include frontend domain
3. Browser console (F12) should show API error details
4. Verify backend is running: curl health endpoint

### Domain Not Working
1. Check DNS records propagated: `nslookup yourdomain.com`
2. Wait 24-48 hours for DNS to propagate
3. Verify CNAME records in GoDaddy are correct
4. Check Railway and Vercel domain settings

---

## Important Files to Know

### Backend
- `application.yml` - Development config
- `application-railway.yml` - Production config for Railway
- `SecurityConfig.java` - Dynamic CORS configuration

### Frontend
- `.env.local` - Local development (localhost:8080)
- `.env.production` - Production (your backend URL)
- `vite.config.js` - Build configuration
- `vercel.json` - Vercel deployment config
- `src/services/api.js` - API client configuration

### Documentation
- `DEPLOYMENT_GUIDE_RAILWAY.md` - Full backend setup
- `DEPLOYMENT_GUIDE_VERCEL.md` - Full frontend setup
- `ENVIRONMENT_VARIABLES_GUIDE.md` - All variables reference
- `DEPLOYMENT_CHECKLIST.md` - Complete verification

---

## Architecture Overview

```
yourdomain.com
    ↓
┌─────────────────────────────────────┐
│  Vercel (React Frontend)            │
│  https://your-app.vercel.app        │
│  VITE_API_URL → api.yourdomain.com  │
└──────────────────┬──────────────────┘
                   │ API Calls
        ┌──────────▼────────────┐
        │ Railway (Java Backend) │
        │ /api/...              │
        │ CORS allows origin ✓  │
        └──────────────┬────────┘
                       │
            ┌──────────▼──────────┐
            │ Railway MySQL       │
            │ Database            │
            └─────────────────────┘
```

---

## Expected Timeline

| Task | Time | Status |
|------|------|--------|
| Backend to Railway | 10 min | ✅ Ready |
| Frontend to Vercel | 8 min | ✅ Ready |
| Custom Domain Setup | 5 min + 24-48h wait | ✅ Ready |
| Testing | 5 min | ✅ Ready |
| **Total** | **~30 min** | ✅ |

---

## Checklist Before Going Live

- [ ] Backend running on Railway with database connected
- [ ] Frontend running on Vercel
- [ ] VITE_API_URL set in Vercel to railway backend
- [ ] ALLOWED_ORIGINS in Railway includes your domain
- [ ] HTTPS works on both frontend and backend
- [ ] Login/logout works
- [ ] API calls work (check Network tab in browser)
- [ ] No CORS errors in browser console
- [ ] Custom domain DNS is propagated

---

## Support

- **Deployment Help**: See `DEPLOYMENT_GUIDE_RAILWAY.md` and `DEPLOYMENT_GUIDE_VERCEL.md`
- **Environment Variables**: See `ENVIRONMENT_VARIABLES_GUIDE.md`
- **Full Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Complete Overview**: See `DEPLOYMENT_CONFIGURATION_SUMMARY.md`

---

## Next: You're Live! 🎉

Your application is now deployed to:
- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com/api
- **Database**: Railway MySQL

Monitor your application in:
- Railway Dashboard: https://railway.app
- Vercel Dashboard: https://vercel.com

---

**Ready to deploy? Start with Step 1 above!**
