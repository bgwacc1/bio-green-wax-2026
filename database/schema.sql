-- Bio Green Wax Database Schema
-- Compatible with PostgreSQL (Replit dev) and MySQL (Ionos production)
-- For MySQL: Change SERIAL to INT AUTO_INCREMENT, BOOLEAN to TINYINT(1), TEXT to LONGTEXT for large content

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u662768582_bgw`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `about_us_content` (
  `id` varchar(36) NOT NULL,
  `section` varchar(100) NOT NULL,
  `content_key` varchar(100) NOT NULL,
  `content_value` longtext DEFAULT NULL,
  `content_type` varchar(50) DEFAULT 'text',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `about_us_content_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `about_us_content_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `content_value` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bot_visits`
--
-- Creation: Feb 22, 2026 at 02:24 PM
--

CREATE TABLE `bot_visits` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bot_name` varchar(100) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `page_path` varchar(500) NOT NULL,
  `page_type` varchar(100) DEFAULT NULL,
  `language` varchar(20) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `visited_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `certifications` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `certifications_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_enquiries`
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 24, 2026 at 09:45 PM
--

CREATE TABLE `contact_enquiries` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `contact_info` (
  `id` varchar(36) NOT NULL,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  `label` varchar(100) DEFAULT NULL,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_info_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `contact_info_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `directors` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `linkedin_url` text DEFAULT NULL,
  `photo_url` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `directors_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `directors_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `global_operations` (
  `id` varchar(36) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `country` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `operations_type` varchar(100) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `global_operations_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `global_operations_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `location_name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `hero_slides` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` varchar(100) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hero_slides_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `hero_slides_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `subtitle` text DEFAULT NULL,
  `cta_text` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_applications`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_applications` (
  `id` varchar(36) NOT NULL,
  `job_opening_id` varchar(36) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `current_company` varchar(255) DEFAULT NULL,
  `current_position` varchar(255) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `linkedin_url` text DEFAULT NULL,
  `cover_letter` text DEFAULT NULL,
  `why_suitable` text DEFAULT NULL,
  `value_addition` text DEFAULT NULL,
  `cv_url` text DEFAULT NULL,
  `cv_filename` varchar(255) DEFAULT NULL,
  `is_general_application` tinyint(1) DEFAULT 0,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `job_openings` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `employment_type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `responsibilities` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_openings_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `job_openings_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `newsletter_subscribers` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subscribed_at` timestamp NULL DEFAULT current_timestamp(),
  `ip_address` varchar(45) DEFAULT NULL,
  `source` varchar(50) DEFAULT 'website_footer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `news_articles` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news_articles_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `news_articles_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `page_views`
--
-- Creation: Feb 22, 2026 at 01:53 PM
-- Last update: Feb 28, 2026 at 04:22 PM
--

CREATE TABLE `page_views` (
  `id` int(11) NOT NULL,
  `session_id` varchar(50) DEFAULT NULL,
  `page_path` varchar(500) NOT NULL,
  `page_title` varchar(500) DEFAULT NULL,
  `time_on_page` int(11) DEFAULT NULL,
  `scroll_depth` int(11) DEFAULT NULL,
  `viewed_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pending_changes`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `pending_changes` (
  `id` varchar(36) NOT NULL,
  `table_name` varchar(100) NOT NULL,
  `record_id` varchar(36) DEFAULT NULL,
  `change_type` varchar(20) NOT NULL,
  `original_data` longtext DEFAULT NULL,
  `new_data` longtext DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'pending',
  `revision_notes` text DEFAULT NULL,
  `created_by` varchar(36) NOT NULL,
  `reviewed_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reviewed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 22, 2026 at 04:21 PM
--

CREATE TABLE `products` (
  `id` varchar(36) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `category_label` varchar(100) DEFAULT NULL,
  `categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`categories`)),
  `image_url` text DEFAULT NULL,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `applications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`applications`)),
  `packaging` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`packaging`)),
  `is_active` tinyint(1) DEFAULT 1,
  `is_featured` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `priority_order` int(11) DEFAULT 10,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `products_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `full_description` longtext DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `product_categories` (
  `id` varchar(36) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `product_categories_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_specifications`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `product_specifications` (
  `id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `name` varchar(500) DEFAULT NULL,
  `file_name` varchar(500) NOT NULL,
  `file_url` longtext NOT NULL,
  `file_path` text DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `sectors` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_ar`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_ar` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_de`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_de` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_es`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_es` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_fr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_fr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_it`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_it` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_ja`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_ja` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_ko`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_ko` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_pl`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_pl` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_pt`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_pt` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_ru`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_ru` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_sw`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_sw` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_th`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_th` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_tr`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_tr` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_vi`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_vi` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sectors_zh`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `sectors_zh` (
  `id` int(11) NOT NULL,
  `master_id` varchar(36) DEFAULT NULL,
  `name` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo_keywords`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `seo_keywords` (
  `id` varchar(50) NOT NULL,
  `keyword` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `target_page` varchar(100) DEFAULT NULL,
  `priority` int(11) DEFAULT 1,
  `search_volume` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo_keyword_products`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `seo_keyword_products` (
  `id` varchar(50) NOT NULL,
  `keyword_id` varchar(50) NOT NULL,
  `product_id` varchar(100) NOT NULL,
  `relevance_score` int(11) DEFAULT 100,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seo_page_meta`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `seo_page_meta` (
  `id` varchar(50) NOT NULL,
  `page_path` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `keywords` text DEFAULT NULL,
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `canonical_url` varchar(500) DEFAULT NULL,
  `no_index` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_content`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `site_content` (
  `id` varchar(36) NOT NULL,
  `page` varchar(100) NOT NULL,
  `section` varchar(100) NOT NULL,
  `content_key` varchar(100) NOT NULL,
  `content_value` longtext DEFAULT NULL,
  `content_type` varchar(50) DEFAULT 'text',
  `display_order` int(11) DEFAULT 0,
  `synchronized_data` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `supported_languages`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `supported_languages` (
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `native_name` varchar(100) NOT NULL,
  `direction` varchar(3) DEFAULT 'ltr',
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `translations`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `translations` (
  `id` int(11) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` varchar(36) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `translated_text` longtext DEFAULT NULL,
  `is_auto_translated` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ui_translations`
--
-- Creation: Feb 22, 2026 at 01:52 PM
--

CREATE TABLE `ui_translations` (
  `id` int(11) NOT NULL,
  `translation_key` varchar(255) NOT NULL,
  `language_code` varchar(10) NOT NULL,
  `translated_text` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 27, 2026 at 05:33 AM
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_confirmed_at` timestamp NULL DEFAULT NULL,
  `last_sign_in_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--
-- Creation: Feb 22, 2026 at 01:53 PM
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `visitor_sessions`
--
-- Creation: Feb 22, 2026 at 01:52 PM
-- Last update: Feb 28, 2026 at 04:22 PM
--

CREATE TABLE `visitor_sessions` (
  `id` varchar(50) NOT NULL,
  `visitor_id` varchar(100) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `country_code` varchar(10) DEFAULT NULL,
  `browser` varchar(100) DEFAULT NULL,
  `browser_version` varchar(50) DEFAULT NULL,
  `operating_system` varchar(100) DEFAULT NULL,
  `device_type` varchar(50) DEFAULT NULL,
  `screen_width` int(11) DEFAULT NULL,
  `screen_height` int(11) DEFAULT NULL,
  `language` varchar(20) DEFAULT NULL,
  `referrer` text DEFAULT NULL,
  `referrer_domain` varchar(255) DEFAULT NULL,
  `utm_source` varchar(255) DEFAULT NULL,
  `utm_medium` varchar(255) DEFAULT NULL,
  `utm_campaign` varchar(255) DEFAULT NULL,
  `started_at` timestamp NULL DEFAULT current_timestamp(),
  `last_activity_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_new_visitor` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us_content`
--
ALTER TABLE `about_us_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `about_us_content_ar`
--
ALTER TABLE `about_us_content_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_de`
--
ALTER TABLE `about_us_content_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_es`
--
ALTER TABLE `about_us_content_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_fr`
--
ALTER TABLE `about_us_content_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_it`
--
ALTER TABLE `about_us_content_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_ja`
--
ALTER TABLE `about_us_content_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_ko`
--
ALTER TABLE `about_us_content_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_pl`
--
ALTER TABLE `about_us_content_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_pt`
--
ALTER TABLE `about_us_content_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_ru`
--
ALTER TABLE `about_us_content_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_sw`
--
ALTER TABLE `about_us_content_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_th`
--
ALTER TABLE `about_us_content_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_tr`
--
ALTER TABLE `about_us_content_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_vi`
--
ALTER TABLE `about_us_content_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `about_us_content_zh`
--
ALTER TABLE `about_us_content_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `bot_visits`
--
ALTER TABLE `bot_visits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `certifications_ar`
--
ALTER TABLE `certifications_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_de`
--
ALTER TABLE `certifications_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_es`
--
ALTER TABLE `certifications_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_fr`
--
ALTER TABLE `certifications_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_it`
--
ALTER TABLE `certifications_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_ja`
--
ALTER TABLE `certifications_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_ko`
--
ALTER TABLE `certifications_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_pl`
--
ALTER TABLE `certifications_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_pt`
--
ALTER TABLE `certifications_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_ru`
--
ALTER TABLE `certifications_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_sw`
--
ALTER TABLE `certifications_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_th`
--
ALTER TABLE `certifications_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_tr`
--
ALTER TABLE `certifications_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_vi`
--
ALTER TABLE `certifications_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `certifications_zh`
--
ALTER TABLE `certifications_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_enquiries`
--
ALTER TABLE `contact_enquiries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_info`
--
ALTER TABLE `contact_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_info_ar`
--
ALTER TABLE `contact_info_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_de`
--
ALTER TABLE `contact_info_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_es`
--
ALTER TABLE `contact_info_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_fr`
--
ALTER TABLE `contact_info_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_it`
--
ALTER TABLE `contact_info_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_ja`
--
ALTER TABLE `contact_info_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_ko`
--
ALTER TABLE `contact_info_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_pl`
--
ALTER TABLE `contact_info_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_pt`
--
ALTER TABLE `contact_info_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_ru`
--
ALTER TABLE `contact_info_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_sw`
--
ALTER TABLE `contact_info_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_th`
--
ALTER TABLE `contact_info_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_tr`
--
ALTER TABLE `contact_info_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_vi`
--
ALTER TABLE `contact_info_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `contact_info_zh`
--
ALTER TABLE `contact_info_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors`
--
ALTER TABLE `directors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `directors_ar`
--
ALTER TABLE `directors_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_de`
--
ALTER TABLE `directors_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_es`
--
ALTER TABLE `directors_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_fr`
--
ALTER TABLE `directors_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_it`
--
ALTER TABLE `directors_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_ja`
--
ALTER TABLE `directors_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_ko`
--
ALTER TABLE `directors_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_pl`
--
ALTER TABLE `directors_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_pt`
--
ALTER TABLE `directors_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_ru`
--
ALTER TABLE `directors_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_sw`
--
ALTER TABLE `directors_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_th`
--
ALTER TABLE `directors_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_tr`
--
ALTER TABLE `directors_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_vi`
--
ALTER TABLE `directors_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `directors_zh`
--
ALTER TABLE `directors_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations`
--
ALTER TABLE `global_operations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `global_operations_ar`
--
ALTER TABLE `global_operations_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_de`
--
ALTER TABLE `global_operations_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_es`
--
ALTER TABLE `global_operations_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_fr`
--
ALTER TABLE `global_operations_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_it`
--
ALTER TABLE `global_operations_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_ja`
--
ALTER TABLE `global_operations_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_ko`
--
ALTER TABLE `global_operations_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_pl`
--
ALTER TABLE `global_operations_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_pt`
--
ALTER TABLE `global_operations_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_ru`
--
ALTER TABLE `global_operations_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_sw`
--
ALTER TABLE `global_operations_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_th`
--
ALTER TABLE `global_operations_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_tr`
--
ALTER TABLE `global_operations_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_vi`
--
ALTER TABLE `global_operations_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `global_operations_zh`
--
ALTER TABLE `global_operations_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides`
--
ALTER TABLE `hero_slides`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hero_slides_ar`
--
ALTER TABLE `hero_slides_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_de`
--
ALTER TABLE `hero_slides_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_es`
--
ALTER TABLE `hero_slides_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_fr`
--
ALTER TABLE `hero_slides_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_it`
--
ALTER TABLE `hero_slides_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_ja`
--
ALTER TABLE `hero_slides_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_ko`
--
ALTER TABLE `hero_slides_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_pl`
--
ALTER TABLE `hero_slides_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_pt`
--
ALTER TABLE `hero_slides_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_ru`
--
ALTER TABLE `hero_slides_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_sw`
--
ALTER TABLE `hero_slides_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_th`
--
ALTER TABLE `hero_slides_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_tr`
--
ALTER TABLE `hero_slides_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_vi`
--
ALTER TABLE `hero_slides_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `hero_slides_zh`
--
ALTER TABLE `hero_slides_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_opening_id` (`job_opening_id`);

--
-- Indexes for table `job_openings`
--
ALTER TABLE `job_openings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_openings_ar`
--
ALTER TABLE `job_openings_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_de`
--
ALTER TABLE `job_openings_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_es`
--
ALTER TABLE `job_openings_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_fr`
--
ALTER TABLE `job_openings_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_it`
--
ALTER TABLE `job_openings_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_ja`
--
ALTER TABLE `job_openings_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_ko`
--
ALTER TABLE `job_openings_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_pl`
--
ALTER TABLE `job_openings_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_pt`
--
ALTER TABLE `job_openings_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_ru`
--
ALTER TABLE `job_openings_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_sw`
--
ALTER TABLE `job_openings_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_th`
--
ALTER TABLE `job_openings_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_tr`
--
ALTER TABLE `job_openings_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_vi`
--
ALTER TABLE `job_openings_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `job_openings_zh`
--
ALTER TABLE `job_openings_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `news_articles`
--
ALTER TABLE `news_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_news_articles_slug` (`slug`);

--
-- Indexes for table `news_articles_ar`
--
ALTER TABLE `news_articles_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_de`
--
ALTER TABLE `news_articles_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_es`
--
ALTER TABLE `news_articles_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_fr`
--
ALTER TABLE `news_articles_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_it`
--
ALTER TABLE `news_articles_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_ja`
--
ALTER TABLE `news_articles_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_ko`
--
ALTER TABLE `news_articles_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_pl`
--
ALTER TABLE `news_articles_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_pt`
--
ALTER TABLE `news_articles_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_ru`
--
ALTER TABLE `news_articles_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_sw`
--
ALTER TABLE `news_articles_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_th`
--
ALTER TABLE `news_articles_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_tr`
--
ALTER TABLE `news_articles_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_vi`
--
ALTER TABLE `news_articles_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `news_articles_zh`
--
ALTER TABLE `news_articles_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `page_views`
--
ALTER TABLE `page_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `session_id` (`session_id`),
  ADD KEY `idx_page_views_page_path` (`page_path`),
  ADD KEY `idx_page_views_viewed_at` (`viewed_at`);

--
-- Indexes for table `pending_changes`
--
ALTER TABLE `pending_changes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pending_changes_status` (`status`),
  ADD KEY `idx_pending_changes_created_by` (`created_by`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_products_category` (`category`),
  ADD KEY `idx_products_slug` (`slug`);

--
-- Indexes for table `products_ar`
--
ALTER TABLE `products_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_de`
--
ALTER TABLE `products_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_es`
--
ALTER TABLE `products_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_fr`
--
ALTER TABLE `products_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_it`
--
ALTER TABLE `products_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_ja`
--
ALTER TABLE `products_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_ko`
--
ALTER TABLE `products_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_pl`
--
ALTER TABLE `products_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_pt`
--
ALTER TABLE `products_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_ru`
--
ALTER TABLE `products_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_sw`
--
ALTER TABLE `products_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_th`
--
ALTER TABLE `products_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_tr`
--
ALTER TABLE `products_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_vi`
--
ALTER TABLE `products_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `products_zh`
--
ALTER TABLE `products_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `product_categories_ar`
--
ALTER TABLE `product_categories_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_de`
--
ALTER TABLE `product_categories_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_es`
--
ALTER TABLE `product_categories_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_fr`
--
ALTER TABLE `product_categories_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_it`
--
ALTER TABLE `product_categories_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_ja`
--
ALTER TABLE `product_categories_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_ko`
--
ALTER TABLE `product_categories_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_pl`
--
ALTER TABLE `product_categories_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_pt`
--
ALTER TABLE `product_categories_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_ru`
--
ALTER TABLE `product_categories_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_sw`
--
ALTER TABLE `product_categories_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_th`
--
ALTER TABLE `product_categories_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_tr`
--
ALTER TABLE `product_categories_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_vi`
--
ALTER TABLE `product_categories_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_categories_zh`
--
ALTER TABLE `product_categories_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_specifications_product_id` (`product_id`);

--
-- Indexes for table `sectors`
--
ALTER TABLE `sectors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_sectors_slug` (`slug`);

--
-- Indexes for table `sectors_ar`
--
ALTER TABLE `sectors_ar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_de`
--
ALTER TABLE `sectors_de`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_es`
--
ALTER TABLE `sectors_es`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_fr`
--
ALTER TABLE `sectors_fr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_it`
--
ALTER TABLE `sectors_it`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_ja`
--
ALTER TABLE `sectors_ja`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_ko`
--
ALTER TABLE `sectors_ko`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_pl`
--
ALTER TABLE `sectors_pl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_pt`
--
ALTER TABLE `sectors_pt`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_ru`
--
ALTER TABLE `sectors_ru`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_sw`
--
ALTER TABLE `sectors_sw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_th`
--
ALTER TABLE `sectors_th`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_tr`
--
ALTER TABLE `sectors_tr`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_vi`
--
ALTER TABLE `sectors_vi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `sectors_zh`
--
ALTER TABLE `sectors_zh`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_id` (`master_id`);

--
-- Indexes for table `seo_keywords`
--
ALTER TABLE `seo_keywords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_seo_keywords_keyword` (`keyword`);

--
-- Indexes for table `seo_keyword_products`
--
ALTER TABLE `seo_keyword_products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `keyword_id` (`keyword_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `seo_page_meta`
--
ALTER TABLE `seo_page_meta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `page_path` (`page_path`),
  ADD KEY `idx_seo_page_meta_path` (`page_path`);

--
-- Indexes for table `site_content`
--
ALTER TABLE `site_content`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supported_languages`
--
ALTER TABLE `supported_languages`
  ADD PRIMARY KEY (`code`);

--
-- Indexes for table `translations`
--
ALTER TABLE `translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_translation` (`entity_type`,`entity_id`,`field_name`,`language_code`),
  ADD KEY `idx_translations_entity` (`entity_type`,`entity_id`),
  ADD KEY `idx_translations_language` (`language_code`);

--
-- Indexes for table `ui_translations`
--
ALTER TABLE `ui_translations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_ui_translation` (`translation_key`,`language_code`),
  ADD KEY `idx_ui_translations_key` (`translation_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_role` (`user_id`,`role`),
  ADD KEY `idx_user_roles_user_id` (`user_id`);

--
-- Indexes for table `visitor_sessions`
--
ALTER TABLE `visitor_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_visitor_sessions_started_at` (`started_at`),
  ADD KEY `idx_visitor_sessions_country` (`country`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us_content_ar`
--
ALTER TABLE `about_us_content_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_de`
--
ALTER TABLE `about_us_content_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_es`
--
ALTER TABLE `about_us_content_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_fr`
--
ALTER TABLE `about_us_content_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_it`
--
ALTER TABLE `about_us_content_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_ja`
--
ALTER TABLE `about_us_content_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_ko`
--
ALTER TABLE `about_us_content_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_pl`
--
ALTER TABLE `about_us_content_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_pt`
--
ALTER TABLE `about_us_content_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_ru`
--
ALTER TABLE `about_us_content_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_sw`
--
ALTER TABLE `about_us_content_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_th`
--
ALTER TABLE `about_us_content_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_tr`
--
ALTER TABLE `about_us_content_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_vi`
--
ALTER TABLE `about_us_content_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `about_us_content_zh`
--
ALTER TABLE `about_us_content_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bot_visits`
--
ALTER TABLE `bot_visits`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_ar`
--
ALTER TABLE `certifications_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_de`
--
ALTER TABLE `certifications_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_es`
--
ALTER TABLE `certifications_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_fr`
--
ALTER TABLE `certifications_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_it`
--
ALTER TABLE `certifications_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_ja`
--
ALTER TABLE `certifications_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_ko`
--
ALTER TABLE `certifications_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_pl`
--
ALTER TABLE `certifications_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_pt`
--
ALTER TABLE `certifications_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_ru`
--
ALTER TABLE `certifications_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_sw`
--
ALTER TABLE `certifications_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_th`
--
ALTER TABLE `certifications_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_tr`
--
ALTER TABLE `certifications_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_vi`
--
ALTER TABLE `certifications_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications_zh`
--
ALTER TABLE `certifications_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_ar`
--
ALTER TABLE `contact_info_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_de`
--
ALTER TABLE `contact_info_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_es`
--
ALTER TABLE `contact_info_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_fr`
--
ALTER TABLE `contact_info_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_it`
--
ALTER TABLE `contact_info_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_ja`
--
ALTER TABLE `contact_info_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_ko`
--
ALTER TABLE `contact_info_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_pl`
--
ALTER TABLE `contact_info_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_pt`
--
ALTER TABLE `contact_info_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_ru`
--
ALTER TABLE `contact_info_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_sw`
--
ALTER TABLE `contact_info_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_th`
--
ALTER TABLE `contact_info_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_tr`
--
ALTER TABLE `contact_info_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_vi`
--
ALTER TABLE `contact_info_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_info_zh`
--
ALTER TABLE `contact_info_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_ar`
--
ALTER TABLE `directors_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_de`
--
ALTER TABLE `directors_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_es`
--
ALTER TABLE `directors_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_fr`
--
ALTER TABLE `directors_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_it`
--
ALTER TABLE `directors_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_ja`
--
ALTER TABLE `directors_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_ko`
--
ALTER TABLE `directors_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_pl`
--
ALTER TABLE `directors_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_pt`
--
ALTER TABLE `directors_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_ru`
--
ALTER TABLE `directors_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_sw`
--
ALTER TABLE `directors_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_th`
--
ALTER TABLE `directors_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_tr`
--
ALTER TABLE `directors_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_vi`
--
ALTER TABLE `directors_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `directors_zh`
--
ALTER TABLE `directors_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_ar`
--
ALTER TABLE `global_operations_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_de`
--
ALTER TABLE `global_operations_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_es`
--
ALTER TABLE `global_operations_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_fr`
--
ALTER TABLE `global_operations_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_it`
--
ALTER TABLE `global_operations_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_ja`
--
ALTER TABLE `global_operations_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_ko`
--
ALTER TABLE `global_operations_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_pl`
--
ALTER TABLE `global_operations_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_pt`
--
ALTER TABLE `global_operations_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_ru`
--
ALTER TABLE `global_operations_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_sw`
--
ALTER TABLE `global_operations_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_th`
--
ALTER TABLE `global_operations_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_tr`
--
ALTER TABLE `global_operations_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_vi`
--
ALTER TABLE `global_operations_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `global_operations_zh`
--
ALTER TABLE `global_operations_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_ar`
--
ALTER TABLE `hero_slides_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_de`
--
ALTER TABLE `hero_slides_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_es`
--
ALTER TABLE `hero_slides_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_fr`
--
ALTER TABLE `hero_slides_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_it`
--
ALTER TABLE `hero_slides_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_ja`
--
ALTER TABLE `hero_slides_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_ko`
--
ALTER TABLE `hero_slides_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_pl`
--
ALTER TABLE `hero_slides_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_pt`
--
ALTER TABLE `hero_slides_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_ru`
--
ALTER TABLE `hero_slides_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_sw`
--
ALTER TABLE `hero_slides_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_th`
--
ALTER TABLE `hero_slides_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_tr`
--
ALTER TABLE `hero_slides_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_vi`
--
ALTER TABLE `hero_slides_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hero_slides_zh`
--
ALTER TABLE `hero_slides_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_ar`
--
ALTER TABLE `job_openings_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_de`
--
ALTER TABLE `job_openings_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_es`
--
ALTER TABLE `job_openings_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_fr`
--
ALTER TABLE `job_openings_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_it`
--
ALTER TABLE `job_openings_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_ja`
--
ALTER TABLE `job_openings_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_ko`
--
ALTER TABLE `job_openings_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_pl`
--
ALTER TABLE `job_openings_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_pt`
--
ALTER TABLE `job_openings_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_ru`
--
ALTER TABLE `job_openings_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_sw`
--
ALTER TABLE `job_openings_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_th`
--
ALTER TABLE `job_openings_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_tr`
--
ALTER TABLE `job_openings_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_vi`
--
ALTER TABLE `job_openings_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_openings_zh`
--
ALTER TABLE `job_openings_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_ar`
--
ALTER TABLE `news_articles_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_de`
--
ALTER TABLE `news_articles_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_es`
--
ALTER TABLE `news_articles_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_fr`
--
ALTER TABLE `news_articles_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_it`
--
ALTER TABLE `news_articles_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_ja`
--
ALTER TABLE `news_articles_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_ko`
--
ALTER TABLE `news_articles_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_pl`
--
ALTER TABLE `news_articles_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_pt`
--
ALTER TABLE `news_articles_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_ru`
--
ALTER TABLE `news_articles_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_sw`
--
ALTER TABLE `news_articles_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_th`
--
ALTER TABLE `news_articles_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_tr`
--
ALTER TABLE `news_articles_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_vi`
--
ALTER TABLE `news_articles_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `news_articles_zh`
--
ALTER TABLE `news_articles_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `page_views`
--
ALTER TABLE `page_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_ar`
--
ALTER TABLE `products_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_de`
--
ALTER TABLE `products_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_es`
--
ALTER TABLE `products_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_fr`
--
ALTER TABLE `products_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_it`
--
ALTER TABLE `products_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_ja`
--
ALTER TABLE `products_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_ko`
--
ALTER TABLE `products_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_pl`
--
ALTER TABLE `products_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_pt`
--
ALTER TABLE `products_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_ru`
--
ALTER TABLE `products_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_sw`
--
ALTER TABLE `products_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_th`
--
ALTER TABLE `products_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_tr`
--
ALTER TABLE `products_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_vi`
--
ALTER TABLE `products_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_zh`
--
ALTER TABLE `products_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_ar`
--
ALTER TABLE `product_categories_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_de`
--
ALTER TABLE `product_categories_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_es`
--
ALTER TABLE `product_categories_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_fr`
--
ALTER TABLE `product_categories_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_it`
--
ALTER TABLE `product_categories_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_ja`
--
ALTER TABLE `product_categories_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_ko`
--
ALTER TABLE `product_categories_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_pl`
--
ALTER TABLE `product_categories_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_pt`
--
ALTER TABLE `product_categories_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_ru`
--
ALTER TABLE `product_categories_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_sw`
--
ALTER TABLE `product_categories_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_th`
--
ALTER TABLE `product_categories_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_tr`
--
ALTER TABLE `product_categories_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_vi`
--
ALTER TABLE `product_categories_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories_zh`
--
ALTER TABLE `product_categories_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_ar`
--
ALTER TABLE `sectors_ar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_de`
--
ALTER TABLE `sectors_de`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_es`
--
ALTER TABLE `sectors_es`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_fr`
--
ALTER TABLE `sectors_fr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_it`
--
ALTER TABLE `sectors_it`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_ja`
--
ALTER TABLE `sectors_ja`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_ko`
--
ALTER TABLE `sectors_ko`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_pl`
--
ALTER TABLE `sectors_pl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_pt`
--
ALTER TABLE `sectors_pt`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_ru`
--
ALTER TABLE `sectors_ru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_sw`
--
ALTER TABLE `sectors_sw`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_th`
--
ALTER TABLE `sectors_th`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_tr`
--
ALTER TABLE `sectors_tr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_vi`
--
ALTER TABLE `sectors_vi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sectors_zh`
--
ALTER TABLE `sectors_zh`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `translations`
--
ALTER TABLE `translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ui_translations`
--
ALTER TABLE `ui_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `about_us_content_ar`
--
ALTER TABLE `about_us_content_ar`
  ADD CONSTRAINT `about_us_content_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_de`
--
ALTER TABLE `about_us_content_de`
  ADD CONSTRAINT `about_us_content_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_es`
--
ALTER TABLE `about_us_content_es`
  ADD CONSTRAINT `about_us_content_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_fr`
--
ALTER TABLE `about_us_content_fr`
  ADD CONSTRAINT `about_us_content_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_it`
--
ALTER TABLE `about_us_content_it`
  ADD CONSTRAINT `about_us_content_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_ja`
--
ALTER TABLE `about_us_content_ja`
  ADD CONSTRAINT `about_us_content_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_ko`
--
ALTER TABLE `about_us_content_ko`
  ADD CONSTRAINT `about_us_content_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_pl`
--
ALTER TABLE `about_us_content_pl`
  ADD CONSTRAINT `about_us_content_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_pt`
--
ALTER TABLE `about_us_content_pt`
  ADD CONSTRAINT `about_us_content_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_ru`
--
ALTER TABLE `about_us_content_ru`
  ADD CONSTRAINT `about_us_content_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_sw`
--
ALTER TABLE `about_us_content_sw`
  ADD CONSTRAINT `about_us_content_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_th`
--
ALTER TABLE `about_us_content_th`
  ADD CONSTRAINT `about_us_content_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_tr`
--
ALTER TABLE `about_us_content_tr`
  ADD CONSTRAINT `about_us_content_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_vi`
--
ALTER TABLE `about_us_content_vi`
  ADD CONSTRAINT `about_us_content_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `about_us_content_zh`
--
ALTER TABLE `about_us_content_zh`
  ADD CONSTRAINT `about_us_content_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `about_us_content` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_ar`
--
ALTER TABLE `certifications_ar`
  ADD CONSTRAINT `certifications_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_de`
--
ALTER TABLE `certifications_de`
  ADD CONSTRAINT `certifications_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_es`
--
ALTER TABLE `certifications_es`
  ADD CONSTRAINT `certifications_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_fr`
--
ALTER TABLE `certifications_fr`
  ADD CONSTRAINT `certifications_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_it`
--
ALTER TABLE `certifications_it`
  ADD CONSTRAINT `certifications_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_ja`
--
ALTER TABLE `certifications_ja`
  ADD CONSTRAINT `certifications_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_ko`
--
ALTER TABLE `certifications_ko`
  ADD CONSTRAINT `certifications_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_pl`
--
ALTER TABLE `certifications_pl`
  ADD CONSTRAINT `certifications_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_pt`
--
ALTER TABLE `certifications_pt`
  ADD CONSTRAINT `certifications_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_ru`
--
ALTER TABLE `certifications_ru`
  ADD CONSTRAINT `certifications_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_sw`
--
ALTER TABLE `certifications_sw`
  ADD CONSTRAINT `certifications_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_th`
--
ALTER TABLE `certifications_th`
  ADD CONSTRAINT `certifications_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_tr`
--
ALTER TABLE `certifications_tr`
  ADD CONSTRAINT `certifications_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_vi`
--
ALTER TABLE `certifications_vi`
  ADD CONSTRAINT `certifications_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications_zh`
--
ALTER TABLE `certifications_zh`
  ADD CONSTRAINT `certifications_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `certifications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_ar`
--
ALTER TABLE `contact_info_ar`
  ADD CONSTRAINT `contact_info_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_de`
--
ALTER TABLE `contact_info_de`
  ADD CONSTRAINT `contact_info_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_es`
--
ALTER TABLE `contact_info_es`
  ADD CONSTRAINT `contact_info_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_fr`
--
ALTER TABLE `contact_info_fr`
  ADD CONSTRAINT `contact_info_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_it`
--
ALTER TABLE `contact_info_it`
  ADD CONSTRAINT `contact_info_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_ja`
--
ALTER TABLE `contact_info_ja`
  ADD CONSTRAINT `contact_info_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_ko`
--
ALTER TABLE `contact_info_ko`
  ADD CONSTRAINT `contact_info_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_pl`
--
ALTER TABLE `contact_info_pl`
  ADD CONSTRAINT `contact_info_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_pt`
--
ALTER TABLE `contact_info_pt`
  ADD CONSTRAINT `contact_info_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_ru`
--
ALTER TABLE `contact_info_ru`
  ADD CONSTRAINT `contact_info_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_sw`
--
ALTER TABLE `contact_info_sw`
  ADD CONSTRAINT `contact_info_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_th`
--
ALTER TABLE `contact_info_th`
  ADD CONSTRAINT `contact_info_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_tr`
--
ALTER TABLE `contact_info_tr`
  ADD CONSTRAINT `contact_info_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_vi`
--
ALTER TABLE `contact_info_vi`
  ADD CONSTRAINT `contact_info_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contact_info_zh`
--
ALTER TABLE `contact_info_zh`
  ADD CONSTRAINT `contact_info_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `contact_info` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_ar`
--
ALTER TABLE `directors_ar`
  ADD CONSTRAINT `directors_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_de`
--
ALTER TABLE `directors_de`
  ADD CONSTRAINT `directors_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_es`
--
ALTER TABLE `directors_es`
  ADD CONSTRAINT `directors_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_fr`
--
ALTER TABLE `directors_fr`
  ADD CONSTRAINT `directors_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_it`
--
ALTER TABLE `directors_it`
  ADD CONSTRAINT `directors_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_ja`
--
ALTER TABLE `directors_ja`
  ADD CONSTRAINT `directors_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_ko`
--
ALTER TABLE `directors_ko`
  ADD CONSTRAINT `directors_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_pl`
--
ALTER TABLE `directors_pl`
  ADD CONSTRAINT `directors_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_pt`
--
ALTER TABLE `directors_pt`
  ADD CONSTRAINT `directors_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_ru`
--
ALTER TABLE `directors_ru`
  ADD CONSTRAINT `directors_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_sw`
--
ALTER TABLE `directors_sw`
  ADD CONSTRAINT `directors_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_th`
--
ALTER TABLE `directors_th`
  ADD CONSTRAINT `directors_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_tr`
--
ALTER TABLE `directors_tr`
  ADD CONSTRAINT `directors_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_vi`
--
ALTER TABLE `directors_vi`
  ADD CONSTRAINT `directors_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `directors_zh`
--
ALTER TABLE `directors_zh`
  ADD CONSTRAINT `directors_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `directors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_ar`
--
ALTER TABLE `global_operations_ar`
  ADD CONSTRAINT `global_operations_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_de`
--
ALTER TABLE `global_operations_de`
  ADD CONSTRAINT `global_operations_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_es`
--
ALTER TABLE `global_operations_es`
  ADD CONSTRAINT `global_operations_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_fr`
--
ALTER TABLE `global_operations_fr`
  ADD CONSTRAINT `global_operations_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_it`
--
ALTER TABLE `global_operations_it`
  ADD CONSTRAINT `global_operations_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_ja`
--
ALTER TABLE `global_operations_ja`
  ADD CONSTRAINT `global_operations_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_ko`
--
ALTER TABLE `global_operations_ko`
  ADD CONSTRAINT `global_operations_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_pl`
--
ALTER TABLE `global_operations_pl`
  ADD CONSTRAINT `global_operations_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_pt`
--
ALTER TABLE `global_operations_pt`
  ADD CONSTRAINT `global_operations_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_ru`
--
ALTER TABLE `global_operations_ru`
  ADD CONSTRAINT `global_operations_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_sw`
--
ALTER TABLE `global_operations_sw`
  ADD CONSTRAINT `global_operations_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_th`
--
ALTER TABLE `global_operations_th`
  ADD CONSTRAINT `global_operations_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_tr`
--
ALTER TABLE `global_operations_tr`
  ADD CONSTRAINT `global_operations_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_vi`
--
ALTER TABLE `global_operations_vi`
  ADD CONSTRAINT `global_operations_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `global_operations_zh`
--
ALTER TABLE `global_operations_zh`
  ADD CONSTRAINT `global_operations_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `global_operations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_ar`
--
ALTER TABLE `hero_slides_ar`
  ADD CONSTRAINT `hero_slides_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_de`
--
ALTER TABLE `hero_slides_de`
  ADD CONSTRAINT `hero_slides_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_es`
--
ALTER TABLE `hero_slides_es`
  ADD CONSTRAINT `hero_slides_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_fr`
--
ALTER TABLE `hero_slides_fr`
  ADD CONSTRAINT `hero_slides_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_it`
--
ALTER TABLE `hero_slides_it`
  ADD CONSTRAINT `hero_slides_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_ja`
--
ALTER TABLE `hero_slides_ja`
  ADD CONSTRAINT `hero_slides_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_ko`
--
ALTER TABLE `hero_slides_ko`
  ADD CONSTRAINT `hero_slides_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_pl`
--
ALTER TABLE `hero_slides_pl`
  ADD CONSTRAINT `hero_slides_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_pt`
--
ALTER TABLE `hero_slides_pt`
  ADD CONSTRAINT `hero_slides_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_ru`
--
ALTER TABLE `hero_slides_ru`
  ADD CONSTRAINT `hero_slides_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_sw`
--
ALTER TABLE `hero_slides_sw`
  ADD CONSTRAINT `hero_slides_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_th`
--
ALTER TABLE `hero_slides_th`
  ADD CONSTRAINT `hero_slides_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_tr`
--
ALTER TABLE `hero_slides_tr`
  ADD CONSTRAINT `hero_slides_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_vi`
--
ALTER TABLE `hero_slides_vi`
  ADD CONSTRAINT `hero_slides_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `hero_slides_zh`
--
ALTER TABLE `hero_slides_zh`
  ADD CONSTRAINT `hero_slides_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `hero_slides` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_applications`
--
ALTER TABLE `job_applications`
  ADD CONSTRAINT `job_applications_ibfk_1` FOREIGN KEY (`job_opening_id`) REFERENCES `job_openings` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `job_openings_ar`
--
ALTER TABLE `job_openings_ar`
  ADD CONSTRAINT `job_openings_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_de`
--
ALTER TABLE `job_openings_de`
  ADD CONSTRAINT `job_openings_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_es`
--
ALTER TABLE `job_openings_es`
  ADD CONSTRAINT `job_openings_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_fr`
--
ALTER TABLE `job_openings_fr`
  ADD CONSTRAINT `job_openings_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_it`
--
ALTER TABLE `job_openings_it`
  ADD CONSTRAINT `job_openings_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_ja`
--
ALTER TABLE `job_openings_ja`
  ADD CONSTRAINT `job_openings_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_ko`
--
ALTER TABLE `job_openings_ko`
  ADD CONSTRAINT `job_openings_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_pl`
--
ALTER TABLE `job_openings_pl`
  ADD CONSTRAINT `job_openings_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_pt`
--
ALTER TABLE `job_openings_pt`
  ADD CONSTRAINT `job_openings_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_ru`
--
ALTER TABLE `job_openings_ru`
  ADD CONSTRAINT `job_openings_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_sw`
--
ALTER TABLE `job_openings_sw`
  ADD CONSTRAINT `job_openings_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_th`
--
ALTER TABLE `job_openings_th`
  ADD CONSTRAINT `job_openings_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_tr`
--
ALTER TABLE `job_openings_tr`
  ADD CONSTRAINT `job_openings_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_vi`
--
ALTER TABLE `job_openings_vi`
  ADD CONSTRAINT `job_openings_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_openings_zh`
--
ALTER TABLE `job_openings_zh`
  ADD CONSTRAINT `job_openings_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `job_openings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_ar`
--
ALTER TABLE `news_articles_ar`
  ADD CONSTRAINT `news_articles_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_de`
--
ALTER TABLE `news_articles_de`
  ADD CONSTRAINT `news_articles_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_es`
--
ALTER TABLE `news_articles_es`
  ADD CONSTRAINT `news_articles_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_fr`
--
ALTER TABLE `news_articles_fr`
  ADD CONSTRAINT `news_articles_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_it`
--
ALTER TABLE `news_articles_it`
  ADD CONSTRAINT `news_articles_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_ja`
--
ALTER TABLE `news_articles_ja`
  ADD CONSTRAINT `news_articles_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_ko`
--
ALTER TABLE `news_articles_ko`
  ADD CONSTRAINT `news_articles_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_pl`
--
ALTER TABLE `news_articles_pl`
  ADD CONSTRAINT `news_articles_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_pt`
--
ALTER TABLE `news_articles_pt`
  ADD CONSTRAINT `news_articles_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_ru`
--
ALTER TABLE `news_articles_ru`
  ADD CONSTRAINT `news_articles_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_sw`
--
ALTER TABLE `news_articles_sw`
  ADD CONSTRAINT `news_articles_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_th`
--
ALTER TABLE `news_articles_th`
  ADD CONSTRAINT `news_articles_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_tr`
--
ALTER TABLE `news_articles_tr`
  ADD CONSTRAINT `news_articles_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_vi`
--
ALTER TABLE `news_articles_vi`
  ADD CONSTRAINT `news_articles_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `news_articles_zh`
--
ALTER TABLE `news_articles_zh`
  ADD CONSTRAINT `news_articles_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `news_articles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `page_views`
--
ALTER TABLE `page_views`
  ADD CONSTRAINT `page_views_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `visitor_sessions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_ar`
--
ALTER TABLE `products_ar`
  ADD CONSTRAINT `products_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_de`
--
ALTER TABLE `products_de`
  ADD CONSTRAINT `products_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_es`
--
ALTER TABLE `products_es`
  ADD CONSTRAINT `products_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_fr`
--
ALTER TABLE `products_fr`
  ADD CONSTRAINT `products_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_it`
--
ALTER TABLE `products_it`
  ADD CONSTRAINT `products_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_ja`
--
ALTER TABLE `products_ja`
  ADD CONSTRAINT `products_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_ko`
--
ALTER TABLE `products_ko`
  ADD CONSTRAINT `products_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_pl`
--
ALTER TABLE `products_pl`
  ADD CONSTRAINT `products_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_pt`
--
ALTER TABLE `products_pt`
  ADD CONSTRAINT `products_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_ru`
--
ALTER TABLE `products_ru`
  ADD CONSTRAINT `products_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_sw`
--
ALTER TABLE `products_sw`
  ADD CONSTRAINT `products_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_th`
--
ALTER TABLE `products_th`
  ADD CONSTRAINT `products_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_tr`
--
ALTER TABLE `products_tr`
  ADD CONSTRAINT `products_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_vi`
--
ALTER TABLE `products_vi`
  ADD CONSTRAINT `products_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_zh`
--
ALTER TABLE `products_zh`
  ADD CONSTRAINT `products_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_ar`
--
ALTER TABLE `product_categories_ar`
  ADD CONSTRAINT `product_categories_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_de`
--
ALTER TABLE `product_categories_de`
  ADD CONSTRAINT `product_categories_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_es`
--
ALTER TABLE `product_categories_es`
  ADD CONSTRAINT `product_categories_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_fr`
--
ALTER TABLE `product_categories_fr`
  ADD CONSTRAINT `product_categories_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_it`
--
ALTER TABLE `product_categories_it`
  ADD CONSTRAINT `product_categories_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_ja`
--
ALTER TABLE `product_categories_ja`
  ADD CONSTRAINT `product_categories_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_ko`
--
ALTER TABLE `product_categories_ko`
  ADD CONSTRAINT `product_categories_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_pl`
--
ALTER TABLE `product_categories_pl`
  ADD CONSTRAINT `product_categories_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_pt`
--
ALTER TABLE `product_categories_pt`
  ADD CONSTRAINT `product_categories_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_ru`
--
ALTER TABLE `product_categories_ru`
  ADD CONSTRAINT `product_categories_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_sw`
--
ALTER TABLE `product_categories_sw`
  ADD CONSTRAINT `product_categories_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_th`
--
ALTER TABLE `product_categories_th`
  ADD CONSTRAINT `product_categories_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_tr`
--
ALTER TABLE `product_categories_tr`
  ADD CONSTRAINT `product_categories_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_vi`
--
ALTER TABLE `product_categories_vi`
  ADD CONSTRAINT `product_categories_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_categories_zh`
--
ALTER TABLE `product_categories_zh`
  ADD CONSTRAINT `product_categories_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_ar`
--
ALTER TABLE `sectors_ar`
  ADD CONSTRAINT `sectors_ar_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_de`
--
ALTER TABLE `sectors_de`
  ADD CONSTRAINT `sectors_de_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_es`
--
ALTER TABLE `sectors_es`
  ADD CONSTRAINT `sectors_es_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_fr`
--
ALTER TABLE `sectors_fr`
  ADD CONSTRAINT `sectors_fr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_it`
--
ALTER TABLE `sectors_it`
  ADD CONSTRAINT `sectors_it_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_ja`
--
ALTER TABLE `sectors_ja`
  ADD CONSTRAINT `sectors_ja_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_ko`
--
ALTER TABLE `sectors_ko`
  ADD CONSTRAINT `sectors_ko_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_pl`
--
ALTER TABLE `sectors_pl`
  ADD CONSTRAINT `sectors_pl_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_pt`
--
ALTER TABLE `sectors_pt`
  ADD CONSTRAINT `sectors_pt_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_ru`
--
ALTER TABLE `sectors_ru`
  ADD CONSTRAINT `sectors_ru_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_sw`
--
ALTER TABLE `sectors_sw`
  ADD CONSTRAINT `sectors_sw_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_th`
--
ALTER TABLE `sectors_th`
  ADD CONSTRAINT `sectors_th_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_tr`
--
ALTER TABLE `sectors_tr`
  ADD CONSTRAINT `sectors_tr_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_vi`
--
ALTER TABLE `sectors_vi`
  ADD CONSTRAINT `sectors_vi_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sectors_zh`
--
ALTER TABLE `sectors_zh`
  ADD CONSTRAINT `sectors_zh_ibfk_1` FOREIGN KEY (`master_id`) REFERENCES `sectors` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seo_keyword_products`
--
ALTER TABLE `seo_keyword_products`
  ADD CONSTRAINT `seo_keyword_products_ibfk_1` FOREIGN KEY (`keyword_id`) REFERENCES `seo_keywords` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seo_keyword_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
