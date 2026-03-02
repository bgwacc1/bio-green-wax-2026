<?php
header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: all');
header('Cache-Control: public, max-age=3600');

$conn = null;
$dbType = 'mysql';

$databaseUrl = getenv('DATABASE_URL');
if ($databaseUrl) {
    $dbType = 'pgsql';
    try {
        $parsed = parse_url($databaseUrl);
        $host = $parsed['host'] ?? 'localhost';
        $port = $parsed['port'] ?? 5432;
        $dbname = ltrim($parsed['path'] ?? '', '/');
        $user = $parsed['user'] ?? 'postgres';
        $password = $parsed['pass'] ?? '';
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        if (isset($parsed['query'])) {
            parse_str($parsed['query'], $query);
            if (isset($query['sslmode'])) {
                $dsn .= ";sslmode=" . $query['sslmode'];
            }
        }
        $conn = new PDO($dsn, $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Bot renderer DB error: " . $e->getMessage());
    }
} elseif (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
    $host = defined('MYSQL_HOST') ? MYSQL_HOST : 'localhost';
    $user = defined('MYSQL_USER') ? MYSQL_USER : 'root';
    $password = defined('MYSQL_PASSWORD') ? MYSQL_PASSWORD : '';
    $database = defined('MYSQL_DATABASE') ? MYSQL_DATABASE : 'app_database';
    try {
        $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Bot renderer DB error: " . $e->getMessage());
    }
}

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$requestUri = strtok($requestUri, '?');
$requestUri = rtrim($requestUri, '/') ?: '/';

$lang = 'en';
$langPattern = '#^/([a-z]{2})(/|$)#';
if (preg_match($langPattern, $requestUri, $langMatch)) {
    $lang = $langMatch[1];
    $requestUri = preg_replace($langPattern, '/', $requestUri);
    $requestUri = rtrim($requestUri, '/') ?: '/';
}

$serverHost = $_SERVER['HTTP_HOST'] ?? 'biogreenwax.com';
$siteUrl = 'https://' . $serverHost;

function detectBotName($userAgent) {
    $bots = [
        'GPTBot' => 'GPTBot',
        'ChatGPT-User' => 'ChatGPT',
        'ClaudeBot' => 'ClaudeBot',
        'Claude-Web' => 'Claude-Web',
        'CCBot' => 'CCBot',
        'PerplexityBot' => 'PerplexityBot',
        'Googlebot' => 'Googlebot',
        'Bingbot' => 'Bingbot',
        'bingbot' => 'Bingbot',
        'Slurp' => 'Yahoo Slurp',
        'DuckDuckBot' => 'DuckDuckBot',
        'Baiduspider' => 'Baiduspider',
        'YandexBot' => 'YandexBot',
        'facebookexternalhit' => 'Facebook',
        'Twitterbot' => 'Twitterbot',
        'LinkedInBot' => 'LinkedInBot',
        'WhatsApp' => 'WhatsApp',
        'Applebot' => 'Applebot',
        'Bytespider' => 'Bytespider',
        'Amazonbot' => 'Amazonbot',
        'anthropic-ai' => 'Anthropic',
        'cohere-ai' => 'Cohere',
        'Google-Extended' => 'Google-Extended',
    ];
    foreach ($bots as $pattern => $name) {
        if (stripos($userAgent, $pattern) !== false) {
            return $name;
        }
    }
    return 'Unknown Bot';
}

function logBotVisit($conn, $botName, $userAgent, $pagePath, $pageType, $lang, $domain) {
    if (!$conn) return;
    try {
        $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        if (strpos($ipAddress, ',') !== false) {
            $ipAddress = trim(explode(',', $ipAddress)[0]);
        }

        $country = '';
        $countryCode = '';
        $city = '';

        $uaCol = 'user_agent';
        try { $conn->query("SELECT bot_user_agent FROM bot_visits LIMIT 0"); $uaCol = 'bot_user_agent'; } catch (Exception $e) {}

        $stmt = $conn->prepare("INSERT INTO bot_visits (bot_name, {$uaCol}, ip_address, country, country_code, city, page_path, page_type, language, domain) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$botName, substr($userAgent, 0, 500), $ipAddress, $country, $countryCode, $city, $pagePath, $pageType, $lang, $domain]);

        if ($ipAddress && $ipAddress !== '127.0.0.1' && $ipAddress !== '::1') {
            $geoUrl = "http://ip-api.com/json/{$ipAddress}?fields=status,country,countryCode,city";
            $geoContext = stream_context_create(['http' => ['timeout' => 1]]);
            $geoData = @file_get_contents($geoUrl, false, $geoContext);
            if ($geoData) {
                $geo = json_decode($geoData, true);
                if ($geo && ($geo['status'] ?? '') === 'success') {
                    $lastId = $conn->lastInsertId();
                    $stmt = $conn->prepare("UPDATE bot_visits SET country = ?, country_code = ?, city = ? WHERE id = ?");
                    $stmt->execute([$geo['country'] ?? '', $geo['countryCode'] ?? '', $geo['city'] ?? '', $lastId]);
                }
            }
        }
    } catch (Exception $e) {
        error_log("Bot visit logging error: " . $e->getMessage());
    }
}

$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
$botName = detectBotName($userAgent);
$siteName = 'Bio Green Wax Ltd';

function e($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function getTableName($base, $lang) {
    if ($lang === 'en') return $base;
    $supported = ['zh','es','fr','ar','pt','ru','de','ja','sw','tr','vi','ko','th','it','pl'];
    if (in_array($lang, $supported)) return $base . '_' . $lang;
    return $base;
}

function fetchAll($conn, $table, $where = '', $params = []) {
    if (!$conn) return [];
    try {
        $sql = "SELECT * FROM $table" . ($where ? " WHERE $where" : "");
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    } catch (PDOException $e) {
        error_log("Bot renderer query error ($table): " . $e->getMessage());
        return [];
    }
}

function renderHead($title, $description, $url, $keywords = '') {
    global $siteUrl, $siteName;
    $fullUrl = $siteUrl . $url;
    return '<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>' . e($title) . '</title>
<meta name="description" content="' . e($description) . '">
' . ($keywords ? '<meta name="keywords" content="' . e($keywords) . '">' : '') . '
<meta name="author" content="' . e($siteName) . '">
<link rel="canonical" href="' . e($fullUrl) . '">
<meta property="og:title" content="' . e($title) . '">
<meta property="og:description" content="' . e($description) . '">
<meta property="og:type" content="website">
<meta property="og:url" content="' . e($fullUrl) . '">
<meta property="og:site_name" content="' . e($siteName) . '">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="' . e($title) . '">
<meta name="twitter:description" content="' . e($description) . '">
</head>
<body>';
}

function renderFooter() {
    global $siteUrl, $siteName;
    return '<footer>
<p>&copy; ' . date('Y') . ' ' . e($siteName) . '. All rights reserved.</p>
<p>Bio Green Wax Ltd, 128 City Road, London, United Kingdom, EC1V 2NX</p>
<p>Email: sales@biogreenwax.com | Phone: +44 20 7101 3847</p>
</footer>
</body>
</html>';
}

function renderNav() {
    global $siteUrl;
    return '<nav>
<a href="/">Home</a> |
<a href="/about">About Us</a> |
<a href="/products">Products</a> |
<a href="/sectors">Sectors</a> |
<a href="/news">News</a> |
<a href="/certifications">Certifications</a> |
<a href="/careers">Careers</a> |
<a href="/contact">Contact</a>
</nav>';
}

function renderHomePage($conn, $lang) {
    global $siteName;
    $html = renderHead(
        "$siteName | Premium Edible Oils & Industrial Waxes UK",
        "Bio Green Wax Ltd is a leading UK supplier of premium edible oils, plant-based waxes, and industrial petrochemical waxes. Quality products for food, cosmetics, and manufacturing industries.",
        "/",
        "edible oils, sunflower oil, palm oil, coconut oil, plant waxes, paraffin wax, industrial wax, UK supplier"
    );
    $html .= renderNav();

    $html .= '<main>';
    $html .= '<section><h1>Premium Quality Oils & Waxes — Trusted by Industries Worldwide</h1>';
    $html .= '<p>Bio Green Wax Ltd is a UK-based company specializing in sourcing, processing, and distributing high-quality edible oils and industrial waxes for businesses worldwide.</p>';
    $html .= '<p>We supply RSPO SG certified palm oil, EUDR compliant soy and palm products, and ISCC-EU certified biofuels feedstock.</p></section>';

    $table = getTableName('products', $lang);
    $products = fetchAll($conn, $table, 'is_active = true AND is_featured = true', []);
    if (!empty($products)) {
        $html .= '<section><h2>Featured Products</h2>';
        foreach ($products as $p) {
            $html .= '<article>';
            $html .= '<h3><a href="/products/' . e($p['slug']) . '">' . e($p['name']) . '</a></h3>';
            $html .= '<p>' . e($p['description']) . '</p>';
            if (!empty($p['category_label'])) {
                $html .= '<p>Category: ' . e($p['category_label']) . '</p>';
            }
            $html .= '</article>';
        }
        $html .= '</section>';
    }

    $table = getTableName('sectors', $lang);
    $sectors = fetchAll($conn, $table, 'is_active = true', []);
    if (!empty($sectors)) {
        $html .= '<section><h2>Industries We Serve</h2>';
        foreach ($sectors as $s) {
            $html .= '<article>';
            $html .= '<h3><a href="/sectors/' . e($s['slug']) . '">' . e($s['name']) . '</a></h3>';
            $html .= '<p>' . e($s['description']) . '</p>';
            $html .= '</article>';
        }
        $html .= '</section>';
    }

    $table = getTableName('news_articles', $lang);
    $news = fetchAll($conn, $table, 'is_published = true', []);
    if (!empty($news)) {
        usort($news, function($a, $b) { return strtotime($b['published_at'] ?? $b['created_at']) - strtotime($a['published_at'] ?? $a['created_at']); });
        $html .= '<section><h2>Latest News</h2>';
        foreach (array_slice($news, 0, 3) as $n) {
            $html .= '<article>';
            $html .= '<h3><a href="/news/' . e($n['slug']) . '">' . e($n['title']) . '</a></h3>';
            $html .= '<p>' . e($n['excerpt']) . '</p>';
            $html .= '</article>';
        }
        $html .= '</section>';
    }

    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderAboutPage($conn, $lang) {
    global $siteName;
    $table = getTableName('about_us_content', $lang);
    $content = fetchAll($conn, $table);
    $contentMap = [];
    foreach ($content as $c) {
        $contentMap[$c['section']][$c['content_key']] = $c['content_value'];
    }

    $title = $contentMap['hero']['title'] ?? 'About Bio Green Wax';
    $subtitle = $contentMap['hero']['subtitle'] ?? 'Your trusted UK partner for premium edible oils and industrial waxes.';

    $html = renderHead(
        "$title | $siteName",
        $subtitle,
        "/about",
        "about bio green wax, UK oil supplier, sustainable oils, company history"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<section><h1>' . e($title) . '</h1>';
    $html .= '<p>' . e($subtitle) . '</p></section>';

    if (isset($contentMap['story'])) {
        $html .= '<section><h2>' . e($contentMap['story']['title'] ?? 'Our Story') . '</h2>';
        $paragraphs = explode("\n\n", $contentMap['story']['content'] ?? '');
        foreach ($paragraphs as $p) {
            if (trim($p)) $html .= '<p>' . e(trim($p)) . '</p>';
        }
        $html .= '</section>';
    }

    if (isset($contentMap['experience'])) {
        $html .= '<section><h2>' . e($contentMap['experience']['title'] ?? 'Our Experience') . '</h2>';
        $html .= '<p>' . e($contentMap['experience']['content'] ?? '') . '</p></section>';
    }

    if (isset($contentMap['mission'])) {
        $html .= '<section><h2>' . e($contentMap['mission']['title'] ?? 'Our Mission') . '</h2>';
        $html .= '<p>' . e($contentMap['mission']['content'] ?? '') . '</p></section>';
    }

    if (isset($contentMap['director_message'])) {
        $html .= '<section><h2>' . e($contentMap['director_message']['title'] ?? 'Director Message') . '</h2>';
        $paragraphs = explode("\n\n", $contentMap['director_message']['content'] ?? '');
        foreach ($paragraphs as $p) {
            if (trim($p)) $html .= '<p>' . e(trim($p)) . '</p>';
        }
        $html .= '<p><strong>' . e($contentMap['director_message']['signature'] ?? '') . '</strong></p>';
        $html .= '<p>' . e($contentMap['director_message']['signature_title'] ?? '') . '</p>';
        $html .= '</section>';
    }

    if (isset($contentMap['company_info'])) {
        $html .= '<section><h2>Company Information</h2>';
        $html .= '<p>Company Number: ' . e($contentMap['company_info']['company_number'] ?? '') . '</p>';
        $html .= '<p>Incorporated: ' . e($contentMap['company_info']['incorporated_date'] ?? '') . '</p>';
        $html .= '<p>Registered Address: ' . e($contentMap['company_info']['registered_address'] ?? '') . '</p>';
        $html .= '</section>';
    }

    $table = getTableName('directors', $lang);
    $directors = fetchAll($conn, $table, 'is_active = true', []);
    if (!empty($directors)) {
        $html .= '<section><h2>Our Leadership</h2>';
        foreach ($directors as $d) {
            $html .= '<article>';
            $html .= '<h3>' . e($d['name']) . '</h3>';
            if (!empty($d['title'])) $html .= '<p>' . e($d['title']) . '</p>';
            if (!empty($d['bio'])) $html .= '<p>' . e($d['bio']) . '</p>';
            $html .= '</article>';
        }
        $html .= '</section>';
    }

    $table = getTableName('global_operations', $lang);
    $operations = fetchAll($conn, $table, 'is_active = true', []);
    if (!empty($operations)) {
        $html .= '<section><h2>Global Operations</h2>';
        foreach ($operations as $o) {
            $html .= '<article>';
            $html .= '<h3>' . e($o['location_name']) . ', ' . e($o['country']) . '</h3>';
            $html .= '<p>' . e($o['description']) . '</p>';
            if (!empty($o['operations_type'])) $html .= '<p>Operations: ' . e($o['operations_type']) . '</p>';
            $html .= '</article>';
        }
        $html .= '</section>';
    }

    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderProductsPage($conn, $lang) {
    global $siteName;
    $html = renderHead(
        "Products | $siteName",
        "Explore our comprehensive range of premium edible oils, plant-based waxes, industrial waxes, oleochemicals, and custom wax blends.",
        "/products",
        "edible oils, palm oil, sunflower oil, coconut oil, soy oil, plant waxes, industrial waxes, oleochemicals, wax blends"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<h1>Our Products</h1>';
    $html .= '<p>Bio Green Wax Ltd offers a comprehensive range of premium quality oils and waxes for industries worldwide.</p>';

    $table = getTableName('products', $lang);
    $products = fetchAll($conn, $table, 'is_active = true', []);

    $categories = [];
    foreach ($products as $p) {
        $cat = $p['category'] ?? 'other';
        $categories[$cat][] = $p;
    }

    $categoryLabels = [
        'edible-oils' => 'Edible Oils',
        'plant-based-waxes' => 'Plant-Based Waxes',
        'industrial-waxes' => 'Industrial Waxes',
        'oleochemicals' => 'Oleochemicals',
        'wax-blends' => 'Wax Blends'
    ];

    foreach ($categories as $cat => $prods) {
        $label = $categoryLabels[$cat] ?? ucfirst(str_replace('-', ' ', $cat));
        $html .= '<section><h2>' . e($label) . '</h2>';
        foreach ($prods as $p) {
            $html .= '<article>';
            $html .= '<h3><a href="/products/' . e($p['slug']) . '">' . e($p['name']) . '</a></h3>';
            $html .= '<p>' . e($p['description']) . '</p>';
            if (!empty($p['applications'])) {
                $html .= '<p>Applications: ' . e($p['applications']) . '</p>';
            }
            $html .= '</article>';
        }
        $html .= '</section>';
    }

    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderProductDetailPage($conn, $lang, $slug) {
    global $siteName;
    $table = getTableName('products', $lang);
    $products = fetchAll($conn, $table, 'slug = :slug AND is_active = true', [':slug' => $slug]);

    if (empty($products)) {
        return render404Page();
    }

    $p = $products[0];
    $html = renderHead(
        e($p['name']) . " | $siteName",
        $p['description'] ?? "Premium quality {$p['name']} from Bio Green Wax Ltd.",
        "/products/$slug",
        $p['name'] . ", " . ($p['category_label'] ?? '') . ", Bio Green Wax"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<article>';
    $html .= '<h1>' . e($p['name']) . '</h1>';
    if (!empty($p['category_label'])) {
        $html .= '<p>Category: ' . e($p['category_label']) . '</p>';
    }
    $html .= '<p>' . e($p['description']) . '</p>';

    if (!empty($p['full_description'])) {
        $paragraphs = explode("\n\n", $p['full_description']);
        foreach ($paragraphs as $para) {
            if (trim($para)) $html .= '<p>' . e(trim($para)) . '</p>';
        }
    }

    if (!empty($p['specifications'])) {
        $html .= '<h2>Specifications</h2>';
        $html .= '<p>' . e($p['specifications']) . '</p>';
    }

    if (!empty($p['applications'])) {
        $html .= '<h2>Applications</h2>';
        $html .= '<p>' . e($p['applications']) . '</p>';
    }

    if (!empty($p['packaging'])) {
        $html .= '<h2>Packaging</h2>';
        $html .= '<p>' . e($p['packaging']) . '</p>';
    }

    $html .= '</article>';
    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderSectorsPage($conn, $lang) {
    global $siteName;
    $html = renderHead(
        "Industries & Sectors | $siteName",
        "Bio Green Wax Ltd serves diverse industries including food manufacturing, cosmetics, pharmaceuticals, and industrial applications.",
        "/sectors",
        "food industry oils, cosmetics wax, pharmaceutical ingredients, industrial wax applications"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<h1>Industries We Serve</h1>';
    $html .= '<p>Bio Green Wax Ltd provides premium oils and waxes to a wide range of industries worldwide.</p>';

    $table = getTableName('sectors', $lang);
    $sectors = fetchAll($conn, $table, 'is_active = true', []);

    foreach ($sectors as $s) {
        $html .= '<article>';
        $html .= '<h3><a href="/sectors/' . e($s['slug']) . '">' . e($s['name']) . '</a></h3>';
        $html .= '<p>' . e($s['description']) . '</p>';
        $html .= '</article>';
    }

    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderSectorDetailPage($conn, $lang, $slug) {
    global $siteName;
    $table = getTableName('sectors', $lang);
    $sectors = fetchAll($conn, $table, 'slug = :slug AND is_active = true', [':slug' => $slug]);

    if (empty($sectors)) {
        return render404Page();
    }

    $s = $sectors[0];
    $html = renderHead(
        e($s['name']) . " | $siteName",
        $s['description'] ?? "Learn how Bio Green Wax serves the {$s['name']} sector.",
        "/sectors/$slug"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<article>';
    $html .= '<h1>' . e($s['name']) . '</h1>';
    $html .= '<p>' . e($s['description']) . '</p>';
    $html .= '</article>';
    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderNewsPage($conn, $lang) {
    global $siteName;
    $html = renderHead(
        "News & Updates | $siteName",
        "Stay updated with the latest news, industry insights, and company updates from Bio Green Wax Ltd.",
        "/news",
        "bio green wax news, oil industry updates, wax industry news"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<h1>News & Updates</h1>';

    $table = getTableName('news_articles', $lang);
    $articles = fetchAll($conn, $table, 'is_published = true', []);
    usort($articles, function($a, $b) { return strtotime($b['published_at'] ?? $b['created_at']) - strtotime($a['published_at'] ?? $a['created_at']); });

    foreach ($articles as $a) {
        $html .= '<article>';
        $html .= '<h2><a href="/news/' . e($a['slug']) . '">' . e($a['title']) . '</a></h2>';
        $html .= '<p>' . e($a['excerpt']) . '</p>';
        if (!empty($a['published_at'])) {
            $html .= '<time datetime="' . e($a['published_at']) . '">Published: ' . e(date('F j, Y', strtotime($a['published_at']))) . '</time>';
        }
        $html .= '</article>';
    }

    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderNewsDetailPage($conn, $lang, $slug) {
    global $siteName;
    $table = getTableName('news_articles', $lang);
    $articles = fetchAll($conn, $table, 'slug = :slug AND is_published = true', [':slug' => $slug]);

    if (empty($articles)) {
        return render404Page();
    }

    $a = $articles[0];
    $html = renderHead(
        e($a['title']) . " | $siteName",
        $a['excerpt'] ?? "Read the latest from Bio Green Wax Ltd.",
        "/news/$slug"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<article>';
    $html .= '<h1>' . e($a['title']) . '</h1>';
    if (!empty($a['published_at'])) {
        $html .= '<time datetime="' . e($a['published_at']) . '">Published: ' . e(date('F j, Y', strtotime($a['published_at']))) . '</time>';
    }
    if (!empty($a['content'])) {
        $paragraphs = explode("\n\n", $a['content']);
        foreach ($paragraphs as $p) {
            if (trim($p)) $html .= '<p>' . e(trim($p)) . '</p>';
        }
    }
    $html .= '</article>';
    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderCertificationsPage($conn, $lang) {
    global $siteName;
    $html = renderHead(
        "Certifications | $siteName",
        "Bio Green Wax Ltd holds RSPO SG, EUDR, and ISCC-EU certifications, ensuring the highest standards of quality and sustainability.",
        "/certifications",
        "RSPO certification, EUDR compliance, ISCC-EU, sustainable palm oil, quality certifications"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<h1>Our Certifications</h1>';
    $html .= '<p>At Bio Green Wax Ltd, quality and sustainability are at the core of everything we do. Our certifications demonstrate our commitment to responsible sourcing and environmental stewardship.</p>';

    $table = getTableName('certifications', $lang);
    $certs = fetchAll($conn, $table, 'is_active = true', []);

    foreach ($certs as $c) {
        $html .= '<article>';
        $html .= '<h2>' . e($c['title'] ?? $c['name']) . '</h2>';
        $html .= '<p>' . e($c['description']) . '</p>';
        $html .= '</article>';
    }

    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderContactPage() {
    global $siteName;
    $html = renderHead(
        "Contact Us | $siteName",
        "Get in touch with Bio Green Wax Ltd. Contact us for enquiries about edible oils, industrial waxes, and custom blending solutions.",
        "/contact",
        "contact bio green wax, oil supplier enquiry, wax supplier contact"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<h1>Contact Us</h1>';
    $html .= '<section>';
    $html .= '<h2>Get in Touch</h2>';
    $html .= '<p>We would love to hear from you. Whether you have a question about our products, pricing, or anything else, our team is ready to answer all your questions.</p>';
    $html .= '<p><strong>Email:</strong> sales@biogreenwax.com</p>';
    $html .= '<p><strong>Phone:</strong> +44 20 7101 3847</p>';
    $html .= '<p><strong>WhatsApp:</strong> +44 7700 900123</p>';
    $html .= '<h2>Office Address</h2>';
    $html .= '<p>Bio Green Wax Ltd<br>128 City Road<br>London, United Kingdom<br>EC1V 2NX</p>';
    $html .= '</section>';
    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function renderCareersPage() {
    global $siteName;
    $html = renderHead(
        "Careers | $siteName",
        "Join Bio Green Wax Ltd. Explore career opportunities in the oils and waxes industry.",
        "/careers",
        "careers bio green wax, oil industry jobs, wax industry careers"
    );
    $html .= renderNav();
    $html .= '<main>';
    $html .= '<h1>Careers at Bio Green Wax</h1>';
    $html .= '<p>Join our growing team and be part of a company that is shaping the future of sustainable oils and waxes.</p>';
    $html .= '</main>';
    $html .= renderFooter();
    return $html;
}

function render404Page() {
    global $siteName;
    http_response_code(404);
    $html = renderHead("Page Not Found | $siteName", "The page you requested could not be found.", "/404");
    $html .= renderNav();
    $html .= '<main><h1>Page Not Found</h1><p>The page you are looking for does not exist.</p><p><a href="/">Return to Home</a></p></main>';
    $html .= renderFooter();
    return $html;
}

if (preg_match('#^/products/([a-z0-9-]+)$#', $requestUri, $m)) {
    logBotVisit($conn, $botName, $userAgent, $requestUri, 'product_detail', $lang, $serverHost);
    echo renderProductDetailPage($conn, $lang, $m[1]);
} elseif (preg_match('#^/sectors/([a-z0-9-]+)$#', $requestUri, $m)) {
    logBotVisit($conn, $botName, $userAgent, $requestUri, 'sector_detail', $lang, $serverHost);
    echo renderSectorDetailPage($conn, $lang, $m[1]);
} elseif (preg_match('#^/news/([a-z0-9-]+)$#', $requestUri, $m)) {
    logBotVisit($conn, $botName, $userAgent, $requestUri, 'news_detail', $lang, $serverHost);
    echo renderNewsDetailPage($conn, $lang, $m[1]);
} elseif ($requestUri === '/' || $requestUri === '/home') {
    logBotVisit($conn, $botName, $userAgent, '/', 'home', $lang, $serverHost);
    echo renderHomePage($conn, $lang);
} elseif ($requestUri === '/about') {
    logBotVisit($conn, $botName, $userAgent, '/about', 'about', $lang, $serverHost);
    echo renderAboutPage($conn, $lang);
} elseif ($requestUri === '/products') {
    logBotVisit($conn, $botName, $userAgent, '/products', 'products', $lang, $serverHost);
    echo renderProductsPage($conn, $lang);
} elseif ($requestUri === '/sectors') {
    logBotVisit($conn, $botName, $userAgent, '/sectors', 'sectors', $lang, $serverHost);
    echo renderSectorsPage($conn, $lang);
} elseif ($requestUri === '/news') {
    logBotVisit($conn, $botName, $userAgent, '/news', 'news', $lang, $serverHost);
    echo renderNewsPage($conn, $lang);
} elseif ($requestUri === '/certifications') {
    logBotVisit($conn, $botName, $userAgent, '/certifications', 'certifications', $lang, $serverHost);
    echo renderCertificationsPage($conn, $lang);
} elseif ($requestUri === '/contact') {
    logBotVisit($conn, $botName, $userAgent, '/contact', 'contact', $lang, $serverHost);
    echo renderContactPage();
} elseif ($requestUri === '/careers') {
    logBotVisit($conn, $botName, $userAgent, '/careers', 'careers', $lang, $serverHost);
    echo renderCareersPage();
} else {
    logBotVisit($conn, $botName, $userAgent, $requestUri, '404', $lang, $serverHost);
    echo render404Page();
}
