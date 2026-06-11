# Frontend Deployment Guide - Vercel

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- GitHub repository with frontend code
- Vercel account (free at vercel.com)

## Step 1: Prepare Your Frontend

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Build Locally to Verify

```bash
npm run build
```

This creates the `dist` folder for production.

### 3. Test Build Locally

```bash
npm run preview
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts to:
- Link to your GitHub repository
- Select your project folder (frontend)
- Configure build settings

### Option B: Using GitHub Integration (Recommended)

1. Push frontend code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

6. Add Environment Variables (see Step 3)
7. Click "Deploy"

## Step 3: Configure Environment Variables

In Vercel project settings:

### Production Environment
```
VITE_API_URL=https://inventory-backend-production-xxxx.up.railway.app/api
VITE_APP_NAME=Inventory Management System
VITE_APP_VERSION=1.0.0
```

### Preview Environment (optional)
```
VITE_API_URL=https://api-staging.yourdomain.com/api
```

## Step 4: Verify Deployment

After deployment completes:

1. Vercel provides your frontend URL:
   ```
   https://your-app.vercel.app
   ```

2. Test the application:
   ```
   https://your-app.vercel.app
   ```

3. Check that API calls work by viewing browser console for any errors

## Step 5: Connect Custom Domain with GoDaddy

### 5.1 Add Domain in Vercel

1. In Vercel dashboard, go to project Settings → Domains
2. Click "Add Domain"
3. Enter: `yourdomain.com`
4. Click "Add"

### 5.2 Configure DNS in GoDaddy

1. Log in to GoDaddy
2. Go to DNS Management for `yourdomain.com`
3. Update or add CNAME record:
   - **Name**: `@` or `yourdomain.com`
   - **Type**: CNAME
   - **Value**: `cname.vercel-dns.com.`

4. Or use A records (if Vercel suggests):
   - **Name**: `@`
   - **Type**: A
   - **Value**: Check Vercel for the specific IP

### 5.3 Wait for DNS Propagation

DNS changes can take 24-48 hours to fully propagate.

Check status with:
```bash
nslookup yourdomain.com
```

## Step 6: Enable HTTPS & Redirects

### Auto HTTPS
Vercel automatically provisions SSL certificates via Let's Encrypt.

### Force HTTPS
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

## Step 7: Set Backend CORS Configuration

Update Railway backend environment variable:

```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://your-app.vercel.app
```

## Step 8: Configure Root Domain & www Redirect

### Option 1: Both domains point to same Vercel instance

1. In Vercel Domains:
   - Add `yourdomain.com`
   - Add `www.yourdomain.com`

2. In GoDaddy DNS:
   - `@` (root) → CNAME to `cname.vercel-dns.com.`
   - `www` → CNAME to `cname.vercel-dns.com.`

### Option 2: Redirect www to root (or vice versa)

Add to `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/(.*)$",
      "destination": "https://yourdomain.com/$1",
      "statusCode": 301
    }
  ]
}
```

(Apply from your non-preferred domain)

## Step 9: Enable Analytics & Monitoring

In Vercel dashboard:
1. Settings → Analytics
   - Web Analytics: Enable
   - Speed Insights: Enable

2. Create issues/alerts for:
   - High error rates
   - Slow page loads
   - Failed API calls

## Step 10: CI/CD & Auto-Deployment

Vercel automatically deploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update frontend"
git push origin main

# Vercel automatically deploys
# Check deployment at: https://vercel.com/dashboard
```

## Environment Variables by Deployment Type

| Environment | VITE_API_URL | Use Case |
|------------|-------------|----------|
| Development | `http://localhost:8080/api` | Local testing |
| Preview | `https://api-preview.yourdomain.com/api` | Staging/Testing |
| Production | `https://api.yourdomain.com/api` | Live application |

## Troubleshooting

### Build Fails
- Check `npm run build` locally
- Verify all dependencies in `package.json`
- Clear Vercel build cache: Settings → Advanced → Purge Cache

### API Connection Issues
- Verify `VITE_API_URL` is set correctly
- Check backend CORS allows your frontend domain
- Check browser Network tab for failed requests

### Domain Not Working
- Verify DNS records are set correctly
- Use nslookup to check propagation
- Wait up to 48 hours for DNS changes
- Clear browser cache and cookies

### 404 on SPA Routes
Vercel automatically handles SPA routing (single-page application). If not:

Add to `vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Performance Issues
- Check Vercel Speed Insights
- Enable image optimization
- Review application metrics
- Check API response times from backend

## Security Checklist

- [ ] HTTPS is enabled
- [ ] Environment variables are not exposed in client code
- [ ] VITE_API_URL is correct for each environment
- [ ] Backend CORS includes your domain
- [ ] Database credentials are only on backend
- [ ] JWT tokens are stored securely (httpOnly cookies recommended)

## Monitoring & Logging

### Frontend Errors
- View logs in Vercel dashboard
- Use browser console for client-side errors
- Implement error logging service (Sentry, LogRocket, etc.)

### API Calls
- Check Network tab in browser DevTools
- Monitor backend logs on Railway
- Implement request logging on frontend

## Next Steps

1. Deploy frontend to Vercel
2. Verify API connectivity
3. Test with your custom domain
4. Set up monitoring
5. Configure email alerts for errors
6. Document API endpoints
7. Create user documentation
