# Bio Green Wax Project

## Overview
This project is a sophisticated web application for Bio Green Wax, featuring a React + TypeScript frontend and a PHP backend. It's designed for optimal performance and compatibility with Ionos shared web hosting environments. The application aims to provide a robust online presence, supporting global operations with extensive multilingual capabilities, advanced SEO, and a comprehensive analytics system. Key features include dynamic content management for products, news, and company information, secure user authentication, and a user-friendly admin interface.

## User Preferences
No explicit user preferences were provided in the original `replit.md` file.

## System Architecture
The system employs a client-server architecture. The frontend is built with React 18, TypeScript, Vite, Tailwind CSS, and Shadcn UI, ensuring a modern and responsive user experience. Navigation is handled by React Router, and data fetching utilizes TanStack Query. The backend is a PHP 8.4 API, designed for simplicity and Ionos compatibility, using PDO for MySQL/MariaDB database interaction and JWT for secure authentication.

**Key Architectural Decisions & Features:**

*   **Ionos Compatibility:** The entire application is optimized for Ionos shared hosting, meaning the frontend compiles to static files, and the PHP backend leverages Apache's `mod_rewrite`.
*   **Performance Optimization:**
    *   Route-based code splitting with React.lazy() - main bundle 116KB (was 1.9MB), admin/charts loaded on demand.
    *   All images compressed with sharp to web-optimized sizes (uploads: 1.6MB from 51MB, static: 11MB from 68MB).
    *   Images stored as static files in /uploads/ and /images/ instead of base64 in database.
    *   Lazy loading on all non-priority images with opacity fade-in transition.
    *   Vite manualChunks separates vendor, router, UI, query, and charts libraries.
*   **Database Management:** Development environments use PostgreSQL (via Replit), while production uses MySQL/MariaDB. A `synchronized_data` column on translatable content tables tracks translation status.
*   **UI/UX:** Utilizes Tailwind CSS for utility-first styling and Shadcn UI for accessible, customizable components built on Radix UI.
*   **API Design:** A RESTful API provides CRUD operations for various content types, authentication, health checks, and specialized endpoints for SEO, analytics, and translation.
*   **SEO Optimization:**
    *   Dynamic meta tags via `react-helmet-async`, supporting per-page titles, descriptions, Open Graph, and Twitter cards.
    *   Structured data (JSON-LD) for Organization, LocalBusiness, Product, Article, and BreadcrumbList schemas.
    *   **Dynamic `sitemap.xml` generation** — PHP API endpoint (`/sitemap.xml`) queries the database for all active products, sectors, and news articles, generating URLs with full hreflang alternates for all 16 languages. Respects `no_index` flags from the `seo_page_meta` table (managed in admin SEO tab). Static pages use today's date as lastmod; dynamic content uses actual creation/publish dates. Served via Vite proxy in dev and Apache rewrite in production.
    *   **Dynamic `robots.txt` generation** — PHP API endpoint (`/robots.txt`) auto-includes Disallow rules for pages marked `no_index` in the admin SEO panel, blocks `/admin` and `/api/`, and references the sitemap URL.
    *   **SEO Keywords Management System:** An admin panel allows managing keywords, assigning priority scores, tracking estimated search volume, mapping products to keywords, and overriding page meta.
    *   **AI Bot Pre-rendering (`api/bot-renderer.php`):** PHP-based server-side rendering for AI crawlers (GPTBot, ClaudeBot, CCBot, PerplexityBot, etc.). Apache `.htaccess` detects bot user agents and serves full HTML pages with database content instead of the empty React SPA shell. Covers Home, About, Products (list + detail), Sectors (list + detail), News (list + detail), Certifications, Contact, and Careers pages. Supports multilingual content via language-specific database tables.
