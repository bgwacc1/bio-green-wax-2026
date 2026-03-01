# Bio Green Wax Database Scripts

This directory contains all database schema and data export files for migrating the Bio Green Wax application to your Ionos production host.

## Files Overview

| File | Purpose | Size |
|------|---------|------|
| `mysql_schema.sql` | Complete table structure (192 tables) | ~85 KB |
| `mysql_data_export.sql` | ALL data including translations for 16 languages | ~60 MB |
| `export_all_data.php` | Script to regenerate the data export from current database | ~4 KB |
| `schema.sql` | PostgreSQL schema (development) | ~59 KB |
| `seed.sql` | Initial seed data (development, 49 products, 5 categories) | ~45 KB |
| `init.sh` | Auto-initialization script (runs schema + seed on first startup) | ~1 KB |

## Development Setup (Replit)

When creating a new Replit instance, the database is automatically initialized:

1. The `init.sh` script runs before the PHP API starts (configured in the workflow)
2. It checks if the database is already populated (users table has data)
3. If empty, it runs `schema.sql` to create all 192 tables, then `seed.sql` to populate seed data
4. On subsequent startups, it skips initialization automatically

No manual steps are needed - just create a PostgreSQL database and start the project.

## Production Deployment (Ionos MySQL)

### Step 1: Create the Database

1. Log into your Ionos hosting control panel
2. Navigate to **Databases** > **MySQL**
3. Create a new MySQL database (e.g., `biogreenwax_prod`)
4. Note down:
   - Database host (usually `dbXXXX.hosting-data.io`)
   - Database name
   - Database user
   - Database password

### Step 2: Run the Schema Script

Using phpMyAdmin or MySQL command line:

```bash
mysql -h dbXXXX.hosting-data.io -u your_user -p your_database < mysql_schema.sql
```

Or via phpMyAdmin:
1. Select your database
2. Go to **Import** tab
3. Upload `mysql_schema.sql`
4. Click **Execute**

### Step 3: Import the Data

**Important:** The data file is approximately 60 MB. If phpMyAdmin has an upload size limit, use the command line method instead, or ask your hosting provider to increase the upload limit.

```bash
mysql -h dbXXXX.hosting-data.io -u your_user -p your_database < mysql_data_export.sql
```

Or via phpMyAdmin:
1. Select your database
2. Go to **Import** tab
3. Upload `mysql_data_export.sql`
4. Click **Execute**

### Step 4: Configure the API

Edit `api/config.php` with your database credentials:

```php
define('DB_HOST', 'dbXXXX.hosting-data.io');
define('DB_NAME', 'your_database_name');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('JWT_SECRET', 'generate-a-secure-random-string-here');
```

## Default Admin Account

After importing the data, you can log in with:

- **Email:** `admin@biogreenwax.com`
- **Password:** `Admin123!`

**Important:** Change this password immediately after first login in production!

## What's Included in the Data Export

### Master Content Tables (22 tables)
- `users` - User accounts (admin user included)
- `user_roles` - User permission roles
- `supported_languages` - 16 enabled languages
- `products` - 49 products in the catalog
- `product_categories` - 5 product categories (Edible Oils, Plant-Based Waxes, Industrial Waxes, Wax Blends, Oleochemicals)
- `sectors` - 10 industry sectors
- `hero_slides` - 5 homepage carousel slides
- `certifications` - 3 company certifications
- `news_articles` - 5 news articles
- `job_openings` - 4 career opportunities
- `job_applications` - 4 received applications
- `contact_enquiries` - 5 contact form submissions
- `newsletter_subscribers` - 2 subscribers
- `contact_info` - 4 company contact details
- `site_content` - 12 CMS content blocks
- `about_us_content` - 15 about page content blocks
- `directors` - 2 company directors
- `global_operations` - 4 office locations
- `seo_keywords` - 64 SEO keywords
- `seo_keyword_products` - 6 keyword-product mappings
- `seo_page_meta` - 7 custom page meta overrides

### Language Translation Tables (165 tables)
11 content types x 15 languages = 165 translation tables:

**Content types:** products, product_categories, sectors, hero_slides, certifications, news_articles, job_openings, contact_info, about_us_content, directors, global_operations

**Languages:** Chinese (zh), Spanish (es), French (fr), Arabic (ar), Portuguese (pt), Russian (ru), German (de), Japanese (ja), Swahili (sw), Turkish (tr), Vietnamese (vi), Korean (ko), Thai (th), Italian (it), Polish (pl)

All translations are AI-generated and stored in the database.

## Re-Exporting Data

If you make changes to the data and need a fresh export, run:

```bash
php database/export_all_data.php
```

This will regenerate `mysql_data_export.sql` with all current data.

## Notes

1. **Analytics Data**: The `visitor_sessions` and `page_views` tables are NOT included in the data export as they contain development/testing data. Production will start fresh.

2. **Character Set**: All tables use `utf8mb4` charset to support multilingual content including Chinese, Japanese, Arabic, Thai, Korean, etc.

3. **Image URLs**: Image URLs use relative paths (e.g., `/images/products/...`). Make sure your image files are uploaded to the corresponding directory on your host.

4. **Password Hashing**: Passwords use bcrypt ($2y$12$) which is compatible with PHP's `password_verify()` function.

5. **Foreign Keys**: The import script temporarily disables foreign key checks to allow inserting data in any order, then re-enables them at the end.

## Backup Recommendations

Before any production updates:
1. Create a full database backup via phpMyAdmin export
2. Test changes on a staging database first
3. Keep multiple dated backup files
