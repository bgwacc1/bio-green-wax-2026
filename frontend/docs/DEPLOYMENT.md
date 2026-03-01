# Bio Green Wax - Deployment Guide

This guide covers how to configure and deploy the application on Hostinger web hosting.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Building for Production](#building-for-production)
5. [Deploying to Hostinger](#deploying-to-hostinger)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed locally
- npm or yarn package manager
- Git installed
- A Hostinger hosting account (Business or higher recommended for Node.js apps)
- A Supabase project with the database configured

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd bio-green-wax
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:8080`

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | `eyJhbGciOiJIUzI1NiIs...` |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | `xxxxx` |

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon public** key

---

## Building for Production

### 1. Build the Application

```bash
npm run build
# or
yarn build
```

This creates a `dist/` folder with optimized static files.

### 2. Preview Production Build Locally

```bash
npm run preview
# or
yarn preview
```

---

## Deploying to Hostinger

### Option 1: Static Site Deployment (Recommended)

Since this is a React SPA (Single Page Application), you can deploy it as a static site.

#### Step 1: Build the Application

```bash
npm run build
```

#### Step 2: Access Hostinger File Manager

1. Log in to your Hostinger account
2. Go to **Hosting** → **Manage**
3. Click on **File Manager**

#### Step 3: Upload Files

1. Navigate to `public_html` folder
2. Delete existing files (if any)
3. Upload all contents from the `dist/` folder
4. Ensure `index.html` is in the root of `public_html`

#### Step 4: Configure .htaccess for SPA Routing

Create a `.htaccess` file in `public_html` with:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Option 2: Using Hostinger Git Deployment

#### Step 1: Connect Repository

1. Go to **Hosting** → **Manage** → **Git**
2. Connect your GitHub/GitLab repository
3. Select the branch to deploy

#### Step 2: Configure Build Settings

In Hostinger's deployment settings:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18 or higher

#### Step 3: Set Environment Variables

1. Go to **Hosting** → **Manage** → **Advanced** → **Environment Variables**
2. Add your Supabase environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`

### Option 3: Using FTP/SFTP

#### Step 1: Get FTP Credentials

1. Go to **Hosting** → **Manage** → **FTP Accounts**
2. Note down:
   - FTP Host
   - Username
   - Password
   - Port (usually 21 or 22 for SFTP)

#### Step 2: Upload via FTP Client

Using FileZilla or similar:

```bash
# Connect to:
Host: ftp.yourdomain.com
Username: your-ftp-username
Password: your-ftp-password
Port: 21
```

1. Connect to your Hostinger FTP
2. Navigate to `public_html`
3. Upload all files from local `dist/` folder

---

## Command Reference

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Run tests
npm run test

# Type checking
npx tsc --noEmit
```

### Build Commands

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Clean build folder
rm -rf dist
```

### Deployment Commands (CLI)

```bash
# Build and prepare for deployment
npm run build

# If using rsync for deployment
rsync -avz --delete dist/ user@your-server:/path/to/public_html/

# If using SCP
scp -r dist/* user@your-server:/path/to/public_html/
```

---

## Post-Deployment Configuration

### 1. Configure Custom Domain (if applicable)

1. Go to Hostinger **Domains** section
2. Point your domain to Hostinger nameservers
3. Wait for DNS propagation (up to 48 hours)

### 2. Enable SSL Certificate

1. Go to **Hosting** → **Manage** → **SSL**
2. Click **Install SSL**
3. Select your domain
4. Enable **Force HTTPS**

### 3. Configure Supabase for Production

In your Supabase dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your production domain to:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/*`

### 4. Update CORS Settings

In Supabase dashboard:

1. Go to **Settings** → **API**
2. Add your domain to allowed origins

---

## Troubleshooting

### Common Issues

#### 1. Blank Page After Deployment

**Cause**: SPA routing not configured properly.

**Solution**: Ensure `.htaccess` file is uploaded and configured correctly.

#### 2. API Calls Failing

**Cause**: Environment variables not set or CORS issues.

**Solution**:
- Verify environment variables are set correctly
- Check Supabase CORS settings
- Ensure SSL is enabled

#### 3. Assets Not Loading

**Cause**: Incorrect base path.

**Solution**: Check `vite.config.ts` base path:

```typescript
export default defineConfig({
  base: '/', // Ensure this is correct
  // ...
})
```

#### 4. 404 Errors on Page Refresh

**Cause**: Server not configured for SPA routing.

**Solution**: Verify `.htaccess` RewriteRule is working.

### Checking Logs

On Hostinger:
1. Go to **Hosting** → **Manage** → **Logs**
2. Check **Error Logs** for issues

### Performance Optimization

```bash
# Analyze bundle size
npm run build -- --report

# Check for large dependencies
npx depcheck
```

---

## Quick Deployment Checklist

- [ ] Environment variables configured
- [ ] `npm run build` completed successfully
- [ ] Files uploaded to `public_html`
- [ ] `.htaccess` file configured
- [ ] SSL certificate installed
- [ ] Supabase URL configuration updated
- [ ] Custom domain configured (if applicable)
- [ ] All pages load correctly
- [ ] Forms and API calls working
- [ ] Images and assets loading

---

## Support

For issues specific to:
- **Hostinger**: Contact Hostinger support
- **Supabase**: Check [Supabase Docs](https://supabase.com/docs)
- **Application**: Check the project's issue tracker
