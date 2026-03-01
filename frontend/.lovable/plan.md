
## Goal
1) Fix the current build/type errors so the app compiles and the preview renders.  
2) Create the missing backend database tables + required initial data so pages that query content (hero slides, products, sectors, etc.) stop failing.  
3) Provide a reliable “restart” procedure (in Lovable projects this is a refresh/rebuild flow, not a server reboot you manually trigger).

---

## What’s happening now (root cause)
### A) Backend schema is missing
From my inspection:
- The app is making requests like `GET /rest/v1/hero_slides`, `sectors`, `product_categories`, `contact_info` and receives **404**.
- A direct database check for public tables returned **no tables**.

That means the backend database currently does **not** have the tables your frontend expects.

### B) Frontend type system thinks there are zero tables
`src/integrations/supabase/types.ts` currently has `public.Tables` as `never`, so TypeScript flags every `.from("...")` call as invalid (`"xxx" is not assignable to never`). Those are the errors you’re seeing in `useCMS.ts`, `AuthContext.tsx`, `SectorsManager.tsx`, `CertificationsManager.tsx`, etc.

This will resolve once the backend schema exists and the generated types reflect it.

### C) There’s at least one unrelated TS error
`src/components/careers/JobApplicationForm.tsx` has `application is possibly null`. That needs a small code fix even after the schema is created.

---

## Plan to resolve (implementation steps)

### 1) Make the database schema exist (tables + RLS)
**Action (codebase / backend):**
- Create a single clean “baseline” migration (or safely repair the existing ones) that creates all required tables and policies.

**Why:**  
Right now the repo contains multiple migrations that overlap (e.g., `app_role`/`user_roles` are created more than once). On a fresh backend, running them in order can fail mid-way, leaving you with **no schema**.

**Tables required by the current code**
Based on hooks/components, we need at minimum:
- `user_roles` (+ role helpers like `has_role`, `is_admin`, `is_content_creator`)
- `hero_slides`
- `contact_info`
- `news_articles`
- `product_categories`
- `products` (including `categories` JSONB array)
- `product_specifications`
- `pending_changes`
- `sectors` (including `image_url`)
- `certifications`
- `job_openings`
- `job_applications`
- `site_content`

**Security/RLS requirements (high-level)**
- Public pages must be able to `SELECT` public content (hero slides, published news, active products, sectors, certifications, contact info).
- Admin users can manage content (insert/update/delete).
- Content creators (if you want that workflow) can submit to `pending_changes` and upload media if allowed.

**Deliverable of this step**
- Backend now responds with 200s (not 404) for those REST endpoints.
- Generated `types.ts` is updated to include the tables, removing the “never” cascade of TypeScript errors.

---

### 2) Seed the “required” initial content data
**Action:**
- Populate baseline rows so the site isn’t empty:
  - `contact_info` defaults (phone/email/address/whatsapp)
  - `product_categories` (edible-oils / plant-waxes / industrial-waxes)
  - `sectors` rows (the 6 homepage sectors)
  - `certifications` rows (the 6 certifications you already have assets for)
  - `hero_slides` (2–4 initial slides)

**Products catalog**
You already have a large static catalog in `src/data/products.ts`, but the UI pages are now using DB-driven hooks (`useProducts`, `useProductBySlug`, etc.). We should seed the DB with that product list.

Because images in `src/data/products.ts` are imported assets (not stable public URLs), the initial seeding will:
- Insert product text/specs/applications/packaging/categories
- Set `image_url` to `null` or `/placeholder.svg` initially
- Later you can upload real images through the admin UI (which stores public URLs)

---

### 3) Ensure the required file storage buckets exist (for uploads/downloads)
Your code expects these buckets:
- `cms-images` (used by sector/certification/news/product image uploads)
- `product-specs` (PDF uploads)
- `cv-uploads` (CV uploads)

**Action:**
- Create buckets and access rules in a backend-safe way so:
  - Public can read public marketing assets (for “cms-images” and product specs if intended)
  - Only admins (and optionally content creators) can upload/delete

**Note:** Once these exist, the admin upload flows and “download spec” features will work end-to-end.

---

### 4) Fix remaining TypeScript issues after schema exists
After the schema is in place and types regenerate, most TS errors disappear automatically.

**Explicit code fixes still needed**
- `src/components/careers/JobApplicationForm.tsx`: handle the possibility `submitMutation.mutateAsync(...)` returns null/undefined by:
  - Guarding: `if (!application?.id) throw new Error(...)`
  - Then calling the email function only when the insert definitely returned an ID

**Then run a quick “compile sanity sweep”**
- Re-check for any remaining TS errors from strict null checks or mismatched shapes.

---

### 5) “Restart” the app (what we can do in Lovable)
There isn’t a manual server process restart button like a traditional Node server. The practical “restart” is:

1) Hard refresh the preview (this reloads the built bundle)
2) If needed: clear site data (localStorage/session) then refresh
3) After backend schema changes: refresh once more so requests stop 404’ing

As part of implementation, I’ll verify the preview renders without the blank screen and without runtime errors.

---

## Validation checklist (what “done” looks like)
- Home page loads without a blank screen
- Network requests for `hero_slides`, `sectors`, `product_categories`, `contact_info` return 200
- `/products` shows products from the DB
- `/products/:slug` works for seeded product slugs
- Admin pages load (login still requires an admin user, which we can create next)
- Uploads to `cms-images` work from admin managers
- Job application submission works and no TS error remains

---

## Follow-up (optional but recommended)
- Create an initial admin account (so you can use `/admin/login` immediately)
- Add a one-time “seed status” check (so seeding doesn’t re-run accidentally)
- Add graceful fallback behavior if the backend is temporarily unavailable (so marketing pages don’t go blank)

