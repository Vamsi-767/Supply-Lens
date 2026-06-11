# Complete Deployment Checklist

Use this checklist to ensure your application is properly configured and ready for production deployment.

## Pre-Deployment Verification

### Backend (Spring Boot + Railway)

#### Code Configuration
- [ ] Application runs locally: `mvn spring-boot:run`
- [ ] Build succeeds: `mvn clean package`
- [ ] All dependencies resolve correctly
- [ ] No hardcoded credentials in code
- [ ] Logging is set to INFO level (not DEBUG)
- [ ] All tests pass: `mvn test`

#### Configuration Files
- [ ] `application.yml` uses environment variables
- [ ] `application-railway.yml` created and configured
- [ ] Database connection string uses env vars
- [ ] JWT secret uses env var
- [ ] CORS origins use env var
- [ ] File paths use env vars

#### Security
- [ ] SecurityConfig uses dynamic CORS origins
- [ ] Password encoder is BCrypt
- [ ] JWT token expiration is set
- [ ] HTTPS is enforced (via proxy/load balancer)
- [ ] CORS is restrictive (no wildcard origins)

#### Database
- [ ] DDL-auto is set to `update`
- [ ] Migrations tested locally
- [ ] Connection pool configured
- [ ] MySQL driver added to pom.xml

### Frontend (React + Vercel)

#### Project Setup
- [ ] `package.json` created and complete
- [ ] All dependencies installed: `npm install`
- [ ] Build succeeds locally: `npm run build`
- [ ] No build errors or warnings
- [ ] `dist` folder is created and ready

#### Configuration Files
- [ ] `vite.config.js` created
- [ ] `vercel.json` created
- [ ] `index.html` created with correct structure
- [ ] `.env.local` configured for development
- [ ] `.env.production` configured for production

#### API Integration
- [ ] `src/services/api.js` created
- [ ] API client uses environment variable for URL
- [ ] Request interceptors implemented
- [ ] Error handling implemented
- [ ] JWT token injection implemented

#### Code Quality
- [ ] No console errors on build
- [ ] No hardcoded API URLs
- [ ] All imports resolved
- [ ] No unused dependencies

## Deployment Configuration

### Railway Backend

#### MySQL Database
- [ ] Database created in Railway
- [ ] Backup enabled
- [ ] Connection string obtained
- [ ] User credentials created
- [ ] Test connection successful

#### Application Deployment
- [ ] GitHub repository created
- [ ] Code pushed to main branch
- [ ] Railway project created
- [ ] MySQL service linked
- [ ] Dockerfile configured (if needed)

#### Environment Variables Set in Railway
- [ ] `DATABASE_URL` set
- [ ] `DATABASE_USER` set
- [ ] `DATABASE_PASSWORD` set
- [ ] `JWT_SECRET` set (strong, 32+ chars)
- [ ] `JWT_EXPIRATION` set (86400000)
- [ ] `JWT_REFRESH_EXPIRATION` set (604800000)
- [ ] `ALLOWED_ORIGINS` set with frontend domains
- [ ] `FILE_UPLOAD_DIR` set (/tmp/uploads)
- [ ] `FILE_DATASETS_DIR` set (/tmp/datasets)
- [ ] `SPRING_PROFILES_ACTIVE` set to `railway`
- [ ] `PORT` set to 8080

#### Deployment
- [ ] Application builds successfully on Railway
- [ ] Application starts without errors
- [ ] Logs are accessible and readable
- [ ] Health check passes: `/api/actuator/health`
- [ ] API endpoints are responding

### Vercel Frontend

#### GitHub Repository
- [ ] Frontend code pushed to GitHub
- [ ] Main branch is production-ready
- [ ] Branch protection rules set (optional)
- [ ] Deployment key configured

#### Vercel Project
- [ ] Project created in Vercel
- [ ] GitHub repository imported
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Install command: `npm ci`

#### Environment Variables Set in Vercel
- [ ] `VITE_API_URL` set for Production
- [ ] `VITE_APP_NAME` set
- [ ] `VITE_APP_VERSION` set
- [ ] Preview environment variables set (if needed)

#### Deployment
- [ ] Application builds successfully
- [ ] No build errors or warnings
- [ ] Production URL is accessible
- [ ] API calls work correctly

### GoDaddy Custom Domain

#### Domain Registration
- [ ] Domain registered with GoDaddy
- [ ] Domain registration is active
- [ ] Auto-renewal enabled

