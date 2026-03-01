# Bio Green Wax - Ionos Deployment Guide

This guide explains how to deploy the Bio Green Wax application to Ionos shared web hosting.

## Requirements

- Ionos Web Hosting plan with:
  - PHP 8.3 or higher
  - MySQL or MariaDB database
  - Apache with mod_rewrite enabled

## Step 1: Build the Frontend

On your development machine, run:

```bash
cd frontend
npm install
npm run build
```

This creates the `frontend/build/` folder with static files.

## Step 2: Create MySQL Database

1. Log into your Ionos Control Panel
2. Go to **Hosting** > **MySQL Databases**
3. Create a new database
4. Note down:
   - Database Host (e.g., `db12345678.hosting-data.io`)
   - Database Name
   - Database User
   - Database Password

## Step 3: Import Database Schema

1. Open phpMyAdmin from your Ionos Control Panel
2. Select your database
3. Import the SQL schema from `frontend/database/schema.sql`

## Step 4: Prepare Files for Upload

Create this folder structure for upload:

```
your-domain/
├── .htaccess          (copy from deploy/.htaccess)
├── index.html         (from frontend/build/)
├── favicon.ico        (from frontend/build/)
├── robots.txt         (from frontend/build/)
├── placeholder.svg    (from frontend/build/)
├── assets/            (from frontend/build/assets/)
│   └── (all CSS/JS files)
└── api/
    ├── .htaccess      (copy from api/.htaccess)
    ├── config.php     (copy from deploy/api/config.php and edit)
    └── index.php      (copy from api/index.php)
```

## Step 5: Configure the API

Edit `api/config.php` with your Ionos database credentials:

```php
define('MYSQL_HOST', 'db12345678.hosting-data.io');
define('MYSQL_USER', 'your_username');
define('MYSQL_PASSWORD', 'your_password');
define('MYSQL_DATABASE', 'your_database');
define('JWT_SECRET', 'generate-a-random-64-character-string-here');
```

## Step 6: Upload Files

Using SFTP (recommended) or the Ionos File Manager:

1. Connect to your web space
2. Navigate to your domain's root folder (usually `/` or `/htdocs/`)
3. Upload all files maintaining the folder structure

## Step 7: Test the Application

1. Visit your domain in a browser
2. The React application should load
3. Test the API by visiting `https://yourdomain.com/api/health`

## Troubleshooting

### 500 Internal Server Error
- Check that `.htaccess` files were uploaded correctly
- Verify PHP version is 8.3 or higher in Ionos Control Panel
- Check error logs in Ionos Control Panel

### Database Connection Error
- Verify database credentials in `config.php`
- Ensure database host is correct (Ionos uses a specific host, not `localhost`)
- Check that the database exists and tables are created

### API Returns 404
- Ensure mod_rewrite is enabled (usually enabled by default on Ionos)
- Check that `.htaccess` in the api folder was uploaded
- Verify the API folder structure is correct

### React Routes Not Working
- Make sure the root `.htaccess` file is uploaded
- Check that `RewriteEngine On` works (contact Ionos support if not)

## Security Recommendations

1. **Change JWT_SECRET**: Use a random 64+ character string
2. **Create an admin user**: Use the registration endpoint to create your admin account
3. **Remove registration endpoint**: After creating your admin, consider removing the public registration endpoint from `api/index.php` if you don't need public signups

## File Sizes

Approximate upload sizes:
- Frontend build: ~2-3 MB
- API files: ~30 KB
- Total: ~3 MB

## Support

For Ionos-specific issues:
- Ionos Help Center: https://www.ionos.com/help/
- PHP/MySQL documentation on Ionos
