# Deployment Guide — Supply Lens

This guide will deploy your app so it runs 24/7 for 1 year with zero maintenance.

**End result:** A public URL like `https://supplylens.yourname.com` that anyone can open.

---

## What You Need

1. GitHub account (you already have this)
2. Railway account (for backend + database) — https://railway.app
3. Vercel account (for frontend) — https://vercel.com
4. GoDaddy domain (you'll buy this) — https://godaddy.com

**Estimated cost:** ~$15/month ($180/year) for Railway + $12/year for domain = ~$192/year total. Frontend on Vercel is free.

---

## STEP 1: Push Code to GitHub

First, get collaborator access to the repo (ask Bodapothulasairam to add you), then:

```bash
cd /Users/vamsikrishnabodaballa/Downloads/Supply-Lens
git push origin main
```

---

## STEP 2: Deploy Backend on Railway

1. Go to https://railway.app and sign in with your GitHub account
2. Click **"New Project"**
3. Click **"Deploy from GitHub Repo"**
4. Select the **Supply-Lens** repo
5. Railway will ask "which folder?" — type: `inventory-management-system/backend`
6. Click **Deploy**

**After it deploys (takes 3-5 min):**

7. Click on the service → **Settings** → **Networking** → Click **"Generate Domain"**
8. You'll get a URL like: `supply-lens-backend-production.up.railway.app`
9. Copy this URL — you'll need it for Step 3

**Add MySQL (optional but recommended):**

10. In the same Railway project, click **"+ New"** → **"Database"** → **"MySQL"**
11. Click on the MySQL service → **Connect** tab → copy the connection string
12. Go back to your backend service → **Variables** tab → Add these:
    - `SPRING_PROFILES_ACTIVE` = `mysql`
    - `SPRING_DATASOURCE_URL` = (paste the JDBC URL from MySQL connect tab)
    - `SPRING_DATASOURCE_USERNAME` = (from MySQL connect tab)
    - `SPRING_DATASOURCE_PASSWORD` = (from MySQL connect tab)
    - `SPRING_JPA_PLATFORM` = `org.hibernate.dialect.MySQLDialect`
    - `SPRING_DATASOURCE_DRIVER` = `com.mysql.cj.jdbc.Driver`
13. Railway auto-redeploys

**If you skip MySQL:** The app works fine with H2 (in-memory). Data loads fresh from CSV files every time the server restarts. For a demo site, this is perfectly fine.

---

## STEP 3: Deploy Frontend on Vercel

1. Go to https://vercel.com and sign in with your GitHub account
2. Click **"Add New Project"**
3. Import the **Supply-Lens** repo
4. Vercel asks "which folder?" — set **Root Directory** to: `inventory-mangement-system-frontend/frontend`
5. In **Environment Variables**, add:
   - Name: `VITE_API_URL`
   - Value: `https://YOUR-RAILWAY-URL-FROM-STEP-2/api`
   (Example: `https://supply-lens-backend-production.up.railway.app/api`)
6. Click **Deploy**

After 1-2 min, Vercel gives you a URL like: `supply-lens.vercel.app`

---

## STEP 4: Connect GoDaddy Domain

1. Buy a domain on GoDaddy (e.g., `supplylens.com` or `aistreams-demo.com`)
2. In Vercel → your project → **Settings** → **Domains** → Add your domain
3. Vercel shows you DNS records to add
4. In GoDaddy → **DNS Management** → Add the records Vercel tells you:
   - Usually a CNAME record pointing to `cname.vercel-dns.com`
5. Wait 5-30 minutes for DNS to propagate
6. Done! Your app is live at your custom domain

---

## What Happens After Deployment

- **Frontend (Vercel):** Runs forever free. Auto-deploys if you push code. Never goes down.
- **Backend (Railway):** Runs 24/7. Auto-restarts if it crashes. Auto-deploys if you push code. $5-15/month depending on usage.
- **You do nothing.** The app just runs.

---

## If Something Goes Wrong (unlikely)

- **App shows error:** Go to Railway dashboard → check logs
- **Frontend broken:** Go to Vercel dashboard → check deployment
- **Domain not working:** Check GoDaddy DNS settings match what Vercel says

---

## Summary

| Step | Where | Time |
|------|-------|------|
| Push code | Terminal | 1 min |
| Deploy backend | railway.app | 5 min |
| Deploy frontend | vercel.com | 2 min |
| Connect domain | GoDaddy + Vercel | 10 min |
| **Total** | | **~20 min** |

After this, give aiStreams the URL and they add it to their website. Done.