#### DNS Configuration
- [ ] CNAME records added for Vercel
- [ ] CNAME records added for Railway
- [ ] DNS propagation verified (can take 24-48 hours)
- [ ] `nslookup` shows correct records

#### Domain Linking
- [ ] Domain added to Vercel project
- [ ] Domain added to Railway project
- [ ] SSL certificate provisioned
- [ ] HTTPS is working

## Testing & Validation

### Backend Testing

- [ ] API endpoints are responding
- [ ] CORS is working from frontend domain
- [ ] Database connectivity is working
- [ ] Authentication (JWT) is working
- [ ] Create operations work
- [ ] Read operations work
- [ ] Update operations work
- [ ] Delete operations work
- [ ] Error handling returns proper status codes
- [ ] Swagger/OpenAPI is accessible
- [ ] Health endpoint is responding
- [ ] Metrics endpoint is accessible

### Frontend Testing

- [ ] Application loads in browser
- [ ] No console errors
- [ ] API calls connect to backend
- [ ] Authentication flow works
- [ ] Navigation works
- [ ] Form submissions work
- [ ] Data display is correct
- [ ] Responsive design works on mobile
- [ ] Images load correctly
- [ ] No 404 errors on routes

### End-to-End Testing

- [ ] User can register/login
- [ ] User can view data
- [ ] User can create records
- [ ] User can update records
- [ ] User can delete records
- [ ] Navigation between pages works
- [ ] Logout works
- [ ] Session timeout works
- [ ] Error messages display correctly
- [ ] Loading states show properly

## Performance & Monitoring

### Backend Monitoring

- [ ] Application logs are accessible
- [ ] Error rates are monitored
- [ ] Response times are tracked
- [ ] Database connection pool is healthy
- [ ] Memory usage is acceptable
- [ ] CPU usage is reasonable
- [ ] Disk space is monitored

### Frontend Monitoring

- [ ] Build time is acceptable
- [ ] Bundle size is optimized
- [ ] Page load time is under 3 seconds
- [ ] Time to interactive is tracked
- [ ] Error tracking is enabled (Sentry, etc.)
- [ ] User analytics are configured
- [ ] Performance metrics are collected

### Infrastructure Monitoring

- [ ] Railway project has monitoring enabled
- [ ] Vercel analytics are enabled
- [ ] Database backup status is verified
- [ ] Disk space availability is monitored
- [ ] Network connectivity is stable

## Security Review

- [ ] All secrets are in environment variables
- [ ] No credentials in source code
- [ ] No credentials in .git history
- [ ] HTTPS is enforced everywhere
- [ ] CORS is restrictive
- [ ] Database passwords are strong (16+ chars)
- [ ] JWT secret is strong (32+ chars)
- [ ] Authentication tokens have expiration
- [ ] Sensitive data is not logged
- [ ] SQL injection is prevented (using ORM)
- [ ] XSS protection is enabled
- [ ] CSRF protection is enabled
- [ ] Rate limiting is configured (optional)
- [ ] Security headers are set

## Documentation

- [ ] Deployment guide is created
- [ ] API documentation is available
- [ ] Environment variables are documented
- [ ] Troubleshooting guide is created
- [ ] Architecture diagram exists
- [ ] Database schema is documented
- [ ] User manual is created
- [ ] Admin guide is created

## Post-Deployment

- [ ] Monitor application for 24 hours
- [ ] Check logs for errors
- [ ] Verify all features work
- [ ] Test from different locations
- [ ] Test on different browsers
- [ ] Test on different devices
- [ ] Document any issues found
- [ ] Create runbook for common issues
- [ ] Set up alerts for critical errors
- [ ] Schedule regular backups
- [ ] Plan for disaster recovery

## Rollback Plan

- [ ] Know how to rollback frontend (Vercel)
- [ ] Know how to rollback backend (Railway)
- [ ] Have database backup strategy
- [ ] Document rollback procedures
- [ ] Test rollback process (in non-prod)
- [ ] Communicate rollback plan to team

## Sign-Off

- [ ] Development team approves
- [ ] Testing team approves
- [ ] DevOps team approves
- [ ] Security team approves
- [ ] Product owner approves
- [ ] All team members briefed on deployment

---

**Deployment Date**: _______________

**Deployed By**: _______________

**Verified By**: _______________

**Notes**: _______________________________________________

---

Once all items are checked, your deployment is ready for production!
