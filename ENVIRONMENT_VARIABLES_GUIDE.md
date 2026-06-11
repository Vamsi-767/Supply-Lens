# Environment Variables Configuration Guide

This guide covers all environment variables needed for development, testing, and production deployments.

## Backend (Spring Boot) - Application Configuration

### application.yml (Development/Local)

```yaml
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/inventory_db
spring.datasource.username=root
spring.datasource.password=password
```

### Environment Variables for Different Profiles

#### Local Development (.env or System Environment)
```bash
# Database
DB_URL=jdbc:mysql://localhost:3306/inventory_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=password

# JWT
JWT_SECRET=localDevSecretKeyForTesting-MinLength32CharactersRequired
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Files
FILE_UPLOAD_DIR=./uploads
FILE_DATASETS_DIR=./datasets

# Server
PORT=8080
```

#### Railway Production (Set in Railway Dashboard)
```bash
# Database (provided by Railway MySQL)
DATABASE_URL=mysql://user:password@host:3306/database
DATABASE_USER=user
DATABASE_PASSWORD=password

# JWT (Generate a strong secret key)
JWT_SECRET=YourVeryLongSecureSecretKeyWithAtLeast32CharactersForJWT
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CORS - Update with your actual domains
ALLOWED_ORIGINS=https://your-app.vercel.app,https://yourdomain.com,https://api.yourdomain.com

# Files (Railway doesn't have persistent storage, use cloud storage or /tmp)
FILE_UPLOAD_DIR=/tmp/uploads
FILE_DATASETS_DIR=/tmp/datasets

# Spring Profile
SPRING_PROFILES_ACTIVE=railway

# Port
PORT=8080
```

## Frontend (React/Vercel) - Application Configuration

### .env.local (Development)

```bash
# Local Backend
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Inventory Management System
VITE_APP_VERSION=1.0.0
```

### .env.production (Production)

```bash
# Production Backend URL (update with your actual Railway URL or custom domain)
VITE_API_URL=https://inventory-backend-production-xxxx.up.railway.app/api
# OR with custom domain:
# VITE_API_URL=https://api.yourdomain.com/api

VITE_APP_NAME=Inventory Management System
VITE_APP_VERSION=1.0.0
```

### Vercel Environment Variables (Set in Project Settings)

#### Production Environment
```bash
VITE_API_URL=https://your-railway-backend.up.railway.app/api
VITE_APP_NAME=Inventory Management System
VITE_APP_VERSION=1.0.0
```

#### Preview/Staging Environment
```bash
VITE_API_URL=https://api-staging.yourdomain.com/api
```

## Environment Variable Reference Table

### Backend Variables

| Variable | Description | Example | Required | Scope |
|----------|-------------|---------|----------|-------|
| `DB_URL` | Database connection string (dev) | `jdbc:mysql://localhost:3306/inventory_db` | Yes | Dev |
| `DATABASE_URL` | Database connection string (prod) | `mysql://user:pass@host:3306/db` | Yes | Prod |
| `DB_USERNAME` | Database username | `root` | Yes | Dev |
| `DATABASE_USER` | Database username (Railway) | `railway` | Yes | Prod |
| `DB_PASSWORD` | Database password | `password` | Yes | Dev |
| `DATABASE_PASSWORD` | Database password (Railway) | `securepwd` | Yes | Prod |
| `JWT_SECRET` | Secret key for JWT tokens | Min 32 characters | Yes | All |
| `JWT_EXPIRATION` | JWT token expiry (ms) | `86400000` (24h) | No | All |
| `JWT_REFRESH_EXPIRATION` | Refresh token expiry (ms) | `604800000` (7d) | No | All |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,https://domain.com` | Yes | All |
| `FILE_UPLOAD_DIR` | Upload directory path | `./uploads` or `/tmp/uploads` | No | All |
| `FILE_DATASETS_DIR` | Datasets directory path | `./datasets` or `/tmp/datasets` | No | All |
| `PORT` | Server port | `8080` | No | All |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `railway`, `dev`, `prod` | No | All |

### Frontend Variables

| Variable | Description | Example | Required | Scope |
|----------|-------------|---------|----------|-------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:8080/api` | Yes | All |
| `VITE_APP_NAME` | Application name | `Inventory Management System` | No | All |
| `VITE_APP_VERSION` | Application version | `1.0.0` | No | All |

## Setting Environment Variables

### Option 1: System Environment Variables (Linux/Mac)
```bash
export DB_URL="jdbc:mysql://localhost:3306/inventory_db"
export JWT_SECRET="your-secret-key"
```

### Option 2: .env File (Node.js / Frontend)
Create `.env.local` or `.env.production` file in project root.

### Option 3: Railway Dashboard
1. Go to Project Settings
2. Click "Variables"
3. Add key-value pairs
4. Redeploy application

### Option 4: Vercel Dashboard
1. Go to Project Settings
2. Click "Environment Variables"
3. Select scope (Production, Preview, Development)
4. Add variables
5. Automatic redeployment

### Option 5: Docker / Container Environment
Pass during runtime:
```bash
docker run -e DB_URL=... -e JWT_SECRET=... image-name
```

## JWT Secret Generation

Generate a strong JWT secret:

```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })) | Out-String

# Python
python3 -c "import secrets; print(secrets.token_hex(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Database Connection String Formats

### MySQL - Local Development
```
jdbc:mysql://localhost:3306/inventory_db?createDatabaseIfNotExist=true&useSSL=false
```

### MySQL - Railway
```
mysql://user:password@host.railway.internal:3306/database
```

### MySQL - Remote with SSL
```
jdbc:mysql://host:3306/database?useSSL=true&serverTimezone=UTC
```

## CORS Configuration Examples

### Development (Multiple Local Ports)
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000
```

### Production (Multiple Domains)
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com,https://your-app.vercel.app
```

### Staging & Production
```
ALLOWED_ORIGINS=https://staging.yourdomain.com,https://yourdomain.com
```

## Deployment Checklist

- [ ] All required variables are set
- [ ] Secrets are not committed to Git
- [ ] Environment variables are different for dev/prod
- [ ] Database credentials use strong passwords
- [ ] JWT_SECRET is at least 32 characters
- [ ] CORS origins are restricted to trusted domains
- [ ] API URLs are correctly configured
- [ ] File upload directories exist and have permissions
- [ ] HTTPS is enforced in production

## Troubleshooting

### Variables Not Loading
- Check spelling (case-sensitive)
- Verify variable is in correct scope
- Restart application/deployment
- Check documentation for required format

### Database Connection Fails
- Verify connection string format
- Check database server is running
- Ensure credentials are correct
- Check firewall/network access

### CORS Errors
- Verify frontend domain in ALLOWED_ORIGINS
- No trailing slashes in domains
- Multiple domains separated by commas
- Include protocol (http/https)

## Security Best Practices

1. **Never commit secrets**: Add `.env` files to `.gitignore`
2. **Use strong passwords**: Minimum 16 characters for DB passwords
3. **Rotate secrets regularly**: Change JWT_SECRET periodically
4. **Limit CORS origins**: Only allow trusted domains
5. **Use HTTPS**: Always in production
6. **Restrict environment access**: Use role-based access
7. **Audit logs**: Monitor who changed variables
8. **Use managed services**: Let Railway/Vercel handle secrets

## References

- [Spring Boot Configuration](https://spring.io/projects/spring-boot)
- [Railway Documentation](https://docs.railway.app)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MySQL Connection String](https://dev.mysql.com/doc/connector-j/en/connector-j-reference-jdbc-url-format.html)