*   **Website Analytics System:** A self-hosted, privacy-compliant analytics solution tracks page views, geographic location, device info, session duration, referrer source, and more. Data is stored in `visitor_sessions` and `page_views` tables, with an admin dashboard providing interactive charts for analysis. Data older than 3 months is automatically purged.
    *   **AI Bot Analytics:** Dedicated bot visit tracking via `bot_visits` table logs every AI crawler visit with bot name, user agent, IP, geolocation, page path, page type, language, and domain. Admin dashboard "AI Bots" sub-tab under Analytics shows summary stats, visits over time (line chart), visits by bot (pie chart), by language (bar chart), most crawled pages (table), by country (progress bars), and recent visit log.
*   **Multilingual Support (16 Languages):**
    *   **Architecture:** Employs a language-specific table architecture, with master tables (English) and 15 language-specific tables for each of the 11 translatable entity types (e.g., `products_de`, `sectors_fr`).
    *   **Implementation:** React i18n context for frontend translations, dedicated translation files for static UI text, and a language switcher.
    *   **URL Structure:** Subdirectory-based URLs (e.g., `/de/about`).
    *   **SEO:** Comprehensive `hreflang` tags, sitemap with `xhtml:link` alternates, canonical URLs, and `x-default` fallback to English.
    *   **Translation Sync:** A background PHP worker scans for unsynchronized records, translates them, and populates the language-specific tables.
    *   **RTL Support:** Right-to-left text direction for Arabic, with multi-language font support (Noto Sans).
*   **Newsletter Subscription:** Integrated newsletter signup with a dedicated database table, API endpoints for subscription/unsubscription, and an admin interface for managing subscribers and CSV export.

## Current State (February 2026)
- All three workflows running: Frontend (Vite on port 5000), PHP API (port 8080), Translation Service (port 3001)
- PostgreSQL database with 192 tables populated with seed data (49 products across 5 categories, 10 sectors, certifications, news, jobs)
- OpenAI integration configured via Replit AI Integrations (AI_INTEGRATIONS_OPENAI_BASE_URL / AI_INTEGRATIONS_OPENAI_API_KEY)
- Default admin: admin@biogreenwax.co.uk / Admin123!
- Frontend proxy: /api/* routes to PHP API on port 8080
- **Image paths:** All product/hero images use local paths (/uploads/products/, /uploads/hero_slides/, /images/products/, /images/hero/). No external (Supabase) URLs.
- **Supabase fully removed:** No @supabase/supabase-js dependency, no Supabase client/functions/migrations in codebase.
- **Automatic database initialization:** `database/init.sh` runs automatically before the PHP API starts. On first startup with an empty database, it executes `schema_pg.sql` then `seed_pg.sql` to create all tables and populate seed data. Subsequent startups skip initialization. Original MySQL files (`schema.sql`, `seed.sql`) are kept for Ionos/MySQL production deployment.
- **Seed data:** `database/seed.sql` contains production-matching data: 49 products (5 categories including oleochemicals), 5 hero slides, 10 sectors, 3 certifications, 5 news articles, 4 job openings, 2 directors, 4 global operations, 15 About Us content blocks, SEO keywords, newsletter subscribers. `seed_pg.sql` also includes 75 bot_visits test records across 7 bot types (GPTBot, ClaudeBot, Googlebot, PerplexityBot, Bingbot, Google-Extended, CCBot). Safe for new instance creation.

## External Dependencies
*   **Database:** PostgreSQL (development, via Replit), MySQL/MariaDB (production, via Ionos).
*   **Frontend Libraries:** React, Vite, Tailwind CSS, Shadcn UI (Radix UI), React Router, TanStack Query, Recharts (for analytics dashboard).
*   **Backend Technologies:** PHP 8.2+, PDO (PHP Data Objects), JWT (JSON Web Tokens), bcrypt (for password hashing).
*   **Deployment Environment:** Hostinger shared web hosting (Apache `mod_rewrite`).
*   **APIs:** IP geolocation API (for analytics), OpenAI via Replit AI Integrations (for translations).