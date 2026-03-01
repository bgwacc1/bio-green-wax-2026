# Bio Green Wax - IONOS Deployment Guide

This guide covers how to configure and deploy the application on IONOS web hosting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [IONOS Hosting Plans](#ionos-hosting-plans)
3. [Building for Production](#building-for-production)
4. [Deploying to IONOS](#deploying-to-ionos)
5. [Domain & SSL Configuration](#domain--ssl-configuration)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Command Reference](#command-reference)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed locally
- npm or yarn package manager
- Git installed
- An IONOS hosting account
- A Supabase project with the database configured
- FTP client (FileZilla, Cyberduck, or WinSCP)

---

## IONOS Hosting Plans

### Recommended Plans for React Apps

| Plan Type | Suitable For | Features |
|-----------|--------------|----------|
| **Web Hosting Plus** | Small to medium sites | PHP, MySQL, 50GB storage |
| **Web Hosting Expert** | Production apps | Unlimited storage, SSH access |
| **Deploy Now** | Modern web apps | Git-based deployment, Node.js support |
| **VPS** | Full control | Complete server access |

**Recommendation**: Use **Deploy Now** for easiest React deployment, or **Web Hosting Expert** for traditional hosting.

---

## Building for Production

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create or update `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### Step 3: Build the Application

```bash
npm run build
```

This creates a `dist/` folder with production-ready static files.

### Step 4: Verify Build

```bash
npm run preview
```

Visit `http://localhost:4173` to verify the build works correctly.

---

## Deploying to IONOS

### Option 1: IONOS Deploy Now (Recommended for React)

IONOS Deploy Now is optimized for modern JavaScript frameworks.

#### Step 1: Connect Repository

1. Log in to your [IONOS account](https://my.ionos.com)
2. Navigate to **Hosting** → **Deploy Now**
3. Click **Add Project**
4. Connect your GitHub repository
5. Select the branch to deploy (usually `main`)

#### Step 2: Configure Build Settings

In the deployment configuration:

```yaml
# .ionos.yaml (create in project root)
distFolder: dist
setup:
  - npm install
  - npm run build
```

#### Step 3: Set Environment Variables

1. Go to **Project Settings** → **Runtime**
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

#### Step 4: Deploy

Push to your connected branch:

```bash
git add .
git commit -m "Deploy to IONOS"
git push origin main
```

Deployment will trigger automatically.

---

### Option 2: Traditional Web Hosting (FTP)

#### Step 1: Get FTP Credentials

1. Log in to [IONOS Control Panel](https://my.ionos.com)
2. Go to **Hosting** → **Your Package**
3. Click **SFTP & SSH**
4. Note your credentials:
   - Server: `access.ionos.com` or your specific server
   - Username: Your IONOS username
   - Password: Your FTP password
   - Port: 22 (SFTP) or 21 (FTP)

#### Step 2: Build the Application

```bash
npm run build
```

#### Step 3: Connect via FTP

Using FileZilla:

```
Host: sftp://access.ionos.com
Username: your-username
Password: your-password
Port: 22
```

Or using command line:

```bash
# Using SFTP
sftp username@access.ionos.com

# Once connected, upload files
put -r dist/* /
```

#### Step 4: Upload Files

1. Connect to your IONOS server
2. Navigate to the web root (usually `/` or `/htdocs`)
3. Delete existing files (backup first if needed)
4. Upload all contents from the `dist/` folder
5. Ensure `index.html` is in the root directory

#### Step 5: Configure .htaccess

Create `.htaccess` in your web root:

```apache
# Enable RewriteEngine for SPA routing
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE application/xml
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS and JavaScript
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # Fonts
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
</IfModule>

# Prevent directory listing
Options -Indexes
```

---

### Option 3: Using SSH (Web Hosting Expert or VPS)

#### Step 1: Enable SSH Access

1. Go to IONOS Control Panel
2. Navigate to **Hosting** → **SFTP & SSH**
3. Enable SSH access
4. Note your SSH credentials

#### Step 2: Connect via SSH

```bash
ssh username@access.ionos.com
# Or for VPS:
ssh root@your-server-ip
```

#### Step 3: Deploy Using rsync

From your local machine:

```bash
# Build first
npm run build

# Deploy using rsync
rsync -avz --delete \
  -e "ssh -p 22" \
  dist/ \
  username@access.ionos.com:/path/to/webroot/
```

#### Step 4: Alternative - Git Clone on Server

```bash
# SSH into server
ssh username@access.ionos.com

# Navigate to web directory
cd /path/to/webroot

# Clone repository
git clone https://github.com/your-username/your-repo.git .

# Install dependencies and build
npm install
npm run build

# Move dist contents to web root
cp -r dist/* ./
```

---

## Domain & SSL Configuration

### Step 1: Configure Domain

1. Go to IONOS Control Panel → **Domains & SSL**
2. Select your domain
3. Click **DNS Settings**
4. Add/verify these records:

```
Type    Host    Value                   TTL
A       @       [Your IONOS IP]        3600
A       www     [Your IONOS IP]        3600
CNAME   www     yourdomain.com         3600
```

### Step 2: Enable SSL Certificate

1. Go to **Domains & SSL** → **SSL Certificates**
2. Click **Add SSL Certificate**
3. Choose **Free SSL (Let's Encrypt)** or purchase premium
4. Select your domain
5. Click **Activate**

### Step 3: Force HTTPS

Add to `.htaccess`:

```apache
# Force HTTPS
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## Post-Deployment Configuration

### 1. Update Supabase Settings

In your Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `https://yourdomain.com/*`
   - `https://www.yourdomain.com/*`

### 2. Configure CORS

In Supabase **Settings** → **API**:

Add your domain to allowed origins:
- `https://yourdomain.com`
- `https://www.yourdomain.com`

### 3. Test All Functionality

```bash
# Check if site loads
curl -I https://yourdomain.com

# Check if API calls work
curl https://yourdomain.com/api/test
```

---

## Command Reference

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Type check
npx tsc --noEmit
```

### Building

```bash
# Production build
npm run build

# Preview build locally
npm run preview

# Clean build folder
rm -rf dist
```

### Deployment Commands

```bash
# Build for production
npm run build

# Deploy via rsync (SSH required)
rsync -avz --delete -e ssh dist/ user@access.ionos.com:/webroot/

# Deploy via SCP
scp -r dist/* user@access.ionos.com:/webroot/

# Deploy via SFTP (interactive)
sftp user@access.ionos.com
# Then: put -r dist/* /webroot/
```

### IONOS-Specific Commands

```bash
# Check SSH connection
ssh -v username@access.ionos.com

# Test FTP connection
ftp access.ionos.com

# Check file permissions (via SSH)
ssh username@access.ionos.com "ls -la /webroot/"
```

---

## Troubleshooting

### Common Issues

#### 1. Blank Page / White Screen

**Cause**: SPA routing not configured.

**Solution**: Verify `.htaccess` is uploaded and has correct rewrite rules.

```bash
# Check if .htaccess exists
ls -la /webroot/.htaccess
```

#### 2. 404 Errors on Page Refresh

**Cause**: Server not redirecting to `index.html`.

**Solution**:
1. Ensure mod_rewrite is enabled
2. Check `.htaccess` syntax
3. Contact IONOS support to enable mod_rewrite if needed

#### 3. Mixed Content Warnings

**Cause**: HTTP resources loaded on HTTPS page.

**Solution**: Ensure all URLs in code use HTTPS or protocol-relative URLs.

#### 4. API Calls Failing (CORS Errors)

**Cause**: Supabase CORS not configured.

**Solution**:
1. Add your domain to Supabase allowed origins
2. Check browser console for specific CORS errors

#### 5. Slow Loading Times

**Solution**:
1. Enable GZIP compression in `.htaccess`
2. Add caching headers
3. Optimize images before upload

#### 6. FTP Upload Errors

**Solution**:
```bash
# Check permissions
chmod 755 /webroot/
chmod 644 /webroot/*

# Use passive FTP mode in FileZilla:
# Edit → Settings → FTP → Passive mode
```

### Checking Logs

#### Via SSH:

```bash
# Apache error logs
tail -f /logs/error.log

# Access logs
tail -f /logs/access.log
```

#### Via IONOS Control Panel:

1. Go to **Hosting** → **Logs & Statistics**
2. Select **Error Logs** or **Access Logs**

---

## Quick Deployment Checklist

### Pre-Deployment
- [ ] Environment variables set in `.env`
- [ ] `npm run build` successful
- [ ] Build tested locally with `npm run preview`

### Deployment
- [ ] Files uploaded to web root
- [ ] `.htaccess` configured for SPA routing
- [ ] File permissions correct (755 for folders, 644 for files)

### Post-Deployment
- [ ] SSL certificate activated
- [ ] HTTPS redirect configured
- [ ] Supabase Site URL updated
- [ ] CORS settings configured
- [ ] All pages loading correctly
- [ ] Forms and API calls working
- [ ] Images and assets loading
- [ ] Mobile responsiveness verified

---

## Automated Deployment Script

Create `deploy.sh` in your project root:

```bash
#!/bin/bash

# IONOS Deployment Script
# Update these variables with your credentials

IONOS_USER="your-username"
IONOS_HOST="access.ionos.com"
REMOTE_PATH="/webroot"

echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Deploying to IONOS..."
rsync -avz --delete \
    -e "ssh -p 22" \
    dist/ \
    ${IONOS_USER}@${IONOS_HOST}:${REMOTE_PATH}/

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your site is live at https://yourdomain.com"
else
    echo "❌ Deployment failed!"
    exit 1
fi
```

Make it executable:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Support Resources

- **IONOS Help Center**: https://www.ionos.com/help/
- **IONOS Community**: https://www.ionos.com/community/
- **Supabase Docs**: https://supabase.com/docs
- **Vite Deployment Guide**: https://vitejs.dev/guide/static-deploy.html
