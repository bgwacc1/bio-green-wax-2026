# Bio Green Wax - Complete Deployment Guide

A multilingual e-commerce platform for Bio Green Wax Ltd, featuring a React + TypeScript frontend and PHP API backend. Supports 16 languages with AI-powered translation via OpenAI.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Step 1: Build the Frontend](#step-1-build-the-frontend)
- [Step 2: Create the Database Schema](#step-2-create-the-database-schema)
- [Step 3: Import Data](#step-3-import-data)
- [Step 4: Configure the API](#step-4-configure-the-api)
- [Step 5: Prepare Upload Structure](#step-5-prepare-upload-structure)
- [Deploy to Ionos](#deploy-to-ionos)
- [Deploy to Hostinger](#deploy-to-hostinger)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Admin Panel Guide](#admin-panel-guide)
- [Troubleshooting](#troubleshooting)
- [Quick Commands Reference](#quick-commands-reference)
- [Production Update: February 14, 2026 Fixes](#production-update-february-14-2026-fixes)

---

## Project Overview

| Component | Technology |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI |
| Backend | PHP 8.3+ with PDO (single file API) |
| Database | MySQL 5.7+ / MariaDB 10.3+ |
| Authentication | JWT with bcrypt password hashing |
| Languages | 16 languages with OpenAI auto-translation |
| Analytics | Self-hosted, privacy-compliant visitor tracking |
| SEO | Dynamic meta tags, structured data, sitemap, hreflang |

### Supported Languages

English (default), Chinese, Spanish, French, Arabic (RTL), Portuguese, Russian, German, Japanese, Swahili, Turkish, Vietnamese, Korean, Thai, Italian, Polish

### Key Features

- Product catalog with categories, specifications, and PDF datasheets
- Hero image slideshow on homepage
- Industry sectors pages
- News/blog articles
- Company certifications
- Job openings and applications
- Contact form with enquiry management
- Newsletter subscription system
- Admin CMS panel with content creator workflow
- SEO keywords management and page meta overrides
- Website analytics dashboard
- Automatic AI-powered content translation to 15 languages

---

## Project Structure

```
bio-green-wax/
├── frontend/                  # React frontend source code
│   ├── src/                   # Source files
│   │   ├── components/        # React components (admin/, home/, layout/)
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom hooks (useCMS, useAuth, etc.)
│   │   ├── i18n/              # Translation files for 16 languages
│   │   ├── lib/               # API client, utilities
│   │   └── assets/            # Logo, images
│   ├── public/                # Static public files
│   └── dist/                  # Built files (created after npm run build)
├── api/                       # PHP API backend
│   ├── index.php              # Main API file (all endpoints)
│   └── .htaccess              # API URL rewriting rules
├── database/                  # Database files
│   ├── mysql_schema.sql       # Complete table structure (192 tables)
│   └── mysql_data_export.sql  # Sample data with all content
├── deploy/                    # Deployment configuration templates
│   ├── .htaccess              # Root Apache rewrite rules
│   └── api/
│       └── config.php         # Database config template
└── translation-service/       # OpenAI translation service (development only)
```

### Database Tables (192 total)

**Core Tables (27):**

| Table | Purpose |
|-------|---------|
| `users` | Admin and content creator accounts |
| `user_roles` | Role-based access control (admin, content_creator) |
| `products` | Product catalog (master table, English) |
| `product_categories` | Product category management |
| `product_specifications` | Product PDF datasheets and spec files |
| `sectors` | Industry sectors |
| `hero_slides` | Homepage carousel images |
| `news_articles` | News/blog posts |
| `certifications` | Company certifications |
| `job_openings` | Career listings |
| `job_applications` | Job application submissions |
| `contact_enquiries` | Contact form submissions |
| `contact_info` | Company contact details |
| `newsletter_subscribers` | Email newsletter subscriptions |
| `site_content` | Generic page content blocks |
| `about_us_content` | About Us page content |
| `directors` | Company directors |
| `global_operations` | Global operations locations |
| `seo_keywords` | SEO keyword tracking |
| `seo_keyword_products` | Product-to-keyword mapping |
| `seo_page_meta` | Per-page SEO meta overrides |
| `visitor_sessions` | Analytics visitor sessions |
| `page_views` | Analytics page view tracking |
| `pending_changes` | Content creator approval workflow |
| `translations` | Legacy translations table |
| `ui_translations` | UI string translations |
| `supported_languages` | Language configuration |

**Language-Specific Tables (165):**

11 translatable entities x 15 languages = 165 tables. Each follows the naming pattern `{entity}_{lang_code}` (e.g., `products_de`, `sectors_fr`, `hero_slides_ar`).

Translatable entities: `products`, `product_categories`, `hero_slides`, `sectors`, `certifications`, `news_articles`, `job_openings`, `about_us_content`, `directors`, `global_operations`, `contact_info`

Language codes: `zh`, `es`, `fr`, `ar`, `pt`, `ru`, `de`, `ja`, `sw`, `tr`, `vi`, `ko`, `th`, `it`, `pl`

---

## Prerequisites

### For Building (Development Machine)

- Node.js 18 or higher
- npm (comes with Node.js)

### For Hosting (Ionos or Hostinger)

- PHP 8.3 or higher
- MySQL 5.7+ or MariaDB 10.3+
- Apache with `mod_rewrite` enabled
- FTP/SFTP client ([FileZilla](https://filezilla-project.org/) recommended)
- phpMyAdmin access (provided by both hosts)

---

## Step 1: Build the Frontend

The React frontend must be compiled into static HTML/CSS/JS files before deployment.

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build production files
npm run build
```

After building, the `frontend/dist/` folder will contain:

```
dist/
├── index.html          # Main HTML entry point
├── favicon.ico         # Site favicon
├── logo.png            # Company logo (for SEO)
├── og-image.png        # Social media sharing image
├── assets/             # Compiled JS, CSS, fonts
│   ├── index-XXXXX.js
│   ├── index-XXXXX.css
│   └── ...
└── (other static files)
```

Verify the build succeeded:

```bash
ls -la dist/
# Should show index.html, assets/ folder, favicon.ico, etc.
```

---

## Step 2: Create the Database Schema

The database schema file (`database/mysql_schema.sql`) creates all 192 tables needed by the application. This must be run before importing data.

### Option A: Using phpMyAdmin (Recommended)

1. Log into your hosting control panel
2. Open **phpMyAdmin**
3. Select your database from the left sidebar
4. Click the **Import** tab
5. Click **Choose File** and select `database/mysql_schema.sql`
6. Scroll down and click **Go**
7. Wait for the import to complete (may take 30-60 seconds for 192 tables)

### Option B: Using MySQL Command Line

```bash
# Connect to your MySQL database
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p YOUR_DB_NAME < database/mysql_schema.sql
```

### Option C: Copy/Paste into phpMyAdmin SQL Tab

If the file is too large to upload:

1. Open `database/mysql_schema.sql` in a text editor
2. Copy the entire contents
3. In phpMyAdmin, click the **SQL** tab
4. Paste the SQL and click **Go**

**Note:** If you get a timeout error, split the file and run it in sections. The core tables should be created first, then the language-specific tables.

### Verify Schema Creation

After importing, check that all tables were created:

```sql
-- Run this in phpMyAdmin SQL tab
SELECT COUNT(*) AS table_count FROM information_schema.tables 
WHERE table_schema = DATABASE();
-- Should return: 192
```

---

## Step 3: Import Data

The data export file (`database/mysql_data_export.sql`) contains all the product catalog, company information, hero slides, news articles, and other content.

### Option A: Using phpMyAdmin

1. In phpMyAdmin, click the **Import** tab
2. Click **Choose File** and select `database/mysql_data_export.sql`
3. **Important:** Before clicking Go, increase the timeout if available:
   - Set max execution time to 300 seconds if the option is shown
4. Click **Go**

### Option B: Using MySQL Command Line

```bash
mysql -h YOUR_DB_HOST -u YOUR_DB_USER -p YOUR_DB_NAME < database/mysql_data_export.sql
```

### Option C: Copy/Paste in Sections

If the file is too large (the data file is ~3,100 lines):

1. Open `database/mysql_data_export.sql` in a text editor
2. Copy sections at a time (500-1000 lines)
3. Paste into phpMyAdmin SQL tab and execute
4. Repeat until all data is imported

### Verify Data Import

```sql
-- Check products were imported
SELECT COUNT(*) FROM products;
-- Should return: 36

-- Check hero slides
SELECT COUNT(*) FROM hero_slides;
-- Should return: 5

-- Check admin user exists
SELECT email FROM users;
-- Should show: admin@biogreenwax.com
```

---

## Step 4: Configure the API

Create the database configuration file that connects your PHP API to the MySQL database.

### Create `api/config.php`

Copy the template from `deploy/api/config.php` and update with your database credentials:

```php
<?php
// Database Configuration
define('MYSQL_HOST', 'YOUR_DB_HOST');       // See hosting-specific section below
define('MYSQL_USER', 'YOUR_DB_USER');       // Your database username
define('MYSQL_PASSWORD', 'YOUR_DB_PASS');   // Your database password
define('MYSQL_DATABASE', 'YOUR_DB_NAME');   // Your database name

// JWT Secret - MUST be changed to a unique random string
define('JWT_SECRET', 'CHANGE-THIS-TO-A-RANDOM-64-CHARACTER-STRING');

// Production settings - hide errors from visitors
error_reporting(0);
ini_set('display_errors', 0);
```

### Generate a JWT Secret

The JWT secret is used to secure admin login sessions. Generate a random one:

```bash
# On Linux/Mac terminal:
openssl rand -hex 32

# Or use an online generator:
# https://randomkeygen.com/
```

Copy the generated string and paste it as the `JWT_SECRET` value.

---

## Step 5: Prepare Upload Structure

Create a folder on your computer with the following structure. This is what you will upload to the web server.

```
upload-folder/
├── .htaccess                  ← Copy from deploy/.htaccess
├── index.html                 ← Copy from frontend/dist/index.html
├── favicon.ico                ← Copy from frontend/dist/favicon.ico
├── logo.png                   ← Copy from frontend/dist/logo.png
├── og-image.png               ← Copy from frontend/dist/og-image.png
├── assets/                    ← Copy ENTIRE folder from frontend/dist/assets/
│   ├── index-XXXXX.js
│   ├── index-XXXXX.css
│   └── (all other files)
└── api/
    ├── .htaccess              ← Copy from api/.htaccess
    ├── config.php             ← Your configured file from Step 4
    └── index.php              ← Copy from api/index.php
```

### Files Checklist

| File/Folder | Source | Required |
|-------------|--------|----------|
| `.htaccess` | `deploy/.htaccess` | Yes |
| `index.html` | `frontend/dist/index.html` | Yes |
| `favicon.ico` | `frontend/dist/favicon.ico` | Yes |
| `logo.png` | `frontend/dist/logo.png` | Yes (SEO) |
| `og-image.png` | `frontend/dist/og-image.png` | Yes (social sharing) |
| `assets/` | `frontend/dist/assets/` (entire folder) | Yes |
| `api/.htaccess` | `api/.htaccess` | Yes |
| `api/config.php` | Your configured copy | Yes |
| `api/index.php` | `api/index.php` | Yes |

### Root `.htaccess` Explained

The root `.htaccess` file (from `deploy/.htaccess`) handles:
- Routing API requests to `api/index.php`
- Serving static files (JS, CSS, images) directly
- Redirecting all other requests to `index.html` (React SPA routing)
- GZIP compression for faster loading
- Cache headers for static assets

### API `.htaccess` Explained

The `api/.htaccess` file routes all API requests to `index.php`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

---

## Deploy to Ionos

### Ionos Step 1: Create MySQL Database

1. Log into [Ionos Control Panel](https://my.ionos.com)
2. Go to **Hosting** → **Databases** → **MySQL**
3. Click **Create Database**
4. Set a secure password
5. Note down these credentials:

| Setting | Example Value | Where to Find |
|---------|--------------|---------------|
| **Host** | `dbXXXXXXXX.hosting-data.io` | Shown after creation |
| **Database Name** | `dbXXXXXXXX` | Shown after creation |
| **Username** | `dbXXXXXXXX` | Same as database name |
| **Password** | (your chosen password) | Set during creation |

**Important:** Ionos does NOT use `localhost` as the database host. It uses a specific hostname like `db12345678.hosting-data.io`.

### Ionos Step 2: Import Database Schema and Data

1. In Ionos Control Panel, click **phpMyAdmin** next to your database
2. Select your database from the left sidebar
3. Click **Import** tab
4. Upload `database/mysql_schema.sql` → Click **Go** → Wait for completion
5. Upload `database/mysql_data_export.sql` → Click **Go** → Wait for completion

If phpMyAdmin times out on import:
- Go to the **SQL** tab instead
- Copy/paste the SQL content in sections
- Execute each section separately

### Ionos Step 3: Configure API

Create `api/config.php` with your Ionos credentials:

```php
<?php
define('MYSQL_HOST', 'dbXXXXXXXX.hosting-data.io');  // Your Ionos DB host
define('MYSQL_USER', 'dbXXXXXXXX');                   // Your DB username
define('MYSQL_PASSWORD', 'your-password-here');        // Your DB password
define('MYSQL_DATABASE', 'dbXXXXXXXX');               // Your DB name

define('JWT_SECRET', 'your-generated-64-char-random-string-here');

error_reporting(0);
ini_set('display_errors', 0);
```

### Ionos Step 4: Upload Files via SFTP

1. Download [FileZilla](https://filezilla-project.org/) if not already installed
2. Get your SFTP credentials from Ionos Control Panel:
   - Go to **Hosting** → **SFTP & SSH**
   - Note your SFTP host, username, and password
3. Connect in FileZilla:
   - **Host**: `sftp://your-domain.com` (or the SFTP host shown in panel)
   - **Username**: Your SFTP username
   - **Password**: Your SFTP password
   - **Port**: `22`
4. Navigate to your web root directory (usually `/` or `/htdocs/`)
5. Upload all files from your prepared upload folder (see Step 5 above)
6. **Make sure hidden files are uploaded** - `.htaccess` files may be hidden by default in your file manager

### Ionos Step 5: Set PHP Version

1. Go to **Hosting** → **PHP Version**
2. Select **PHP 8.3** or higher
3. Click **Save**

### Ionos Step 6: Verify Deployment

Test these URLs in your browser:

| URL | Expected Result |
|-----|-----------------|
| `https://yourdomain.com` | Homepage loads with hero slideshow |
| `https://yourdomain.com/api/health` | `{"status":"healthy","message":"Bio Green Wax API"}` |
| `https://yourdomain.com/products` | Products page with 36 products |
| `https://yourdomain.com/de/products` | German products page |
| `https://yourdomain.com/admin/login` | Admin login page |

---

## Deploy to Hostinger

### Hostinger Step 1: Create MySQL Database

1. Log into [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Databases** → **MySQL Databases**
3. Enter a database name (e.g., `biogreenwax`)
4. Set a secure password
5. Click **Create**
6. Note down these credentials:

| Setting | Example Value | Where to Find |
|---------|--------------|---------------|
| **Host** | `localhost` | Always `localhost` on Hostinger |
| **Database Name** | `uXXXXXXXX_biogreenwax` | Shown after creation (prefixed with account ID) |
| **Username** | `uXXXXXXXX_biogreenwax` | Same as database name |
| **Password** | (your chosen password) | Set during creation |

**Important:** Hostinger uses `localhost` as the database host (unlike Ionos).

### Hostinger Step 2: Import Database Schema and Data

1. In hPanel, go to **Databases** → click **phpMyAdmin** next to your database
2. Select your database from the left sidebar
3. Click **Import** tab
4. Upload `database/mysql_schema.sql` → Click **Go** → Wait for completion
5. Upload `database/mysql_data_export.sql` → Click **Go** → Wait for completion

**Hostinger phpMyAdmin tip:** If the import file is too large, Hostinger allows increasing the upload limit:
- Go to **Advanced** → **PHP Configuration**
- Increase `upload_max_filesize` to `64M`
- Increase `post_max_size` to `64M`
- Save and retry the import

### Hostinger Step 3: Configure API

Create `api/config.php` with your Hostinger credentials:

```php
<?php
define('MYSQL_HOST', 'localhost');                      // Hostinger uses localhost
define('MYSQL_USER', 'uXXXXXXXX_biogreenwax');         // Your DB username
define('MYSQL_PASSWORD', 'your-password-here');         // Your DB password
define('MYSQL_DATABASE', 'uXXXXXXXX_biogreenwax');     // Your DB name

define('JWT_SECRET', 'your-generated-64-char-random-string-here');

error_reporting(0);
ini_set('display_errors', 0);
```

### Hostinger Step 4: Upload Files

**Option A: Hostinger File Manager (for small uploads)**

1. In hPanel, go to **Files** → **File Manager**
2. Navigate to `public_html/`
3. Delete any existing default files (`index.html`, etc.)
4. Upload files using the upload button or drag & drop
5. For the `assets/` and `api/` folders, create them first, then upload contents

**Option B: FTP Client (Recommended for all files)**

1. In hPanel, go to **Files** → **FTP Accounts**
2. Create an FTP account or note existing credentials
3. Connect with FileZilla:
   - **Host**: `ftp.yourdomain.com` (or IP shown in panel)
   - **Username**: Your FTP username
   - **Password**: Your FTP password
   - **Port**: `21`
4. Navigate to `public_html/`
5. Upload all files from your prepared upload folder
6. **Make sure `.htaccess` files are uploaded** (they may be hidden)

### Hostinger Step 5: Set PHP Version

1. In hPanel, go to **Advanced** → **PHP Configuration**
2. Select **PHP 8.3** or higher from the dropdown
3. Also ensure these PHP settings are enabled:
   - `pdo_mysql` extension: **Enabled**
   - `mod_rewrite`: **Enabled** (usually enabled by default)
4. Click **Save**

### Hostinger Step 6: Enable SSL (Free)

1. In hPanel, go to **Security** → **SSL**
2. Click **Install SSL** for your domain
3. Wait for SSL certificate to be issued (may take up to 24 hours)

### Hostinger Step 7: Verify Deployment

Test these URLs in your browser:

| URL | Expected Result |
|-----|-----------------|
| `https://yourdomain.com` | Homepage loads with hero slideshow |
| `https://yourdomain.com/api/health` | `{"status":"healthy","message":"Bio Green Wax API"}` |
| `https://yourdomain.com/products` | Products page with 36 products |
| `https://yourdomain.com/ar/products` | Arabic products page (right-to-left) |
| `https://yourdomain.com/admin/login` | Admin login page |

---

## Post-Deployment Checklist

### 1. First Login

The sample data includes a default admin account:

| Field | Value |
|-------|-------|
| Login URL | `https://yourdomain.com/admin/login` |
| Email | `admin@biogreenwax.com` |
| Password | `Admin123!` |

**Change this password immediately after first login!**

There is also a content creator test account:

| Field | Value |
|-------|-------|
| Email | `content.creator@biogreenwax.com` |
| Password | `Creator123!` |

### 2. Security Checklist

- [ ] Change default admin password
- [ ] Change default content creator password
- [ ] Verify `JWT_SECRET` in `config.php` is a unique random string (not the placeholder)
- [ ] Verify `error_reporting(0)` is set in `config.php` (hides errors from visitors)
- [ ] Enable SSL/HTTPS on your domain
- [ ] Remove or change test user accounts

### 3. Verify All Features

- [ ] Homepage loads with hero slideshow cycling through images
- [ ] Products page shows all 36 products with images
- [ ] Individual product pages load when clicking a product
- [ ] Sectors dropdown shows all 10 industry sectors
- [ ] News page displays articles
- [ ] Certifications page loads
- [ ] Careers page shows job openings
- [ ] Contact form can be submitted
- [ ] Language switcher works (try German `/de/`, Arabic `/ar/`, Chinese `/zh/`)
- [ ] Admin login works
- [ ] Admin can edit products, hero slides, news, etc.

### 4. Enable HTTPS

**Ionos:**
1. Go to **Domains & SSL** → **SSL Certificates**
2. Enable free SSL for your domain

**Hostinger:**
1. Go to **Security** → **SSL**
2. Enable free SSL certificate

### 5. Update Domain References

If your domain is different from `biogreenwax.com`, update the SEO component in `frontend/src/components/SEO.tsx` before building:
- Search for `biogreenwax.com` and replace with your domain
- Rebuild the frontend (`npm run build`)
- Re-upload the `dist/` files

---

## Admin Panel Guide

Access the admin panel at `https://yourdomain.com/admin/login`

### Admin Features

| Section | What You Can Do |
|---------|----------------|
| **Hero Slides** | Add, edit, delete homepage slideshow images |
| **Products** | Manage product catalog (name, description, image, specs) |
| **Product Categories** | Create and manage product categories |
| **Specifications** | Upload product datasheets (PDF files up to 50MB) |
| **Sectors** | Manage industry sector pages |
| **News** | Write and publish news articles |
| **Certifications** | Manage company certifications |
| **Job Openings** | Post and manage career listings |
| **Contact Info** | Update company contact details |
| **Newsletter** | View subscribers and export CSV |
| **SEO Keywords** | Manage SEO keywords and page meta |
| **Analytics** | View website visitor statistics |
| **Contact Enquiries** | View and manage contact form submissions |
| **Job Applications** | View submitted job applications |

### Content Creator Workflow

Content creators (non-admin users) can propose changes that require admin approval:

1. Content creator logs in and edits content
2. Changes are saved as "pending" and do not go live
3. Admin reviews pending changes in the admin panel
4. Admin approves or rejects each change
5. Approved changes are automatically applied to the live site

### Translation System

When you add or edit content in English:
1. The content is marked as "not synchronized"
2. The translation service detects unsynchronized content
3. It uses OpenAI to translate content into all 15 other languages
4. Translated content is stored in language-specific tables
5. The content is marked as "synchronized"

**Note:** The translation service requires an OpenAI API key and is intended for development environments. On production, you can run translations manually or set up a cron job.

---

## Troubleshooting

### 500 Internal Server Error

1. **Check PHP version** - Must be 8.3 or higher
2. **Check `.htaccess` files** - Both root and `api/.htaccess` must be uploaded
3. **Check file permissions**:
   - Files: `644` (readable by web server)
   - Folders: `755` (accessible by web server)
4. **Check error logs** - Available in hosting control panel
5. **Verify `config.php`** - Check for syntax errors (missing semicolons, unclosed quotes)

### Database Connection Error

1. **Verify credentials** in `api/config.php`
2. **Check database host**:
   - Ionos: `dbXXXXXXXX.hosting-data.io` (NOT `localhost`)
   - Hostinger: `localhost`
3. **Check database exists** - Open phpMyAdmin and verify tables are present
4. **Check PHP extensions** - `pdo_mysql` must be enabled

### API Returns 404 for All Endpoints

1. Check `api/.htaccess` exists and was uploaded
2. Verify `mod_rewrite` is enabled on your hosting
3. Check `api/index.php` was uploaded
4. Try accessing `https://yourdomain.com/api/index.php` directly

### Homepage Loads But Pages Show 404

1. Check root `.htaccess` was uploaded (may be hidden)
2. Verify the rewrite rules redirect to `index.html`
3. Contact hosting support to confirm `mod_rewrite` is enabled

### Images Not Loading

1. Check `assets/` folder was uploaded completely
2. Verify image files exist in the database (some images are stored as base64)
3. Check browser developer tools (F12 → Network tab) for failed requests
4. Clear browser cache and try again

### Language Routes Not Working

1. Ensure root `.htaccess` redirects all routes to `index.html`
2. Test directly: `https://yourdomain.com/de/`, `/zh/`, `/es/`, `/ar/`
3. Arabic (`/ar/`) should display right-to-left text

### Admin Login Not Working

1. Check the API health endpoint: `https://yourdomain.com/api/health`
2. If API returns errors, fix database connection first
3. Verify the `users` table has the admin account
4. Try resetting the password via phpMyAdmin:

```sql
-- Reset admin password to 'Admin123!'
UPDATE users SET password_hash = '$2y$10$YourNewBcryptHash' WHERE email = 'admin@biogreenwax.com';
```

### CSS/JS Not Loading (Blank White Page)

1. Check `assets/` folder was uploaded with all files
2. Open browser developer tools (F12) → Console tab for errors
3. Check Network tab for 404 errors on `.js` or `.css` files
4. Ensure the `assets/` folder structure matches `frontend/dist/assets/`

### phpMyAdmin Import Timeout

If the SQL files are too large to import in one go:

1. **Split the schema file**: Import core tables first, then language tables
2. **Increase PHP limits** (if possible in hosting panel):
   - `max_execution_time`: `300`
   - `upload_max_filesize`: `64M`
3. **Use command line** if SSH access is available:
   ```bash
   mysql -h HOST -u USER -p DATABASE < database/mysql_schema.sql
   mysql -h HOST -u USER -p DATABASE < database/mysql_data_export.sql
   ```

---

## Quick Commands Reference

```bash
# Install frontend dependencies
cd frontend && npm install

# Build frontend for production
cd frontend && npm run build

# Generate a JWT secret
openssl rand -hex 32

# Test API locally (development)
curl http://localhost:8080/api/health

# Check product count
curl http://localhost:8080/api/products?active_only=true | jq length

# Zip everything for upload
mkdir -p upload && cp deploy/.htaccess upload/ && cp -r frontend/dist/* upload/ && mkdir -p upload/api && cp api/index.php api/.htaccess upload/api/ && echo "Don't forget to add config.php to upload/api/"

# Verify table count in MySQL
mysql -h HOST -u USER -p -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='YOUR_DB'" YOUR_DB
```

---

## Hosting Comparison: Ionos vs Hostinger

| Feature | Ionos | Hostinger |
|---------|-------|-----------|
| Database Host | `dbXXXXXX.hosting-data.io` | `localhost` |
| Web Root | `/` or `/htdocs/` | `public_html/` |
| File Upload | SFTP (port 22) | FTP (port 21) or File Manager |
| PHP Config | Hosting → PHP Version | Advanced → PHP Configuration |
| phpMyAdmin | Next to database in panel | Databases → phpMyAdmin |
| SSL Setup | Domains & SSL → SSL Certificates | Security → SSL |
| SSH Access | Available on some plans | Available on Business+ plans |

---

## Support

For hosting-specific issues:
- [Ionos Help Center](https://www.ionos.com/help/)
- [Hostinger Knowledge Base](https://support.hostinger.com/)

For application issues, check the error logs in your hosting control panel under:
- **Ionos**: Hosting → Error Log
- **Hostinger**: Advanced → Error Log

---

## Production Update: February 14, 2026 Fixes

This section documents all changes made on February 14, 2026 that need to be deployed to production. These are critical fixes for image handling, data integrity, and content management.

### Summary of Changes

| Change | Impact | Files Affected |
|--------|--------|----------------|
| Image storage converted from base64 to file-based | Faster page loading, smaller database | `api/index.php` |
| Boolean field fix for all content types | Fixes active/published toggles in admin panel | `api/index.php` |
| Image preservation on content updates | Prevents accidental image deletion when editing | `api/index.php` |
| Content creator workflow image support | Images saved as files in approval workflow | `api/index.php` |
| Frontend API client fix | Dev/production environment routing | `frontend/src/lib/api.ts` |

### Detailed Change Descriptions

#### 1. Base64 to File-Based Image Storage

**Problem:** Uploaded images were stored as base64-encoded strings in the database, causing slow page loads and large database size.

**Fix:** A new `saveBase64ImageToFile()` function now converts uploaded images to actual files saved on the server. The database only stores the file path (e.g., `/uploads/products/sunflower-oil.jpeg`).

**Affected content types:** Hero Slides, Products, Sectors, Certifications, News Articles, Directors

#### 2. Boolean Field Conversion Fix

**Problem:** JavaScript sends `true`/`false` as boolean values, but MySQL/PostgreSQL expects `1`/`0` integers. This caused "active" and "published" toggles to not save correctly.

**Fix:** All create (POST) and update (PUT) endpoints now explicitly convert boolean values using:
```php
$isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
```

**Affected endpoints (12 total):**
- Product Categories: POST and PUT
- Sectors: POST and PUT
- Certifications: POST and PUT
- News Articles: POST and PUT (`is_published`)
- Job Openings: POST and PUT
- Hero Slides: POST and PUT
- Products: POST and PUT

#### 3. Image Preservation on Updates

**Problem:** When editing content (e.g., changing a product name) without uploading a new image, the existing image was being cleared from the database.

**Fix:** All PUT (update) endpoints now check if a new image was provided. If not, they fetch and preserve the existing image path from the database.

**Affected endpoints:** Hero Slides, Products, Sectors, Certifications, News Articles, Directors

#### 4. Content Creator Workflow Image Support

**Problem:** When content creators submitted changes through the approval workflow, images were stored as base64 in the pending_changes table.

**Fix:** The pending changes submission and approval endpoints now also convert base64 images to files.

---

### Production Deployment Steps

#### Step 1: Build the Updated Frontend

```bash
cd frontend
npm install
npm run build
```

The built files will be in `frontend/dist/`.

#### Step 2: Modify `api/index.php` for Production Paths

Before uploading `api/index.php`, change the upload directory paths from the development paths to production paths.

**Change 1 - Line 229** (inside `saveBase64ImageToFile` function):

Find:
```php
$uploadDir = __DIR__ . '/../frontend/public/uploads/' . $folder;
```
Replace with:
```php
$uploadDir = __DIR__ . '/../uploads/' . $folder;
```

**Change 2 - Line 1709** (inside director photo upload):

Find:
```php
$uploadDir = __DIR__ . '/../frontend/public/images/directors/';
```
Replace with:
```php
$uploadDir = __DIR__ . '/../images/directors/';
```

**Why:** In development, the API sits at `api/` and uploads go to `frontend/public/uploads/`. In production on Ionos, the API sits at `public_html/api/` and uploads go to `public_html/uploads/`, so the relative path is `../uploads/`.

#### Step 3: Create Upload Directories on Production Server

Connect to your Ionos server via FTP/SFTP and create these directories if they don't already exist:

```
public_html/uploads/hero_slides/
public_html/uploads/products/
public_html/uploads/sectors/
public_html/uploads/certifications/
public_html/uploads/news_articles/
public_html/uploads/directors/
public_html/images/directors/
```

Set permissions to `755` on all upload directories:

```bash
chmod -R 755 public_html/uploads
chmod -R 755 public_html/images/directors
```

#### Step 4: Upload Image Files to Production

Upload the existing image files from development to production. There are **49 image files** across these folders:

| Source (Development) | Destination (Production) | File Count |
|---------------------|-------------------------|------------|
| `frontend/public/uploads/hero_slides/*` | `public_html/uploads/hero_slides/` | 7 files |
| `frontend/public/uploads/products/*` | `public_html/uploads/products/` | 33 files |
| `frontend/public/uploads/sectors/*` | `public_html/uploads/sectors/` | 4 files |
| `frontend/public/uploads/certifications/*` | `public_html/uploads/certifications/` | 1 file |
| `frontend/public/uploads/news_articles/*` | `public_html/uploads/news_articles/` | 1 file |
| `frontend/public/uploads/directors/*` | `public_html/uploads/directors/` | 1 file |

Use FileZilla or your FTP client to upload all files.

#### Step 5: Upload Updated API File

Upload the modified `api/index.php` (with production paths from Step 2) to:

```
public_html/api/index.php
```

This replaces the existing file on the server.

#### Step 6: Upload Updated Frontend Build

Upload the contents of `frontend/dist/` to your production web root:

```
frontend/dist/*  →  public_html/
```

This includes updated `index.html`, `assets/` folder, and all static files.

#### Step 7: Run the Image URL Migration Script on Production Database

This is a **critical step**. The database currently stores old image references (base64 data or outdated paths). This script updates all image URLs in the database to point to the new file-based paths.

Log into phpMyAdmin on your production server, go to the **SQL** tab, and run the following script (also available in the project at `database/image_urls_update.sql`):

```sql
-- Image URL updates (convert base64/old paths to static file paths)
-- Run this AFTER uploading image files to the server (Step 4)

-- Products (36 updates)
UPDATE products SET image_url = '/uploads/products/sunflower-oil.jpeg' WHERE slug = 'sunflower-oil';
UPDATE products SET image_url = '/uploads/products/coconut-oil.jpeg' WHERE slug = 'coconut-oil';
UPDATE products SET image_url = '/uploads/products/palm-oil.jpeg' WHERE slug = 'palm-oil';
UPDATE products SET image_url = '/uploads/products/soybean-oil.jpg' WHERE slug = 'soybean-oil';
UPDATE products SET image_url = '/uploads/products/rapeseed-oil.jpeg' WHERE slug = 'rapeseed-oil';
UPDATE products SET image_url = '/images/products/olive-oil.png' WHERE slug = 'olive-oil';
UPDATE products SET image_url = '/images/products/palm-kernel-olein.jpeg' WHERE slug = 'palm-kernel-olein';
UPDATE products SET image_url = '/uploads/products/palm-olein.jpg' WHERE slug = 'palm-olein';
UPDATE products SET image_url = '/uploads/products/palm-kernel-oil.jpg' WHERE slug = 'palm-kernel-oil';
UPDATE products SET image_url = '/uploads/products/beeswax.jpg' WHERE slug = 'beeswax';
UPDATE products SET image_url = '/uploads/products/carnauba-wax.jpg' WHERE slug = 'carnauba-wax';
UPDATE products SET image_url = '/uploads/products/castor-oil.jpg' WHERE slug = 'castor-oil';
UPDATE products SET image_url = '/uploads/products/bw101-palm-wax.jpg' WHERE slug = 'bw101-palm-wax';
UPDATE products SET image_url = '/images/products/palm-kernel-stearin.jpeg' WHERE slug = 'palm-kernel-stearin';
UPDATE products SET image_url = '/uploads/products/palm-stearin.jpg' WHERE slug = 'palm-stearin';
UPDATE products SET image_url = '/uploads/products/palm-shortenings.jpg' WHERE slug = 'palm-shortenings';
UPDATE products SET image_url = '/uploads/products/coconut-wax.jpg' WHERE slug = 'coconut-wax';
UPDATE products SET image_url = '/uploads/products/soy-wax.jpg' WHERE slug = 'soy-wax';
UPDATE products SET image_url = '/uploads/products/rapeseed-wax.jpg' WHERE slug = 'rapeseed-wax';
UPDATE products SET image_url = '/uploads/products/hydrogenated-castor-oil.jpg' WHERE slug = 'hydrogenated-castor-oil';
UPDATE products SET image_url = '/uploads/products/palm-shortenings-lmp.jpg' WHERE slug = 'palm-shortenings-lmp';
UPDATE products SET image_url = '/uploads/products/palm-fatty-acid-distillate-pfad.jpg' WHERE slug = 'palm-fatty-acid-distillate-pfad';
UPDATE products SET image_url = '/uploads/products/palm-kernel-fatty-acid-distillate-pkfad.jpg' WHERE slug = 'palm-kernel-fatty-acid-distillate-pkfad';
UPDATE products SET image_url = '/uploads/products/soap-noodles.jpg' WHERE slug = 'soap-noodles';
UPDATE products SET image_url = '/uploads/products/glycerine.jpg' WHERE slug = 'glycerine';
UPDATE products SET image_url = '/uploads/products/palm-stearic-acid.jpg' WHERE slug = 'palm-stearic-acid';
UPDATE products SET image_url = '/uploads/products/paraffin-wax.jpg' WHERE slug = 'paraffin-wax';
UPDATE products SET image_url = '/uploads/products/sr-paraffin-wax.jpg' WHERE slug = 'sr-paraffin-wax';
UPDATE products SET image_url = '/uploads/products/fischer-tropsch-ft-wax.jpg' WHERE slug = 'fischer-tropsch-ft-wax';
UPDATE products SET image_url = '/uploads/products/palm-paraffin-blended-wax-jarcandles.jpg' WHERE slug = 'palm-paraffin-blended-wax-jarcandles';
UPDATE products SET image_url = '/uploads/products/palm-paraffin-blended-wax-pillar.jpg' WHERE slug = 'palm-paraffin-blended-wax-pillar';
UPDATE products SET image_url = '/uploads/products/soy-blend-vegan-wax.jpg' WHERE slug = 'soy-blend-vegan-wax';
UPDATE products SET image_url = '/uploads/products/soy-beeswax-blend.jpg' WHERE slug = 'soy-beeswax-blend';
UPDATE products SET image_url = '/uploads/products/coconut-rapeseed-blend.jpg' WHERE slug = 'coconut-rapeseed-blend';
UPDATE products SET image_url = '/uploads/products/microcrystalline-wax.jpg' WHERE slug = 'microcrystalline-wax';
UPDATE products SET image_url = '/uploads/products/polyethylene-wax.jpg' WHERE slug = 'polyethylene-wax';

-- Hero Slides (5 updates)
UPDATE hero_slides SET image_url = '/uploads/hero_slides/29991d1d-087a-4b6e-be55-d74d0cc70cd8.jpg' WHERE id = '29991d1d-087a-4b6e-be55-d74d0cc70cd8';
UPDATE hero_slides SET image_url = '/uploads/hero_slides/slide-001.jpg' WHERE id = 'slide-001';
UPDATE hero_slides SET image_url = '/uploads/hero_slides/slide-002.jpg' WHERE id = 'slide-002';
UPDATE hero_slides SET image_url = '/images/hero/hero-3.png' WHERE id = 'slide-003';
UPDATE hero_slides SET image_url = '/uploads/hero_slides/b1a3a562-6f7a-47b5-9481-c6e3dc3bd104.jpg' WHERE id = 'b1a3a562-6f7a-47b5-9481-c6e3dc3bd104';

-- Sectors (10 updates)
UPDATE sectors SET image_url = '/uploads/sectors/sec-001.jpg' WHERE id = 'sec-001';
UPDATE sectors SET image_url = '/images/sectors/pharmaceuticals.png' WHERE id = 'sec-004';
UPDATE sectors SET image_url = '/images/sectors/textiles-leather.png' WHERE id = 'sec-005';
UPDATE sectors SET image_url = '/images/sectors/rubber-plastics.png' WHERE id = 'sec-006';
UPDATE sectors SET image_url = '/images/sectors/packaging.png' WHERE id = 'sec-007';
UPDATE sectors SET image_url = '/images/sectors/adhesives.png' WHERE id = 'sec-008';
UPDATE sectors SET image_url = '/images/sectors/polishes-coatings.png' WHERE id = 'sec-009';
UPDATE sectors SET image_url = '/uploads/sectors/sec-002.jpg' WHERE id = 'sec-002';
UPDATE sectors SET image_url = '/images/sectors/paper-printing.png' WHERE id = 'sec-010';
UPDATE sectors SET image_url = '/uploads/sectors/sec-003.jpg' WHERE id = 'sec-003';
```

**Important:** Make sure you have uploaded the image files (Step 4) before running this script. The script only updates the database records to point to the new file locations - the actual files must already be on the server.

#### Step 8: Verify Database Content (No Base64 Data Remaining)

After running the migration script, verify no base64 image data remains in the database. Run this check query in phpMyAdmin:

```sql
-- Check for remaining base64 data in all image tables
SELECT 'products' AS table_name, id, LEFT(image_url, 30) AS preview
FROM products WHERE image_url LIKE 'data:image%'
UNION ALL
SELECT 'hero_slides', id, LEFT(image_url, 30)
FROM hero_slides WHERE image_url LIKE 'data:image%'
UNION ALL
SELECT 'sectors', id, LEFT(image_url, 30)
FROM sectors WHERE image_url LIKE 'data:image%'
UNION ALL
SELECT 'certifications', id, LEFT(image_url, 30)
FROM certifications WHERE image_url LIKE 'data:image%'
UNION ALL
SELECT 'news_articles', id, LEFT(image_url, 30)
FROM news_articles WHERE image_url LIKE 'data:image%'
UNION ALL
SELECT 'directors', id, LEFT(photo_url, 30)
FROM directors WHERE photo_url LIKE 'data:image%';
```

**Expected result:** No rows returned (empty result). If any rows appear, those records still have base64 data and their images need to be re-uploaded through the admin panel after deployment.

#### Step 8: Verify Production Deployment

Test these items on your live website:

| Test | URL / Action | Expected Result |
|------|-------------|-----------------|
| Homepage | `https://www.biogreenwax.com/` | Hero slides display with images |
| Products | `https://www.biogreenwax.com/products` | All 36 products show with images |
| Sectors | Click any sector in dropdown | Sector page loads with images |
| News | `https://www.biogreenwax.com/news` | Articles display with images |
| Certifications | `https://www.biogreenwax.com/certifications` | Certification cards show |
| Admin Edit | Edit any product, save without changing image | Image stays (not cleared) |
| Admin Toggle | Toggle product active/inactive | Status saves correctly |
| Admin Upload | Upload a new image for any content | Image uploads and displays |
| Content Creator | Submit a change with image as content creator | Image saves as file in approval |

### Files to Deploy (Complete List)

| File | Destination | Action | Notes |
|------|------------|--------|-------|
| `api/index.php` | `public_html/api/index.php` | Replace | Change 2 upload paths first (see Step 2) |
| `frontend/dist/*` | `public_html/` | Replace | All frontend build files |
| `frontend/public/uploads/*` | `public_html/uploads/` | Upload | 49 image files across 6 subdirectories |
| `database/image_urls_update.sql` | Run in phpMyAdmin SQL tab | Execute | Updates all image paths in the database (see Step 7) |

**No database schema changes are required.** One SQL data migration script must be run on production to update image URLs (see Step 7). All other changes are in the PHP application code and frontend build files.
