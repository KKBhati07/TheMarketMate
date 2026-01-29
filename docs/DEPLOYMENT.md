# MarketMate Frontend - Deployment Guide

This guide covers the deployment process for the MarketMate Angular applications (marketmate and mm-admin-portal).

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Production Build](#production-build)
- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
- [Docker Deployment](#docker-deployment)
- [Static Hosting](#static-hosting)
- [CI/CD Integration](#cicd-integration)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: LTS version (18.x or higher recommended)
- **npm**: Version 8.x or higher (comes with Node.js)
- **Nx CLI**: Optional, but recommended for better DX
  ```bash
  npm install -g nx
  ```

## Environment Configuration

### Environment Files

Each application has environment-specific configuration files:

#### MarketMate (Public App)
- **Development**: `apps/marketmate/src/environments/environment.ts`
- **Production**: `apps/marketmate/src/environments/environment.prod.ts`

#### Admin Portal
- **Development**: `apps/mm-admin-portal/src/environments/environment.ts`
- **Production**: `apps/mm-admin-portal/src/environments/environment.prod.ts`

### Environment Variables

Update the following in production environment files:

```typescript
// apps/marketmate/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.marketmate.com/api/',  // Update with your API URL
  adminAppUrl: 'https://admin.marketmate.com', // Update with admin portal URL
};
```

```typescript
// apps/mm-admin-portal/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.marketmate.com/api/',  // Update with your API URL
};
```

**⚠️ Important**: 
- Ensure API URLs are correct and include the `/api/` suffix if required
- Use HTTPS in production
- Never commit sensitive credentials to version control

---

## Build Process

### Development Build

For local development:

```bash
# Install dependencies
npm install

# Serve MarketMate app
nx serve marketmate

# Serve Admin Portal (in another terminal)
nx serve mm-admin-portal
```

Default ports:
- MarketMate: `http://localhost:4200`
- Admin Portal: `http://localhost:4201`

### Production Build

#### Build MarketMate App

```bash
# Production build with SSR
nx build marketmate --configuration=production

# Output location: dist/marketmate/
```

#### Build Admin Portal

```bash
# Production build
nx build mm-admin-portal --configuration=production

# Output location: dist/mm-admin-portal/
```

#### Build Shared Library

```bash
# Build shared library (if needed separately)
nx build mm-shared
```

### Build Output Structure

```
dist/
├── marketmate/
│   ├── browser/          # Client-side application
│   │   ├── index.html
│   │   ├── main-*.js
│   │   └── assets/
│   └── server/           # SSR server files
│       └── server.mjs
└── mm-admin-portal/
    └── browser/          # Client-side application
        ├── index.html
        ├── main-*.js
        └── assets/
```

---

## Server-Side Rendering (SSR)

The MarketMate app supports SSR for better SEO and initial load performance.

### Running SSR Locally

```bash
# Build with SSR
nx build marketmate --configuration=production

# Run SSR server
npm run serve:ssr:marketmate

# Or directly:
node dist/marketmate/server/server.mjs
```

The SSR server will start on the port specified in `server.ts` (default: 4000).

### SSR Deployment

#### Using Node.js/Express

1. **Build the application**:
   ```bash
   nx build marketmate --configuration=production
   ```

2. **Deploy the `dist/marketmate/` folder** to your server

3. **Install production dependencies** on the server:
   ```bash
   npm install --production
   ```

4. **Run the SSR server**:
   ```bash
   node dist/marketmate/server/server.mjs
   ```

5. **Use a process manager** (PM2 recommended):
   ```bash
   npm install -g pm2
   pm2 start dist/marketmate/server/server.mjs --name marketmate-ssr
   pm2 save
   pm2 startup
   ```

#### Using Docker

See [Docker Deployment](#docker-deployment) section below.

### SSR Environment Variables

Set the `PORT` environment variable to customize the server port:

```bash
export PORT=4000
node dist/marketmate/server/server.mjs
```

---

## Docker Deployment

### Building Docker Image

Create a `Dockerfile` in the project root:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npx nx build marketmate --configuration=production

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

# Start SSR server
CMD ["node", "dist/marketmate/server/server.mjs"]
```

### Building and Running

```bash
# Build Docker image
docker build -t marketmate-frontend:latest .

# Run container
docker run -p 4000:4000 \
  -e PORT=4000 \
  -e NODE_ENV=production \
  marketmate-frontend:latest
```

### Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  marketmate:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:4000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with:
```bash
docker-compose up -d
```

---

## Static Hosting

For static hosting (without SSR), deploy only the `browser` folder.

### AWS S3 + CloudFront

1. **Build the application**:
   ```bash
   nx build marketmate --configuration=production
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync dist/marketmate/browser/ s3://your-bucket-name/ --delete
   ```

3. **Configure CloudFront** to serve from S3 bucket

4. **Set up redirects** for SPA routing (redirect all requests to `index.html`)

### Netlify

1. **Build command**: `nx build marketmate --configuration=production`
2. **Publish directory**: `dist/marketmate/browser`
3. **Redirects**: Create `_redirects` file in `public` folder:
   ```
   /*    /index.html   200
   ```

### Vercel

1. **Build command**: `nx build marketmate --configuration=production`
2. **Output directory**: `dist/marketmate/browser`
3. **Framework preset**: Angular

### GitHub Pages

1. **Build the application**
2. **Deploy `dist/marketmate/browser`** to `gh-pages` branch
3. **Configure base href** in `angular.json`:
   ```json
   "baseHref": "/your-repo-name/"
   ```

## Environment Variables

### Build-Time Variables

Set these before building:

```bash
export NODE_ENV=production
export API_URL=https://api.marketmate.com/api/
```

### Runtime Variables (SSR)

For SSR deployments, set these on the server:

```bash
export PORT=4000
export NODE_ENV=production
```

### Security Considerations

- **Never commit** API keys, secrets, or credentials
- Use environment variables for sensitive data
- Use a secrets management service (AWS Secrets Manager, HashiCorp Vault, etc.) in production
- Rotate credentials regularly

---

## Troubleshooting

### Build Failures

#### Out of Memory

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
nx build marketmate --configuration=production
```

#### Module Not Found

**Error**: `Cannot find module 'xxx'`

**Solution**:
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

#### SSR Server Won't Start

**Check**:
1. Port is not already in use
2. All dependencies are installed
3. Build output exists in `dist/marketmate/server/`

**Solution**:
```bash
# Check port
lsof -i :4000

# Kill process if needed
kill -9 <PID>
```

#### CORS Errors

**Issue**: API requests blocked by CORS

**Solution**: Ensure backend CORS configuration includes your frontend domain

#### 404 Errors on Refresh (SPA)

**Issue**: Direct URL access returns 404

**Solution**: Configure server to redirect all routes to `index.html`:
- **Nginx**: Use `try_files $uri $uri/ /index.html;`
- **Apache**: Use `.htaccess` with rewrite rules
- **Express**: Use `app.get('*', ...)` fallback

### Performance Issues

#### Large Bundle Size

**Check bundle size**:
```bash
nx build marketmate --configuration=production --stats-json
npx webpack-bundle-analyzer dist/marketmate/browser/stats.json
```

**Optimize**:
- Enable lazy loading for routes
- Use tree-shaking
- Remove unused dependencies
- Consider code splitting

#### Slow Initial Load

**Solutions**:
- Enable SSR for faster first paint
- Implement lazy loading
- Optimize images (WebP, lazy loading)
- Use CDN for static assets
- Enable compression (gzip/brotli)

---

## Monitoring and Logging

### Application Monitoring

- **Error Tracking**: Integrate with Sentry, Rollbar, or similar
- **Performance Monitoring**: Use Google Analytics, New Relic, or Datadog
- **Uptime Monitoring**: Use UptimeRobot, Pingdom, or similar

### Logging

The application uses `LoggingService` for structured logging:
- Logs are written to console in development
- In production, integrate with your logging service (CloudWatch, Loggly, etc.)

---

## Rollback Procedure

If a deployment fails:

1. **Identify the issue** from logs/monitoring
2. **Revert to previous version**:
   ```bash
   git checkout <previous-commit-hash>
   nx build marketmate --configuration=production
   # Redeploy
   ```
3. **Or use blue-green deployment** strategy for zero-downtime rollbacks

---

## Additional Resources

- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Nx Documentation](https://nx.dev)
- [Angular SSR Guide](https://angular.io/guide/ssr)

---

## Support

For deployment issues or questions:
1. Check this documentation
2. Review application logs
3. Consult the main README.md
4. Contact the development team

---

**Last Updated**: 2024
**Maintained By**: MarketMate Development Team
