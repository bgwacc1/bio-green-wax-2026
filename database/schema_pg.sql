-- Bio Green Wax Database Schema
-- Compatible with PostgreSQL (Replit dev) and MySQL (Ionos production)
-- For MySQL: Change SERIAL to INT AUTO_INCREMENT, SMALLINT to SMALLINT, TEXT to TEXT for large content

START TRANSACTION;
--
-- Database: "u662768582_bgw"
--

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "about_us_content" (
 "id" varchar(36) NOT NULL,
 "section" varchar(100) NOT NULL,
 "content_key" varchar(100) NOT NULL,
 "content_value" TEXT DEFAULT NULL,
 "content_type" varchar(50) DEFAULT 'text',
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "about_us_content_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "about_us_content_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "content_value" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "bot_visits"
--
-- Creation: Feb 22, 2026 at 02:24 PM
--

CREATE TABLE "bot_visits" (
 "id" BIGSERIAL NOT NULL,
 "bot_name" varchar(100) NOT NULL,
 "user_agent" TEXT DEFAULT NULL,
 "ip_address" varchar(45) DEFAULT NULL,
 "country" varchar(100) DEFAULT NULL,
 "country_code" varchar(10) DEFAULT NULL,
 "city" varchar(100) DEFAULT NULL,
 "page_path" varchar(500) NOT NULL,
 "page_type" varchar(100) DEFAULT NULL,
 "language" varchar(20) DEFAULT NULL,
 "domain" varchar(255) DEFAULT NULL,
 "visited_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "certifications" (
 "id" varchar(36) NOT NULL,
 "name" varchar(255) NOT NULL,
 "title" varchar(255) NOT NULL,
 "description" TEXT DEFAULT NULL,
 "image_url" TEXT DEFAULT NULL,
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "certifications_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "certifications_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_enquiries"
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 24, 2026 at 09:45 PM
--

CREATE TABLE "contact_enquiries" (
 "id" varchar(36) NOT NULL,
 "name" varchar(255) NOT NULL,
 "email" varchar(255) NOT NULL,
 "phone" varchar(50) DEFAULT NULL,
 "company" varchar(255) DEFAULT NULL,
 "subject" varchar(255) NOT NULL,
 "message" TEXT NOT NULL,
 "is_read" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "contact_info" (
 "id" varchar(36) NOT NULL,
 "key" varchar(100) NOT NULL,
 "value" TEXT NOT NULL,
 "label" varchar(100) DEFAULT NULL,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "contact_info_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "contact_info_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "value" TEXT DEFAULT NULL,
 "label" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "directors" (
 "id" varchar(36) NOT NULL,
 "name" varchar(255) NOT NULL,
 "title" varchar(255) NOT NULL,
 "bio" TEXT DEFAULT NULL,
 "linkedin_url" TEXT DEFAULT NULL,
 "photo_url" TEXT DEFAULT NULL,
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "directors_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "directors_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "bio" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "global_operations" (
 "id" varchar(36) NOT NULL,
 "location_name" varchar(255) NOT NULL,
 "country" varchar(100) NOT NULL,
 "description" TEXT DEFAULT NULL,
 "operations_type" varchar(100) DEFAULT NULL,
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "global_operations_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "global_operations_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "location_name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "hero_slides" (
 "id" varchar(36) NOT NULL,
 "title" varchar(255) NOT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" varchar(100) DEFAULT NULL,
 "cta_link" varchar(255) DEFAULT NULL,
 "image_url" TEXT DEFAULT NULL,
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "hero_slides_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "hero_slides_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "subtitle" TEXT DEFAULT NULL,
 "cta_text" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_applications"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_applications" (
 "id" varchar(36) NOT NULL,
 "job_opening_id" varchar(36) DEFAULT NULL,
 "full_name" varchar(255) NOT NULL,
 "email" varchar(255) NOT NULL,
 "phone" varchar(50) DEFAULT NULL,
 "current_company" varchar(255) DEFAULT NULL,
 "current_position" varchar(255) DEFAULT NULL,
 "experience_years" INTEGER DEFAULT NULL,
 "linkedin_url" TEXT DEFAULT NULL,
 "cover_letter" TEXT DEFAULT NULL,
 "why_suitable" TEXT DEFAULT NULL,
 "value_addition" TEXT DEFAULT NULL,
 "cv_url" TEXT DEFAULT NULL,
 "cv_filename" varchar(255) DEFAULT NULL,
 "is_general_application" BOOLEAN DEFAULT FALSE,
 "is_read" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "job_openings" (
 "id" varchar(36) NOT NULL,
 "title" varchar(255) NOT NULL,
 "department" varchar(100) DEFAULT NULL,
 "location" varchar(100) DEFAULT NULL,
 "type" varchar(50) DEFAULT NULL,
 "employment_type" varchar(50) DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "display_order" INTEGER DEFAULT 0,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "job_openings_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "job_openings_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "requirements" TEXT DEFAULT NULL,
 "responsibilities" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "newsletter_subscribers"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "newsletter_subscribers" (
 "id" varchar(36) NOT NULL,
 "email" varchar(255) NOT NULL,
 "subscribed_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "ip_address" varchar(45) DEFAULT NULL,
 "source" varchar(50) DEFAULT 'website_footer'
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "news_articles" (
 "id" varchar(36) NOT NULL,
 "title" varchar(255) NOT NULL,
 "slug" varchar(255) NOT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "image_url" TEXT DEFAULT NULL,
 "is_published" BOOLEAN DEFAULT FALSE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "published_at" TIMESTAMP DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "news_articles_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "news_articles_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "title" TEXT DEFAULT NULL,
 "excerpt" TEXT DEFAULT NULL,
 "content" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "page_views"
--
-- Creation: Feb 22, 2026 at 01:53 PM
-- Last update: Feb 28, 2026 at 04:22 PM
--

CREATE TABLE "page_views" (
 "id" SERIAL NOT NULL,
 "session_id" varchar(50) DEFAULT NULL,
 "page_path" varchar(500) NOT NULL,
 "page_title" varchar(500) DEFAULT NULL,
 "time_on_page" INTEGER DEFAULT NULL,
 "scroll_depth" INTEGER DEFAULT NULL,
 "viewed_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "pending_changes"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "pending_changes" (
 "id" varchar(36) NOT NULL,
 "table_name" varchar(100) NOT NULL,
 "record_id" varchar(36) DEFAULT NULL,
 "change_type" varchar(20) NOT NULL,
 "original_data" TEXT DEFAULT NULL,
 "new_data" TEXT DEFAULT NULL,
 "status" varchar(30) NOT NULL DEFAULT 'pending',
 "revision_notes" TEXT DEFAULT NULL,
 "created_by" varchar(36) NOT NULL,
 "reviewed_by" varchar(36) DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
 "reviewed_at" TIMESTAMP DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table "products"
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 22, 2026 at 04:21 PM
--

CREATE TABLE "products" (
 "id" varchar(36) NOT NULL,
 "slug" varchar(255) NOT NULL,
 "name" varchar(255) NOT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "category" varchar(100) DEFAULT NULL,
 "category_label" varchar(100) DEFAULT NULL,
 "categories" TEXT DEFAULT NULL,
 "image_url" TEXT DEFAULT NULL,
 "specifications" TEXT DEFAULT NULL,
 "applications" TEXT DEFAULT NULL,
 "packaging" TEXT DEFAULT NULL,
 "is_active" BOOLEAN DEFAULT TRUE,
 "is_featured" BOOLEAN DEFAULT FALSE,
 "display_order" INTEGER DEFAULT 0,
 "priority_order" INTEGER DEFAULT 10,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "products_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "products_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "products_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "full_description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "product_categories" (
 "id" varchar(36) NOT NULL,
 "slug" varchar(255) NOT NULL,
 "name" varchar(255) NOT NULL,
 "description" TEXT DEFAULT NULL,
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_categories_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "product_categories_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "product_specifications"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "product_specifications" (
 "id" varchar(255) NOT NULL,
 "product_id" varchar(255) NOT NULL,
 "name" varchar(500) DEFAULT NULL,
 "file_name" varchar(500) NOT NULL,
 "file_url" TEXT NOT NULL,
 "file_path" TEXT DEFAULT NULL,
 "file_size" INTEGER DEFAULT NULL,
 "uploaded_by" varchar(255) DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "sectors" (
 "id" varchar(36) NOT NULL,
 "name" varchar(255) NOT NULL,
 "slug" varchar(255) NOT NULL,
 "description" TEXT DEFAULT NULL,
 "icon" varchar(50) DEFAULT NULL,
 "color" varchar(20) DEFAULT NULL,
 "image_url" TEXT DEFAULT NULL,
 "display_order" INTEGER DEFAULT 0,
 "is_active" BOOLEAN DEFAULT TRUE,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_ar"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_ar" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_de"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_de" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_es"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_es" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_fr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_fr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_it"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_it" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_ja"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_ja" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_ko"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_ko" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_pl"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_pl" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_pt"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_pt" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_ru"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_ru" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_sw"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_sw" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_th"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_th" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_tr"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_tr" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_vi"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_vi" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "sectors_zh"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "sectors_zh" (
 "id" INTEGER NOT NULL,
 "master_id" varchar(36) DEFAULT NULL,
 "name" TEXT DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "seo_keywords"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "seo_keywords" (
 "id" varchar(50) NOT NULL,
 "keyword" varchar(255) NOT NULL,
 "description" TEXT DEFAULT NULL,
 "target_page" varchar(100) DEFAULT NULL,
 "priority" INTEGER DEFAULT 1,
 "search_volume" varchar(50) DEFAULT NULL,
 "is_active" BOOLEAN DEFAULT TRUE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "seo_keyword_products"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "seo_keyword_products" (
 "id" varchar(50) NOT NULL,
 "keyword_id" varchar(50) NOT NULL,
 "product_id" varchar(100) NOT NULL,
 "relevance_score" INTEGER DEFAULT 100,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "seo_page_meta"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "seo_page_meta" (
 "id" varchar(50) NOT NULL,
 "page_path" varchar(255) NOT NULL,
 "title" varchar(255) DEFAULT NULL,
 "description" TEXT DEFAULT NULL,
 "keywords" TEXT DEFAULT NULL,
 "og_title" varchar(255) DEFAULT NULL,
 "og_description" TEXT DEFAULT NULL,
 "og_image" varchar(500) DEFAULT NULL,
 "canonical_url" varchar(500) DEFAULT NULL,
 "no_index" BOOLEAN DEFAULT FALSE,
 "is_active" BOOLEAN DEFAULT TRUE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "site_content"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "site_content" (
 "id" varchar(36) NOT NULL,
 "page" varchar(100) NOT NULL,
 "section" varchar(100) NOT NULL,
 "content_key" varchar(100) NOT NULL,
 "content_value" TEXT DEFAULT NULL,
 "content_type" varchar(50) DEFAULT 'text',
 "display_order" INTEGER DEFAULT 0,
 "synchronized_data" BOOLEAN DEFAULT FALSE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "supported_languages"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "supported_languages" (
 "code" varchar(10) NOT NULL,
 "name" varchar(100) NOT NULL,
 "native_name" varchar(100) NOT NULL,
 "direction" varchar(3) DEFAULT 'ltr',
 "is_active" BOOLEAN DEFAULT TRUE,
 "display_order" INTEGER DEFAULT 0
);

-- --------------------------------------------------------

--
-- Table structure for table "translations"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "translations" (
 "id" INTEGER NOT NULL,
 "entity_type" varchar(50) NOT NULL,
 "entity_id" varchar(36) NOT NULL,
 "field_name" varchar(100) NOT NULL,
 "language_code" varchar(10) NOT NULL,
 "translated_text" TEXT DEFAULT NULL,
 "is_auto_translated" BOOLEAN DEFAULT TRUE,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "ui_translations"
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE "ui_translations" (
 "id" INTEGER NOT NULL,
 "translation_key" varchar(255) NOT NULL,
 "language_code" varchar(10) NOT NULL,
 "translated_text" TEXT NOT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- --------------------------------------------------------

--
-- Table structure for table "users"
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 27, 2026 at 05:33 AM
--

CREATE TABLE "users" (
 "id" varchar(36) NOT NULL,
 "email" varchar(255) NOT NULL,
 "password_hash" varchar(255) NOT NULL,
 "full_name" varchar(255) DEFAULT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
 "email_confirmed_at" TIMESTAMP DEFAULT NULL,
 "last_sign_in_at" TIMESTAMP DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table "user_roles"
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE "user_roles" (
 "id" INTEGER NOT NULL,
 "user_id" varchar(36) NOT NULL,
 "role" varchar(50) NOT NULL,
 "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------

--
-- Table structure for table "visitor_sessions"
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 28, 2026 at 04:22 PM
--

CREATE TABLE "visitor_sessions" (
 "id" varchar(50) NOT NULL,
 "visitor_id" varchar(100) NOT NULL,
 "ip_address" varchar(45) DEFAULT NULL,
 "country" varchar(100) DEFAULT NULL,
 "city" varchar(100) DEFAULT NULL,
 "region" varchar(100) DEFAULT NULL,
 "country_code" varchar(10) DEFAULT NULL,
 "browser" varchar(100) DEFAULT NULL,
 "browser_version" varchar(50) DEFAULT NULL,
 "operating_system" varchar(100) DEFAULT NULL,
 "device_type" varchar(50) DEFAULT NULL,
 "screen_width" INTEGER DEFAULT NULL,
 "screen_height" INTEGER DEFAULT NULL,
 "language" varchar(20) DEFAULT NULL,
 "referrer" TEXT DEFAULT NULL,
 "referrer_domain" varchar(255) DEFAULT NULL,
 "utm_source" varchar(255) DEFAULT NULL,
 "utm_medium" varchar(255) DEFAULT NULL,
 "utm_campaign" varchar(255) DEFAULT NULL,
 "started_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 "last_activity_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
 "is_new_visitor" BOOLEAN DEFAULT TRUE
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table "about_us_content"
--
ALTER TABLE "about_us_content"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "about_us_content_ar"
--
ALTER TABLE "about_us_content_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_ar" ON "about_us_content_ar" ("master_id");

--
-- Indexes for table "about_us_content_de"
--
ALTER TABLE "about_us_content_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_de" ON "about_us_content_de" ("master_id");

--
-- Indexes for table "about_us_content_es"
--
ALTER TABLE "about_us_content_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_es" ON "about_us_content_es" ("master_id");

--
-- Indexes for table "about_us_content_fr"
--
ALTER TABLE "about_us_content_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_fr" ON "about_us_content_fr" ("master_id");

--
-- Indexes for table "about_us_content_it"
--
ALTER TABLE "about_us_content_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_it" ON "about_us_content_it" ("master_id");

--
-- Indexes for table "about_us_content_ja"
--
ALTER TABLE "about_us_content_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_ja" ON "about_us_content_ja" ("master_id");

--
-- Indexes for table "about_us_content_ko"
--
ALTER TABLE "about_us_content_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_ko" ON "about_us_content_ko" ("master_id");

--
-- Indexes for table "about_us_content_pl"
--
ALTER TABLE "about_us_content_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_pl" ON "about_us_content_pl" ("master_id");

--
-- Indexes for table "about_us_content_pt"
--
ALTER TABLE "about_us_content_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_pt" ON "about_us_content_pt" ("master_id");

--
-- Indexes for table "about_us_content_ru"
--
ALTER TABLE "about_us_content_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_ru" ON "about_us_content_ru" ("master_id");

--
-- Indexes for table "about_us_content_sw"
--
ALTER TABLE "about_us_content_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_sw" ON "about_us_content_sw" ("master_id");

--
-- Indexes for table "about_us_content_th"
--
ALTER TABLE "about_us_content_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_th" ON "about_us_content_th" ("master_id");

--
-- Indexes for table "about_us_content_tr"
--
ALTER TABLE "about_us_content_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_tr" ON "about_us_content_tr" ("master_id");

--
-- Indexes for table "about_us_content_vi"
--
ALTER TABLE "about_us_content_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_vi" ON "about_us_content_vi" ("master_id");

--
-- Indexes for table "about_us_content_zh"
--
ALTER TABLE "about_us_content_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_about_us_content_zh" ON "about_us_content_zh" ("master_id");

--
-- Indexes for table "bot_visits"
--
ALTER TABLE "bot_visits"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "certifications"
--
ALTER TABLE "certifications"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "certifications_ar"
--
ALTER TABLE "certifications_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_ar" ON "certifications_ar" ("master_id");

--
-- Indexes for table "certifications_de"
--
ALTER TABLE "certifications_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_de" ON "certifications_de" ("master_id");

--
-- Indexes for table "certifications_es"
--
ALTER TABLE "certifications_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_es" ON "certifications_es" ("master_id");

--
-- Indexes for table "certifications_fr"
--
ALTER TABLE "certifications_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_fr" ON "certifications_fr" ("master_id");

--
-- Indexes for table "certifications_it"
--
ALTER TABLE "certifications_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_it" ON "certifications_it" ("master_id");

--
-- Indexes for table "certifications_ja"
--
ALTER TABLE "certifications_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_ja" ON "certifications_ja" ("master_id");

--
-- Indexes for table "certifications_ko"
--
ALTER TABLE "certifications_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_ko" ON "certifications_ko" ("master_id");

--
-- Indexes for table "certifications_pl"
--
ALTER TABLE "certifications_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_pl" ON "certifications_pl" ("master_id");

--
-- Indexes for table "certifications_pt"
--
ALTER TABLE "certifications_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_pt" ON "certifications_pt" ("master_id");

--
-- Indexes for table "certifications_ru"
--
ALTER TABLE "certifications_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_ru" ON "certifications_ru" ("master_id");

--
-- Indexes for table "certifications_sw"
--
ALTER TABLE "certifications_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_sw" ON "certifications_sw" ("master_id");

--
-- Indexes for table "certifications_th"
--
ALTER TABLE "certifications_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_th" ON "certifications_th" ("master_id");

--
-- Indexes for table "certifications_tr"
--
ALTER TABLE "certifications_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_tr" ON "certifications_tr" ("master_id");

--
-- Indexes for table "certifications_vi"
--
ALTER TABLE "certifications_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_vi" ON "certifications_vi" ("master_id");

--
-- Indexes for table "certifications_zh"
--
ALTER TABLE "certifications_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_certifications_zh" ON "certifications_zh" ("master_id");

--
-- Indexes for table "contact_enquiries"
--
ALTER TABLE "contact_enquiries"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "contact_info"
--
ALTER TABLE "contact_info"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "contact_info_ar"
--
ALTER TABLE "contact_info_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_ar" ON "contact_info_ar" ("master_id");

--
-- Indexes for table "contact_info_de"
--
ALTER TABLE "contact_info_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_de" ON "contact_info_de" ("master_id");

--
-- Indexes for table "contact_info_es"
--
ALTER TABLE "contact_info_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_es" ON "contact_info_es" ("master_id");

--
-- Indexes for table "contact_info_fr"
--
ALTER TABLE "contact_info_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_fr" ON "contact_info_fr" ("master_id");

--
-- Indexes for table "contact_info_it"
--
ALTER TABLE "contact_info_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_it" ON "contact_info_it" ("master_id");

--
-- Indexes for table "contact_info_ja"
--
ALTER TABLE "contact_info_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_ja" ON "contact_info_ja" ("master_id");

--
-- Indexes for table "contact_info_ko"
--
ALTER TABLE "contact_info_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_ko" ON "contact_info_ko" ("master_id");

--
-- Indexes for table "contact_info_pl"
--
ALTER TABLE "contact_info_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_pl" ON "contact_info_pl" ("master_id");

--
-- Indexes for table "contact_info_pt"
--
ALTER TABLE "contact_info_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_pt" ON "contact_info_pt" ("master_id");

--
-- Indexes for table "contact_info_ru"
--
ALTER TABLE "contact_info_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_ru" ON "contact_info_ru" ("master_id");

--
-- Indexes for table "contact_info_sw"
--
ALTER TABLE "contact_info_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_sw" ON "contact_info_sw" ("master_id");

--
-- Indexes for table "contact_info_th"
--
ALTER TABLE "contact_info_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_th" ON "contact_info_th" ("master_id");

--
-- Indexes for table "contact_info_tr"
--
ALTER TABLE "contact_info_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_tr" ON "contact_info_tr" ("master_id");

--
-- Indexes for table "contact_info_vi"
--
ALTER TABLE "contact_info_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_vi" ON "contact_info_vi" ("master_id");

--
-- Indexes for table "contact_info_zh"
--
ALTER TABLE "contact_info_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_contact_info_zh" ON "contact_info_zh" ("master_id");

--
-- Indexes for table "directors"
--
ALTER TABLE "directors"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "directors_ar"
--
ALTER TABLE "directors_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_ar" ON "directors_ar" ("master_id");

--
-- Indexes for table "directors_de"
--
ALTER TABLE "directors_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_de" ON "directors_de" ("master_id");

--
-- Indexes for table "directors_es"
--
ALTER TABLE "directors_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_es" ON "directors_es" ("master_id");

--
-- Indexes for table "directors_fr"
--
ALTER TABLE "directors_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_fr" ON "directors_fr" ("master_id");

--
-- Indexes for table "directors_it"
--
ALTER TABLE "directors_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_it" ON "directors_it" ("master_id");

--
-- Indexes for table "directors_ja"
--
ALTER TABLE "directors_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_ja" ON "directors_ja" ("master_id");

--
-- Indexes for table "directors_ko"
--
ALTER TABLE "directors_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_ko" ON "directors_ko" ("master_id");

--
-- Indexes for table "directors_pl"
--
ALTER TABLE "directors_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_pl" ON "directors_pl" ("master_id");

--
-- Indexes for table "directors_pt"
--
ALTER TABLE "directors_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_pt" ON "directors_pt" ("master_id");

--
-- Indexes for table "directors_ru"
--
ALTER TABLE "directors_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_ru" ON "directors_ru" ("master_id");

--
-- Indexes for table "directors_sw"
--
ALTER TABLE "directors_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_sw" ON "directors_sw" ("master_id");

--
-- Indexes for table "directors_th"
--
ALTER TABLE "directors_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_th" ON "directors_th" ("master_id");

--
-- Indexes for table "directors_tr"
--
ALTER TABLE "directors_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_tr" ON "directors_tr" ("master_id");

--
-- Indexes for table "directors_vi"
--
ALTER TABLE "directors_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_vi" ON "directors_vi" ("master_id");

--
-- Indexes for table "directors_zh"
--
ALTER TABLE "directors_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_directors_zh" ON "directors_zh" ("master_id");

--
-- Indexes for table "global_operations"
--
ALTER TABLE "global_operations"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "global_operations_ar"
--
ALTER TABLE "global_operations_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_ar" ON "global_operations_ar" ("master_id");

--
-- Indexes for table "global_operations_de"
--
ALTER TABLE "global_operations_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_de" ON "global_operations_de" ("master_id");

--
-- Indexes for table "global_operations_es"
--
ALTER TABLE "global_operations_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_es" ON "global_operations_es" ("master_id");

--
-- Indexes for table "global_operations_fr"
--
ALTER TABLE "global_operations_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_fr" ON "global_operations_fr" ("master_id");

--
-- Indexes for table "global_operations_it"
--
ALTER TABLE "global_operations_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_it" ON "global_operations_it" ("master_id");

--
-- Indexes for table "global_operations_ja"
--
ALTER TABLE "global_operations_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_ja" ON "global_operations_ja" ("master_id");

--
-- Indexes for table "global_operations_ko"
--
ALTER TABLE "global_operations_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_ko" ON "global_operations_ko" ("master_id");

--
-- Indexes for table "global_operations_pl"
--
ALTER TABLE "global_operations_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_pl" ON "global_operations_pl" ("master_id");

--
-- Indexes for table "global_operations_pt"
--
ALTER TABLE "global_operations_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_pt" ON "global_operations_pt" ("master_id");

--
-- Indexes for table "global_operations_ru"
--
ALTER TABLE "global_operations_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_ru" ON "global_operations_ru" ("master_id");

--
-- Indexes for table "global_operations_sw"
--
ALTER TABLE "global_operations_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_sw" ON "global_operations_sw" ("master_id");

--
-- Indexes for table "global_operations_th"
--
ALTER TABLE "global_operations_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_th" ON "global_operations_th" ("master_id");

--
-- Indexes for table "global_operations_tr"
--
ALTER TABLE "global_operations_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_tr" ON "global_operations_tr" ("master_id");

--
-- Indexes for table "global_operations_vi"
--
ALTER TABLE "global_operations_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_vi" ON "global_operations_vi" ("master_id");

--
-- Indexes for table "global_operations_zh"
--
ALTER TABLE "global_operations_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_global_operations_zh" ON "global_operations_zh" ("master_id");

--
-- Indexes for table "hero_slides"
--
ALTER TABLE "hero_slides"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "hero_slides_ar"
--
ALTER TABLE "hero_slides_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_ar" ON "hero_slides_ar" ("master_id");

--
-- Indexes for table "hero_slides_de"
--
ALTER TABLE "hero_slides_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_de" ON "hero_slides_de" ("master_id");

--
-- Indexes for table "hero_slides_es"
--
ALTER TABLE "hero_slides_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_es" ON "hero_slides_es" ("master_id");

--
-- Indexes for table "hero_slides_fr"
--
ALTER TABLE "hero_slides_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_fr" ON "hero_slides_fr" ("master_id");

--
-- Indexes for table "hero_slides_it"
--
ALTER TABLE "hero_slides_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_it" ON "hero_slides_it" ("master_id");

--
-- Indexes for table "hero_slides_ja"
--
ALTER TABLE "hero_slides_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_ja" ON "hero_slides_ja" ("master_id");

--
-- Indexes for table "hero_slides_ko"
--
ALTER TABLE "hero_slides_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_ko" ON "hero_slides_ko" ("master_id");

--
-- Indexes for table "hero_slides_pl"
--
ALTER TABLE "hero_slides_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_pl" ON "hero_slides_pl" ("master_id");

--
-- Indexes for table "hero_slides_pt"
--
ALTER TABLE "hero_slides_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_pt" ON "hero_slides_pt" ("master_id");

--
-- Indexes for table "hero_slides_ru"
--
ALTER TABLE "hero_slides_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_ru" ON "hero_slides_ru" ("master_id");

--
-- Indexes for table "hero_slides_sw"
--
ALTER TABLE "hero_slides_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_sw" ON "hero_slides_sw" ("master_id");

--
-- Indexes for table "hero_slides_th"
--
ALTER TABLE "hero_slides_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_th" ON "hero_slides_th" ("master_id");

--
-- Indexes for table "hero_slides_tr"
--
ALTER TABLE "hero_slides_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_tr" ON "hero_slides_tr" ("master_id");

--
-- Indexes for table "hero_slides_vi"
--
ALTER TABLE "hero_slides_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_vi" ON "hero_slides_vi" ("master_id");

--
-- Indexes for table "hero_slides_zh"
--
ALTER TABLE "hero_slides_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_hero_slides_zh" ON "hero_slides_zh" ("master_id");

--
-- Indexes for table "job_applications"
--
ALTER TABLE "job_applications"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "job_opening_id_job_applications" ON "job_applications" ("job_opening_id");

--
-- Indexes for table "job_openings"
--
ALTER TABLE "job_openings"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "job_openings_ar"
--
ALTER TABLE "job_openings_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_ar" ON "job_openings_ar" ("master_id");

--
-- Indexes for table "job_openings_de"
--
ALTER TABLE "job_openings_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_de" ON "job_openings_de" ("master_id");

--
-- Indexes for table "job_openings_es"
--
ALTER TABLE "job_openings_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_es" ON "job_openings_es" ("master_id");

--
-- Indexes for table "job_openings_fr"
--
ALTER TABLE "job_openings_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_fr" ON "job_openings_fr" ("master_id");

--
-- Indexes for table "job_openings_it"
--
ALTER TABLE "job_openings_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_it" ON "job_openings_it" ("master_id");

--
-- Indexes for table "job_openings_ja"
--
ALTER TABLE "job_openings_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_ja" ON "job_openings_ja" ("master_id");

--
-- Indexes for table "job_openings_ko"
--
ALTER TABLE "job_openings_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_ko" ON "job_openings_ko" ("master_id");

--
-- Indexes for table "job_openings_pl"
--
ALTER TABLE "job_openings_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_pl" ON "job_openings_pl" ("master_id");

--
-- Indexes for table "job_openings_pt"
--
ALTER TABLE "job_openings_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_pt" ON "job_openings_pt" ("master_id");

--
-- Indexes for table "job_openings_ru"
--
ALTER TABLE "job_openings_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_ru" ON "job_openings_ru" ("master_id");

--
-- Indexes for table "job_openings_sw"
--
ALTER TABLE "job_openings_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_sw" ON "job_openings_sw" ("master_id");

--
-- Indexes for table "job_openings_th"
--
ALTER TABLE "job_openings_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_th" ON "job_openings_th" ("master_id");

--
-- Indexes for table "job_openings_tr"
--
ALTER TABLE "job_openings_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_tr" ON "job_openings_tr" ("master_id");

--
-- Indexes for table "job_openings_vi"
--
ALTER TABLE "job_openings_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_vi" ON "job_openings_vi" ("master_id");

--
-- Indexes for table "job_openings_zh"
--
ALTER TABLE "job_openings_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_job_openings_zh" ON "job_openings_zh" ("master_id");

--
-- Indexes for table "newsletter_subscribers"
--
ALTER TABLE "newsletter_subscribers"
 ADD PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "email_newsletter_subscribers" ON "newsletter_subscribers" ("email");

--
-- Indexes for table "news_articles"
--
ALTER TABLE "news_articles"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_news_articles_slug_news_articles" ON "news_articles" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "slug_news_articles" ON "news_articles" ("slug");

--
-- Indexes for table "news_articles_ar"
--
ALTER TABLE "news_articles_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_ar" ON "news_articles_ar" ("master_id");

--
-- Indexes for table "news_articles_de"
--
ALTER TABLE "news_articles_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_de" ON "news_articles_de" ("master_id");

--
-- Indexes for table "news_articles_es"
--
ALTER TABLE "news_articles_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_es" ON "news_articles_es" ("master_id");

--
-- Indexes for table "news_articles_fr"
--
ALTER TABLE "news_articles_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_fr" ON "news_articles_fr" ("master_id");

--
-- Indexes for table "news_articles_it"
--
ALTER TABLE "news_articles_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_it" ON "news_articles_it" ("master_id");

--
-- Indexes for table "news_articles_ja"
--
ALTER TABLE "news_articles_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_ja" ON "news_articles_ja" ("master_id");

--
-- Indexes for table "news_articles_ko"
--
ALTER TABLE "news_articles_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_ko" ON "news_articles_ko" ("master_id");

--
-- Indexes for table "news_articles_pl"
--
ALTER TABLE "news_articles_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_pl" ON "news_articles_pl" ("master_id");

--
-- Indexes for table "news_articles_pt"
--
ALTER TABLE "news_articles_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_pt" ON "news_articles_pt" ("master_id");

--
-- Indexes for table "news_articles_ru"
--
ALTER TABLE "news_articles_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_ru" ON "news_articles_ru" ("master_id");

--
-- Indexes for table "news_articles_sw"
--
ALTER TABLE "news_articles_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_sw" ON "news_articles_sw" ("master_id");

--
-- Indexes for table "news_articles_th"
--
ALTER TABLE "news_articles_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_th" ON "news_articles_th" ("master_id");

--
-- Indexes for table "news_articles_tr"
--
ALTER TABLE "news_articles_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_tr" ON "news_articles_tr" ("master_id");

--
-- Indexes for table "news_articles_vi"
--
ALTER TABLE "news_articles_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_vi" ON "news_articles_vi" ("master_id");

--
-- Indexes for table "news_articles_zh"
--
ALTER TABLE "news_articles_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_news_articles_zh" ON "news_articles_zh" ("master_id");

--
-- Indexes for table "page_views"
--
ALTER TABLE "page_views"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "session_id_page_views" ON "page_views" ("session_id");
CREATE INDEX IF NOT EXISTS "idx_page_views_page_path_page_views" ON "page_views" ("page_path");
CREATE INDEX IF NOT EXISTS "idx_page_views_viewed_at_page_views" ON "page_views" ("viewed_at");

--
-- Indexes for table "pending_changes"
--
ALTER TABLE "pending_changes"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_pending_changes_status_pending_changes" ON "pending_changes" ("status");
CREATE INDEX IF NOT EXISTS "idx_pending_changes_created_by_pending_changes" ON "pending_changes" ("created_by");

--
-- Indexes for table "products"
--
ALTER TABLE "products"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_products_category_products" ON "products" ("category");
CREATE INDEX IF NOT EXISTS "idx_products_slug_products" ON "products" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "slug_products" ON "products" ("slug");

--
-- Indexes for table "products_ar"
--
ALTER TABLE "products_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_ar" ON "products_ar" ("master_id");

--
-- Indexes for table "products_de"
--
ALTER TABLE "products_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_de" ON "products_de" ("master_id");

--
-- Indexes for table "products_es"
--
ALTER TABLE "products_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_es" ON "products_es" ("master_id");

--
-- Indexes for table "products_fr"
--
ALTER TABLE "products_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_fr" ON "products_fr" ("master_id");

--
-- Indexes for table "products_it"
--
ALTER TABLE "products_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_it" ON "products_it" ("master_id");

--
-- Indexes for table "products_ja"
--
ALTER TABLE "products_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_ja" ON "products_ja" ("master_id");

--
-- Indexes for table "products_ko"
--
ALTER TABLE "products_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_ko" ON "products_ko" ("master_id");

--
-- Indexes for table "products_pl"
--
ALTER TABLE "products_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_pl" ON "products_pl" ("master_id");

--
-- Indexes for table "products_pt"
--
ALTER TABLE "products_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_pt" ON "products_pt" ("master_id");

--
-- Indexes for table "products_ru"
--
ALTER TABLE "products_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_ru" ON "products_ru" ("master_id");

--
-- Indexes for table "products_sw"
--
ALTER TABLE "products_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_sw" ON "products_sw" ("master_id");

--
-- Indexes for table "products_th"
--
ALTER TABLE "products_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_th" ON "products_th" ("master_id");

--
-- Indexes for table "products_tr"
--
ALTER TABLE "products_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_tr" ON "products_tr" ("master_id");

--
-- Indexes for table "products_vi"
--
ALTER TABLE "products_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_vi" ON "products_vi" ("master_id");

--
-- Indexes for table "products_zh"
--
ALTER TABLE "products_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_products_zh" ON "products_zh" ("master_id");

--
-- Indexes for table "product_categories"
--
ALTER TABLE "product_categories"
 ADD PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "slug_product_categories" ON "product_categories" ("slug");

--
-- Indexes for table "product_categories_ar"
--
ALTER TABLE "product_categories_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_ar" ON "product_categories_ar" ("master_id");

--
-- Indexes for table "product_categories_de"
--
ALTER TABLE "product_categories_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_de" ON "product_categories_de" ("master_id");

--
-- Indexes for table "product_categories_es"
--
ALTER TABLE "product_categories_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_es" ON "product_categories_es" ("master_id");

--
-- Indexes for table "product_categories_fr"
--
ALTER TABLE "product_categories_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_fr" ON "product_categories_fr" ("master_id");

--
-- Indexes for table "product_categories_it"
--
ALTER TABLE "product_categories_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_it" ON "product_categories_it" ("master_id");

--
-- Indexes for table "product_categories_ja"
--
ALTER TABLE "product_categories_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_ja" ON "product_categories_ja" ("master_id");

--
-- Indexes for table "product_categories_ko"
--
ALTER TABLE "product_categories_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_ko" ON "product_categories_ko" ("master_id");

--
-- Indexes for table "product_categories_pl"
--
ALTER TABLE "product_categories_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_pl" ON "product_categories_pl" ("master_id");

--
-- Indexes for table "product_categories_pt"
--
ALTER TABLE "product_categories_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_pt" ON "product_categories_pt" ("master_id");

--
-- Indexes for table "product_categories_ru"
--
ALTER TABLE "product_categories_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_ru" ON "product_categories_ru" ("master_id");

--
-- Indexes for table "product_categories_sw"
--
ALTER TABLE "product_categories_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_sw" ON "product_categories_sw" ("master_id");

--
-- Indexes for table "product_categories_th"
--
ALTER TABLE "product_categories_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_th" ON "product_categories_th" ("master_id");

--
-- Indexes for table "product_categories_tr"
--
ALTER TABLE "product_categories_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_tr" ON "product_categories_tr" ("master_id");

--
-- Indexes for table "product_categories_vi"
--
ALTER TABLE "product_categories_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_vi" ON "product_categories_vi" ("master_id");

--
-- Indexes for table "product_categories_zh"
--
ALTER TABLE "product_categories_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_product_categories_zh" ON "product_categories_zh" ("master_id");

--
-- Indexes for table "product_specifications"
--
ALTER TABLE "product_specifications"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_product_specifications_product_id_product_specifications" ON "product_specifications" ("product_id");

--
-- Indexes for table "sectors"
--
ALTER TABLE "sectors"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_sectors_slug_sectors" ON "sectors" ("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "slug_sectors" ON "sectors" ("slug");

--
-- Indexes for table "sectors_ar"
--
ALTER TABLE "sectors_ar"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_ar" ON "sectors_ar" ("master_id");

--
-- Indexes for table "sectors_de"
--
ALTER TABLE "sectors_de"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_de" ON "sectors_de" ("master_id");

--
-- Indexes for table "sectors_es"
--
ALTER TABLE "sectors_es"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_es" ON "sectors_es" ("master_id");

--
-- Indexes for table "sectors_fr"
--
ALTER TABLE "sectors_fr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_fr" ON "sectors_fr" ("master_id");

--
-- Indexes for table "sectors_it"
--
ALTER TABLE "sectors_it"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_it" ON "sectors_it" ("master_id");

--
-- Indexes for table "sectors_ja"
--
ALTER TABLE "sectors_ja"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_ja" ON "sectors_ja" ("master_id");

--
-- Indexes for table "sectors_ko"
--
ALTER TABLE "sectors_ko"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_ko" ON "sectors_ko" ("master_id");

--
-- Indexes for table "sectors_pl"
--
ALTER TABLE "sectors_pl"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_pl" ON "sectors_pl" ("master_id");

--
-- Indexes for table "sectors_pt"
--
ALTER TABLE "sectors_pt"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_pt" ON "sectors_pt" ("master_id");

--
-- Indexes for table "sectors_ru"
--
ALTER TABLE "sectors_ru"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_ru" ON "sectors_ru" ("master_id");

--
-- Indexes for table "sectors_sw"
--
ALTER TABLE "sectors_sw"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_sw" ON "sectors_sw" ("master_id");

--
-- Indexes for table "sectors_th"
--
ALTER TABLE "sectors_th"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_th" ON "sectors_th" ("master_id");

--
-- Indexes for table "sectors_tr"
--
ALTER TABLE "sectors_tr"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_tr" ON "sectors_tr" ("master_id");

--
-- Indexes for table "sectors_vi"
--
ALTER TABLE "sectors_vi"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_vi" ON "sectors_vi" ("master_id");

--
-- Indexes for table "sectors_zh"
--
ALTER TABLE "sectors_zh"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "master_id_sectors_zh" ON "sectors_zh" ("master_id");

--
-- Indexes for table "seo_keywords"
--
ALTER TABLE "seo_keywords"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_seo_keywords_keyword_seo_keywords" ON "seo_keywords" ("keyword");

--
-- Indexes for table "seo_keyword_products"
--
ALTER TABLE "seo_keyword_products"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "product_id_seo_keyword_products" ON "seo_keyword_products" ("product_id");
CREATE UNIQUE INDEX IF NOT EXISTS "keyword_id_seo_keyword_products" ON "seo_keyword_products" ("keyword_id","product_id");

--
-- Indexes for table "seo_page_meta"
--
ALTER TABLE "seo_page_meta"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_seo_page_meta_path_seo_page_meta" ON "seo_page_meta" ("page_path");
CREATE UNIQUE INDEX IF NOT EXISTS "page_path_seo_page_meta" ON "seo_page_meta" ("page_path");

--
-- Indexes for table "site_content"
--
ALTER TABLE "site_content"
 ADD PRIMARY KEY ("id");

--
-- Indexes for table "supported_languages"
--
ALTER TABLE "supported_languages"
 ADD PRIMARY KEY ("code");

--
-- Indexes for table "translations"
--
ALTER TABLE "translations"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_translations_entity_translations" ON "translations" ("entity_type","entity_id");
CREATE INDEX IF NOT EXISTS "idx_translations_language_translations" ON "translations" ("language_code");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_translation_translations" ON "translations" ("entity_type","entity_id","field_name","language_code");

--
-- Indexes for table "ui_translations"
--
ALTER TABLE "ui_translations"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_ui_translations_key_ui_translations" ON "ui_translations" ("translation_key");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_ui_translation_ui_translations" ON "ui_translations" ("translation_key","language_code");

--
-- Indexes for table "users"
--
ALTER TABLE "users"
 ADD PRIMARY KEY ("id");
CREATE UNIQUE INDEX IF NOT EXISTS "email_users" ON "users" ("email");

--
-- Indexes for table "user_roles"
--
ALTER TABLE "user_roles"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_user_roles_user_id_user_roles" ON "user_roles" ("user_id");
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_role_user_roles" ON "user_roles" ("user_id","role");

--
-- Indexes for table "visitor_sessions"
--
ALTER TABLE "visitor_sessions"
 ADD PRIMARY KEY ("id");
CREATE INDEX IF NOT EXISTS "idx_visitor_sessions_started_at_visitor_sessions" ON "visitor_sessions" ("started_at");
CREATE INDEX IF NOT EXISTS "idx_visitor_sessions_country_visitor_sessions" ON "visitor_sessions" ("country");

COMMIT;

