# Deployment Guide

## Overview

DeepSite is designed to be deployed as a Next.js application with MongoDB database connectivity and integration with Hugging Face Spaces for project hosting and AI model access.

## Environment Configuration

### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/deepsite
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/deepsite

# Hugging Face Integration
HF_TOKEN=hf_your_token_here                    # User's HF token for development
DEFAULT_HF_TOKEN=hf_default_token_here         # Fallback token for anonymous users

# Authentication (if implemented)
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.com

# Optional: Analytics
PLAUSIBLE_DOMAIN=your-domain.com
```

### Development Environment Setup

```bash
# Clone repository
git clone <repository-url>
cd deepsite

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

## Production Deployment Options

### 1. Vercel Deployment (Recommended)

DeepSite is optimized for Vercel deployment with automatic CI/CD.

**Steps:**
1. **Connect Repository**: Link GitHub repository to Vercel
2. **Environment Variables**: Configure in Vercel dashboard
3. **Database**: Use MongoDB Atlas for production
4. **Domain**: Configure custom domain if needed

**Vercel Configuration** (`vercel.json`):
```json
{
  "builds": [
    {
      "src": "next.config.ts",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

**Environment Variables in Vercel:**
```bash
MONGODB_URI=mongodb+srv://...
HF_TOKEN=hf_...
DEFAULT_HF_TOKEN=hf_...
```

### 2. Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/deepsite
      - HF_TOKEN=${HF_TOKEN}
      - DEFAULT_HF_TOKEN=${DEFAULT_HF_TOKEN}
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=deepsite

volumes:
  mongo_data:
```

**Build and Run:**
```bash
# Build image
docker build -t deepsite .

# Run with Docker Compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 -e MONGODB_URI=... -e HF_TOKEN=... deepsite
```

### 3. Traditional VPS Deployment

**Server Requirements:**
- Node.js 18+
- MongoDB 6+
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

**Setup Steps:**

1. **Install Dependencies:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm mongodb nginx certbot

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

2. **Application Setup:**
```bash
# Clone and build
git clone <repository-url> /var/www/deepsite
cd /var/www/deepsite
npm install
npm run build

# Set up environment
sudo nano .env.production
# Add environment variables

# Create systemd service
sudo nano /etc/systemd/system/deepsite.service
```

3. **Systemd Service** (`/etc/systemd/system/deepsite.service`):
```ini
[Unit]
Description=DeepSite Next.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/deepsite
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

4. **Nginx Configuration** (`/etc/nginx/sites-available/deepsite`):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **SSL Setup:**
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/deepsite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Start application
sudo systemctl enable deepsite
sudo systemctl start deepsite
```

## Database Setup

### MongoDB Atlas (Cloud)

1. **Create Cluster**: Sign up at MongoDB Atlas
2. **Configure Access**: Add IP whitelist and create user
3. **Get Connection String**: Copy connection string
4. **Update Environment**: Set `MONGODB_URI`

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/deepsite?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

**Installation:**
```bash
# Ubuntu/Debian
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
> use deepsite
> db.createUser({
    user: "deepsite_user",
    pwd: "secure_password",
    roles: [{ role: "readWrite", db: "deepsite" }]
  })
```

**Connection String:**
```
mongodb://deepsite_user:secure_password@localhost:27017/deepsite
```

## Hugging Face Integration

### API Token Setup

1. **Create Account**: Sign up at Hugging Face
2. **Generate Token**: Go to Settings > Access Tokens
3. **Set Permissions**: Enable write access for Spaces
4. **Configure Environment**: Set `HF_TOKEN` and `DEFAULT_HF_TOKEN`

### Space Creation Configuration

The application automatically creates Spaces with this configuration:

```yaml
# Automatically generated in deployed spaces
title: "Generated Website"
emoji: 🚀
colorFrom: blue
colorTo: purple
sdk: static
pinned: false
```

## Performance Optimization

### Next.js Optimization

**Next.js Config** (`next.config.ts`):
```typescript
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    serverActions: true,
  },
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};
```

### CDN Configuration

**Vercel (Automatic):**
- Global CDN included
- Automatic image optimization
- Edge function deployment

**CloudFlare Setup:**
```bash
# Add CloudFlare proxy
# Configure caching rules
# Enable Brotli compression
# Set up WAF rules
```

### Database Optimization

**MongoDB Indexes:**
```javascript
// Create indexes for better performance
db.projects.createIndex({ "user_id": 1, "_createdAt": -1 })
db.projects.createIndex({ "space_id": 1 }, { unique: true })
```

## Monitoring and Logging

### Error Tracking

**Sentry Integration:**
```bash
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

**Sentry Config** (`sentry.client.config.js`):
```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Analytics

**Plausible Analytics** (already configured):
```html
<!-- Automatically included in layout.tsx -->
<Script
  defer
  data-domain="your-domain.com"
  src="https://plausible.io/js/script.js"
/>
```

### Health Checks

**API Health Endpoint** (`app/api/health/route.ts`):
```typescript
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy', error: error.message }, { status: 500 });
  }
}
```

## Security Considerations

### Environment Security
- Never commit `.env` files
- Use secure environment variable storage
- Rotate API tokens regularly
- Implement proper CORS policies

### Rate Limiting
- Built-in IP-based rate limiting
- Consider implementing Redis for distributed rate limiting
- Monitor for abuse patterns

### Content Security Policy

**CSP Headers** (add to `next.config.ts`):
```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.tailwindcss.com plausible.io; style-src 'self' 'unsafe-inline';"
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Scaling Considerations

### Horizontal Scaling
- Stateless application design
- Database connection pooling
- Load balancer configuration
- Session storage externalization

### Caching Strategy
- Redis for session storage
- CDN for static assets
- API response caching
- Database query optimization

### Background Jobs
- Consider implementing job queues for:
  - Space creation
  - Large file processing
  - Analytics processing
  - Email notifications

## Troubleshooting

### Common Issues

**MongoDB Connection:**
```bash
# Check connection
curl -X GET http://localhost:3000/api/health

# Check MongoDB status
sudo systemctl status mongodb
```

**Build Issues:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check dependencies
npm audit
npm update
```

**Environment Variables:**
```bash
# Verify environment loading
console.log(process.env.MONGODB_URI);
```

### Log Analysis
- Check application logs: `sudo journalctl -u deepsite -f`
- Monitor MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
- Nginx logs: `sudo tail -f /var/log/nginx/access.log`