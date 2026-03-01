<?php
// Setup Error Logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');
error_reporting(E_ALL);

set_exception_handler(function ($e) {
    error_log("Uncaught Exception: " . $e->getMessage() . " in " . $e->getFile() . " on line " . $e->getLine());
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error', 'message' => $e->getMessage()]);
    exit;
});

set_error_handler(function ($level, $message, $file, $line) {
    if (!(error_reporting() & $level)) {
        return false;
    }
    error_log("Error [$level]: $message in $file on line $line");
    throw new ErrorException($message, 0, $level, $file, $line);
});

ini_set('post_max_size', '50M');
ini_set('upload_max_filesize', '50M');
ini_set('memory_limit', '256M');
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection - supports PostgreSQL (Replit) and MySQL (Ionos)
$conn = null;
$dbType = 'mysql'; // Default to MySQL

// Check for PostgreSQL (Replit development)
$databaseUrl = getenv('DATABASE_URL');
if ($databaseUrl) {
    $dbType = 'pgsql';
    $jwtSecret = getenv('JWT_SECRET') ?: 'dev-secret-key-change-in-production';
    try {
        // Parse the DATABASE_URL and build a PDO DSN
        $parsed = parse_url($databaseUrl);
        $host = $parsed['host'] ?? 'localhost';
        $port = $parsed['port'] ?? 5432;
        $dbname = ltrim($parsed['path'] ?? '', '/');
        $user = $parsed['user'] ?? 'postgres';
        $password = $parsed['pass'] ?? '';

        // Build PDO DSN for PostgreSQL
        $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
        if (isset($parsed['query'])) {
            $queryParams = [];
            parse_str($parsed['query'], $queryParams);
            if (isset($queryParams['sslmode'])) {
                $dsn .= ";sslmode=" . $queryParams['sslmode'];
            }
        }

        $conn = new PDO($dsn, $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("PostgreSQL connection failed: " . $e->getMessage());
        $conn = null;
    }
} elseif (file_exists(__DIR__ . '/config.php')) {
    // Load config file (for Ionos hosting)
    require_once __DIR__ . '/config.php';
    $host = defined('MYSQL_HOST') ? MYSQL_HOST : 'localhost';
    $user = defined('MYSQL_USER') ? MYSQL_USER : 'root';
    $password = defined('MYSQL_PASSWORD') ? MYSQL_PASSWORD : '';
    $database = defined('MYSQL_DATABASE') ? MYSQL_DATABASE : 'app_database';
    $jwtSecret = defined('JWT_SECRET') ? JWT_SECRET : 'your-secret-key';
    try {
        $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("MySQL connection failed: " . $e->getMessage());
        $conn = null;
    }
} else {
    // Use environment variables (for development with MySQL)
    $host = getenv('MYSQL_HOST') ?: 'localhost';
    $user = getenv('MYSQL_USER') ?: 'root';
    $password = getenv('MYSQL_PASSWORD') ?: '';
    $database = getenv('MYSQL_DATABASE') ?: 'app_database';
    $jwtSecret = getenv('JWT_SECRET') ?: 'your-secret-key';
    try {
        $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("MySQL connection failed: " . $e->getMessage());
        $conn = null;
    }
}

function generateUUID()
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0xffff)
    );
}

function jsonResponse($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function getInput()
{
    return json_decode(file_get_contents('php://input'), true) ?: [];
}

function base64UrlEncode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode($data)
{
    return base64_decode(strtr($data, '-_', '+/'));
}

function createJWT($userId, $email, $secret)
{
    $header = base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64UrlEncode(json_encode([
        'sub' => $userId,
        'email' => $email,
        'exp' => time() + (24 * 60 * 60),
        'iat' => time()
    ]));
    $signature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", $secret, true));
    return "$header.$payload.$signature";
}

function verifyJWT($token, $secret)
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    list($header, $payload, $signature) = $parts;
    $validSignature = base64UrlEncode(hash_hmac('sha256', "$header.$payload", $secret, true));

    if (!hash_equals($validSignature, $signature)) {
        return null;
    }

    $data = json_decode(base64UrlDecode($payload), true);
    if (!$data) {
        return null;
    }
    if ($data['exp'] < time()) {
        return null;
    }

    return $data;
}

function getCurrentUser($jwtSecret)
{
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!$auth) {
        $serverAuth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        if ($serverAuth) {
            $auth = $serverAuth;
        }
    }

    if (!preg_match('/Bearer\s+(.+)/i', $auth, $matches))
        return null;

    return verifyJWT($matches[1], $jwtSecret);
}

function requireAuth($jwtSecret)
{
    $user = getCurrentUser($jwtSecret);
    if (!$user) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        $serverAuth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
        $uri = $_SERVER['REQUEST_URI'] ?? '?';
        $debugMsg = date('H:i:s') . " AUTH_FAIL[$uri]: header=" . ($auth ? 'len:' . strlen($auth) : 'EMPTY') . " server=" . ($serverAuth ? 'len:' . strlen($serverAuth) : 'EMPTY');
        file_put_contents('/tmp/auth_debug.log', $debugMsg . "\n", FILE_APPEND);
        jsonResponse(['error' => 'Not authenticated'], 401);
    }
    return $user;
}

function checkDbConnection($conn)
{
    if (!$conn) {
        jsonResponse(['error' => 'Database not available'], 500);
    }
}

// Language helper - fetches translated fields from language-specific tables
function getTranslatedFields($conn, $table, $masterId, $langCode, $fields)
{
    if ($langCode === 'en' || empty($langCode)) {
        return []; // English uses master table, no translation needed
    }

    $validLanguages = ['zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];
    if (!in_array($langCode, $validLanguages)) {
        return [];
    }

    $langTable = "{$table}_{$langCode}";
    $selectFields = implode(', ', $fields);

    try {
        $stmt = $conn->prepare("SELECT $selectFields FROM $langTable WHERE master_id = ?");
        $stmt->execute([$masterId]);
        return $stmt->fetch() ?: [];
    } catch (Exception $e) {
        return [];
    }
}

function stripBase64FromList(&$items, $table, $field = 'image_url')
{
    foreach ($items as &$item) {
        if (isset($item[$field]) && is_string($item[$field]) && strlen($item[$field]) > 500 && preg_match('/^data:image\//', $item[$field])) {
            $item[$field] = "/api/images/{$table}/{$item['id']}";
        }
    }
}

function saveBase64ImageToFile($base64Data, $folder, $id)
{
    if (!$base64Data || !is_string($base64Data) || !preg_match('/^data:image\/([\w+]+);base64,(.+)$/', $base64Data, $matches)) {
        return $base64Data;
    }

    $ext = strtolower($matches[1]);
    if ($ext === 'jpeg')
        $ext = 'jpg';
    if (!in_array($ext, ['jpg', 'png', 'gif', 'webp', 'svg+xml'])) {
        return $base64Data;
    }
    if ($ext === 'svg+xml')
        $ext = 'svg';

    $imageData = base64_decode($matches[2]);
    if ($imageData === false) {
        return $base64Data;
    }

    $uploadDir = __DIR__ . '/../frontend/public/uploads/' . $folder;
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = $id . '.' . $ext;
    $filepath = $uploadDir . '/' . $filename;

    if (file_put_contents($filepath, $imageData) === false) {
        return $base64Data;
    }

    return '/uploads/' . $folder . '/' . $filename;
}

// Merge master record with translations
function mergeTranslations($masterRecord, $translations, $fields)
{
    if (empty($translations)) {
        return $masterRecord;
    }

    foreach ($fields as $field) {
        if (!empty($translations[$field])) {
            $masterRecord[$field] = $translations[$field];
        }
    }

    return $masterRecord;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Robustly strip everything before and including '/api'
if (preg_match('#/api(.*)$#', $uri, $matches)) {
    $uri = $matches[1];
}

$uri = rtrim($uri, '/') ?: '/';

switch (true) {
    case $method === 'GET' && preg_match('#^/images/([a-z_]+)/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $table = $m[1];
        $id = $m[2];
        $allowedTables = ['products', 'hero_slides', 'sectors', 'certifications', 'news_articles', 'directors'];
        if (!in_array($table, $allowedTables)) {
            jsonResponse(['error' => 'Invalid table'], 400);
        }
        $stmt = $conn->prepare("SELECT image_url FROM $table WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row || !$row['image_url']) {
            http_response_code(404);
            exit;
        }
        if (preg_match('/^data:image\/([\w+]+);base64,(.+)$/', $row['image_url'], $imgMatch)) {
            $mimeType = 'image/' . $imgMatch[1];
            $imageData = base64_decode($imgMatch[2]);
            header('Content-Type: ' . $mimeType);
            header('Content-Length: ' . strlen($imageData));
            header('Cache-Control: public, max-age=86400');
            echo $imageData;
        } else {
            header('Location: ' . $row['image_url']);
            http_response_code(302);
        }
        exit;

    case $method === 'GET' && $uri === '/':
    case $method === 'GET' && $uri === '/health':
        jsonResponse(['status' => 'healthy', 'message' => 'Bio Green Wax API']);
        break;

    case $method === 'POST' && $uri === '/auth/register':
        checkDbConnection($conn);
        $input = getInput();
        if (empty($input['email']) || empty($input['password'])) {
            jsonResponse(['error' => 'Email and password required'], 400);
        }

        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$input['email']]);
        if ($stmt->fetch()) {
            jsonResponse(['error' => 'Email already registered'], 400);
        }

        $userId = generateUUID();
        $passwordHash = password_hash($input['password'], PASSWORD_BCRYPT);

        $stmt = $conn->prepare("INSERT INTO users (id, email, password_hash, email_confirmed_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$userId, $input['email'], $passwordHash]);

        $token = createJWT($userId, $input['email'], $jwtSecret);
        jsonResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => ['id' => $userId, 'email' => $input['email'], 'roles' => []]
        ]);
        break;

    case $method === 'POST' && $uri === '/auth/login':
        checkDbConnection($conn);
        $input = getInput();

        $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$input['email'] ?? '']);
        $user = $stmt->fetch();

        if (!$user || !password_verify($input['password'] ?? '', $user['password_hash'])) {
            jsonResponse(['error' => 'Invalid email or password'], 401);
        }

        $conn->prepare("UPDATE users SET last_sign_in_at = NOW() WHERE id = ?")->execute([$user['id']]);

        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $roles = array_column($stmt->fetchAll(), 'role');

        $token = createJWT($user['id'], $user['email'], $jwtSecret);
        jsonResponse([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'created_at' => $user['created_at'],
                'last_sign_in_at' => $user['last_sign_in_at'],
                'roles' => $roles
            ]
        ]);
        break;

    case $method === 'GET' && $uri === '/auth/me':
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$currentUser['sub']]);
        $user = $stmt->fetch();

        if (!$user)
            jsonResponse(['error' => 'User not found'], 404);

        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $roles = array_column($stmt->fetchAll(), 'role');

        jsonResponse([
            'id' => $user['id'],
            'email' => $user['email'],
            'created_at' => $user['created_at'],
            'last_sign_in_at' => $user['last_sign_in_at'],
            'roles' => $roles
        ]);
        break;

    case $method === 'GET' && $uri === '/auth/check-role':
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$currentUser['sub']]);
        $roles = array_column($stmt->fetchAll(), 'role');

        jsonResponse([
            'is_admin' => in_array('admin', $roles),
            'is_content_creator' => in_array('content_creator', $roles),
            'roles' => $roles
        ]);
        break;

    // Admin Users Management
    case $method === 'GET' && $uri === '/admin/users':
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        // Check if current user is admin
        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$currentUser['sub']]);
        $roles = array_column($stmt->fetchAll(), 'role');
        if (!in_array('admin', $roles)) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $page = intval($_GET['page'] ?? 1);
        $perPage = intval($_GET['per_page'] ?? 100);
        $offset = ($page - 1) * $perPage;

        // Get total count
        $countStmt = $conn->query("SELECT COUNT(*) as total FROM users");
        $total = $countStmt->fetch()['total'];

        // Get users with their roles
        $sql = "SELECT u.id, u.email, u.full_name, u.created_at, u.updated_at, u.last_sign_in_at FROM users u ORDER BY u.created_at DESC LIMIT $perPage OFFSET $offset";
        $users = $conn->query($sql)->fetchAll();

        // Get roles for each user
        foreach ($users as &$user) {
            $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
            $stmt->execute([$user['id']]);
            $user['roles'] = array_column($stmt->fetchAll(), 'role');
        }

        jsonResponse([
            'users' => $users,
            'total' => intval($total),
            'page' => $page,
            'per_page' => $perPage
        ]);
        break;

    case $method === 'PUT' && preg_match('#^/admin/users/([^/]+)/role$#', $uri, $m):
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        // Check if current user is admin
        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$currentUser['sub']]);
        $roles = array_column($stmt->fetchAll(), 'role');
        if (!in_array('admin', $roles)) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $userId = $m[1];
        $input = getInput();
        $newRole = $input['role'] ?? null;

        if (!$newRole || !in_array($newRole, ['admin', 'content_creator', 'user'])) {
            jsonResponse(['error' => 'Invalid role'], 400);
        }

        // Remove existing roles and add new one
        $conn->prepare("DELETE FROM user_roles WHERE user_id = ?")->execute([$userId]);
        $conn->prepare("INSERT INTO user_roles (user_id, role) VALUES (?, ?)")->execute([$userId, $newRole]);

        jsonResponse(['success' => true, 'role' => $newRole]);
        break;

    case $method === 'DELETE' && preg_match('#^/admin/users/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        // Check if current user is admin
        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$currentUser['sub']]);
        $roles = array_column($stmt->fetchAll(), 'role');
        if (!in_array('admin', $roles)) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $userId = $m[1];

        // Don't allow deleting yourself
        if ($userId === $currentUser['sub']) {
            jsonResponse(['error' => 'Cannot delete your own account'], 400);
        }

        // Delete user roles first, then user
        $conn->prepare("DELETE FROM user_roles WHERE user_id = ?")->execute([$userId]);
        $conn->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);

        jsonResponse(['success' => true]);
        break;

    case $method === 'POST' && $uri === '/admin/users':
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$currentUser['sub']]);
        $roles = array_column($stmt->fetchAll(), 'role');
        if (!in_array('admin', $roles)) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $input = getInput();
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;
        $role = $input['role'] ?? 'user';

        if (!$email || !$password) {
            jsonResponse(['error' => 'Email and password are required'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => 'Invalid email format'], 400);
        }

        if (strlen($password) < 6) {
            jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
        }

        $checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $checkStmt->execute([$email]);
        if ($checkStmt->fetch()) {
            jsonResponse(['error' => 'A user with this email already exists'], 400);
        }

        $userId = 'user-' . bin2hex(random_bytes(8));
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $now = date('Y-m-d H:i:s');

        $stmt = $conn->prepare("INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $email, $passwordHash, $now, $now]);

        if ($role && in_array($role, ['admin', 'content_creator'])) {
            $conn->prepare("INSERT INTO user_roles (user_id, role) VALUES (?, ?)")->execute([$userId, $role]);
        }

        jsonResponse(['success' => true, 'id' => $userId, 'email' => $email, 'role' => $role], 201);
        break;

    case $method === 'PUT' && preg_match('#^/admin/users/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $currentUser = requireAuth($jwtSecret);

        $stmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ?");
        $stmt->execute([$currentUser['sub']]);
        $roles = array_column($stmt->fetchAll(), 'role');
        if (!in_array('admin', $roles)) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $userId = $m[1];
        $input = getInput();
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        $checkStmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $checkStmt->execute([$userId]);
        if (!$checkStmt->fetch()) {
            jsonResponse(['error' => 'User not found'], 404);
        }

        if ($email) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                jsonResponse(['error' => 'Invalid email format'], 400);
            }
            $dupStmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $dupStmt->execute([$email, $userId]);
            if ($dupStmt->fetch()) {
                jsonResponse(['error' => 'A user with this email already exists'], 400);
            }
            $conn->prepare("UPDATE users SET email = ?, updated_at = ? WHERE id = ?")->execute([$email, date('Y-m-d H:i:s'), $userId]);
        }

        if ($password) {
            if (strlen($password) < 6) {
                jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
            }
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $conn->prepare("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?")->execute([$passwordHash, date('Y-m-d H:i:s'), $userId]);
        }

        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/hero-slides':
        checkDbConnection($conn);
        $activeOnly = ($_GET['active_only'] ?? 'true') !== 'false';
        $lang = $_GET['lang'] ?? 'en';
        $sql = $activeOnly
            ? "SELECT * FROM hero_slides WHERE is_active = TRUE ORDER BY display_order ASC"
            : "SELECT * FROM hero_slides ORDER BY display_order ASC";
        $slides = $conn->query($sql)->fetchAll();
        $translationFields = ['title', 'subtitle', 'cta_text'];
        foreach ($slides as &$slide) {
            $translations = getTranslatedFields($conn, 'hero_slides', $slide['id'], $lang, $translationFields);
            $slide = mergeTranslations($slide, $translations, $translationFields);
        }
        $includeImages = ($_GET['include_images'] ?? 'false') === 'true';
        if (!$includeImages) {
            stripBase64FromList($slides, 'hero_slides');
        }
        jsonResponse($slides);
        break;

    case $method === 'POST' && $uri === '/hero-slides':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'hero_slides', $id);
        }

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("INSERT INTO hero_slides (id, title, subtitle, cta_text, cta_link, image_url, display_order, is_active, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['title'] ?? '', $input['subtitle'] ?? null, $input['cta_text'] ?? null, $input['cta_link'] ?? null, $imageUrl, $input['display_order'] ?? 0, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM hero_slides WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/hero-slides/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'hero_slides', $m[1]);
        } else {
            $existing = $conn->prepare("SELECT image_url FROM hero_slides WHERE id = ?");
            $existing->execute([$m[1]]);
            $row = $existing->fetch();
            $imageUrl = $row ? $row['image_url'] : null;
        }

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("UPDATE hero_slides SET title=?, subtitle=?, cta_text=?, cta_link=?, image_url=?, display_order=?, is_active=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['title'] ?? '', $input['subtitle'] ?? null, $input['cta_text'] ?? null, $input['cta_link'] ?? null, $imageUrl, $input['display_order'] ?? 0, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM hero_slides WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/hero-slides/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM hero_slides WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/products':
        checkDbConnection($conn);
        $category = $_GET['category'] ?? null;
        $featured = $_GET['featured'] ?? $_GET['featured_only'] ?? null;
        $lang = $_GET['lang'] ?? 'en';

        $sql = "SELECT * FROM products WHERE is_active = TRUE";
        $params = [];
        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }
        if ($featured === 'true') {
            $sql .= " AND is_featured = TRUE";
        }
        $sql .= " ORDER BY priority_order ASC, display_order ASC";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $products = $stmt->fetchAll();

        $translationFields = ['name', 'description', 'full_description'];
        foreach ($products as &$p) {
            foreach (['specifications', 'applications', 'packaging', 'categories'] as $f) {
                if (isset($p[$f]))
                    $p[$f] = json_decode($p[$f], true) ?: [];
            }
            // Merge translations
            $translations = getTranslatedFields($conn, 'products', $p['id'], $lang, $translationFields);
            $p = mergeTranslations($p, $translations, $translationFields);
        }
        $includeImages = ($_GET['include_images'] ?? 'false') === 'true';
        if (!$includeImages) {
            stripBase64FromList($products, 'products');
        }
        jsonResponse($products);
        break;

    case $method === 'GET' && preg_match('#^/products/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $lang = $_GET['lang'] ?? 'en';
        $stmt = $conn->prepare("SELECT * FROM products WHERE slug = ?");
        $stmt->execute([$m[1]]);
        $product = $stmt->fetch();
        if (!$product)
            jsonResponse(['error' => 'Product not found'], 404);
        foreach (['specifications', 'applications', 'packaging', 'categories'] as $f) {
            if (isset($product[$f]))
                $product[$f] = json_decode($product[$f], true) ?: [];
        }
        // Merge translations
        $translationFields = ['name', 'description', 'full_description'];
        $translations = getTranslatedFields($conn, 'products', $product['id'], $lang, $translationFields);
        $product = mergeTranslations($product, $translations, $translationFields);
        jsonResponse($product);
        break;

    case $method === 'POST' && $uri === '/products':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        try {
            $isActive = $input['is_active'] ?? 1;
            $isFeatured = $input['is_featured'] ?? 0;
            if ($isActive === true)
                $isActive = 1;
            if ($isActive === false)
                $isActive = 0;
            if ($isFeatured === true)
                $isFeatured = 1;
            if ($isFeatured === false)
                $isFeatured = 0;

            $imageUrl = $input['image_url'] ?? null;
            if ($imageUrl) {
                $imageUrl = saveBase64ImageToFile($imageUrl, 'products', $id);
            }

            $stmt = $conn->prepare("INSERT INTO products (id, slug, name, description, full_description, category, category_label, categories, image_url, specifications, applications, packaging, is_active, is_featured, display_order, priority_order, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)");
            $stmt->execute([$id, $input['slug'] ?? '', $input['name'] ?? '', $input['description'] ?? null, $input['full_description'] ?? null, $input['category'] ?? null, $input['category_label'] ?? null, json_encode($input['categories'] ?? []), $imageUrl, json_encode($input['specifications'] ?? []), json_encode($input['applications'] ?? []), json_encode($input['packaging'] ?? []), $isActive, $isFeatured, $input['display_order'] ?? 0, $input['priority_order'] ?? 10]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'products_slug_key') !== false) {
                jsonResponse(['error' => 'A product with this slug already exists. Please use a different slug.'], 409);
            }
            jsonResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
        }

        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/products/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        try {
            $isActive = $input['is_active'] ?? 1;
            $isFeatured = $input['is_featured'] ?? 0;
            if ($isActive === true)
                $isActive = 1;
            if ($isActive === false)
                $isActive = 0;
            if ($isFeatured === true)
                $isFeatured = 1;
            if ($isFeatured === false)
                $isFeatured = 0;

            $imageUrl = $input['image_url'] ?? null;
            if ($imageUrl) {
                $imageUrl = saveBase64ImageToFile($imageUrl, 'products', $m[1]);
            } else {
                $existing = $conn->prepare("SELECT image_url FROM products WHERE id = ?");
                $existing->execute([$m[1]]);
                $row = $existing->fetch();
                $imageUrl = $row ? $row['image_url'] : null;
            }

            $stmt = $conn->prepare("UPDATE products SET slug=?, name=?, description=?, full_description=?, category=?, category_label=?, categories=?, image_url=?, specifications=?, applications=?, packaging=?, is_active=?, is_featured=?, display_order=?, priority_order=?, synchronized_data=FALSE WHERE id=?");
            $stmt->execute([$input['slug'] ?? '', $input['name'] ?? '', $input['description'] ?? null, $input['full_description'] ?? null, $input['category'] ?? null, $input['category_label'] ?? null, json_encode($input['categories'] ?? []), $imageUrl, json_encode($input['specifications'] ?? []), json_encode($input['applications'] ?? []), json_encode($input['packaging'] ?? []), $isActive, $isFeatured, $input['display_order'] ?? 0, $input['priority_order'] ?? 10, $m[1]]);
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'products_slug_key') !== false) {
                jsonResponse(['error' => 'A product with this slug already exists. Please use a different slug.'], 409);
            }
            jsonResponse(['error' => 'Database error: ' . $e->getMessage()], 500);
        } catch (Exception $e) {
            jsonResponse(['error' => 'Error: ' . $e->getMessage()], 500);
        }

        $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/products/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM products WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/product-categories':
        checkDbConnection($conn);
        $activeOnly = ($_GET['active_only'] ?? 'true') !== 'false';
        $lang = $_GET['lang'] ?? 'en';
        $sql = $activeOnly
            ? "SELECT * FROM product_categories WHERE is_active = TRUE ORDER BY display_order ASC"
            : "SELECT * FROM product_categories ORDER BY display_order ASC";
        $categories = $conn->query($sql)->fetchAll();
        $translationFields = ['name', 'description'];
        foreach ($categories as &$cat) {
            $translations = getTranslatedFields($conn, 'product_categories', $cat['id'], $lang, $translationFields);
            $cat = mergeTranslations($cat, $translations, $translationFields);
        }
        jsonResponse($categories);
        break;

    case $method === 'POST' && $uri === '/product-categories':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("INSERT INTO product_categories (id, slug, name, description, display_order, is_active, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['slug'] ?? '', $input['name'] ?? '', $input['description'] ?? null, $input['display_order'] ?? 0, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM product_categories WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/product-categories/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("UPDATE product_categories SET slug=?, name=?, description=?, display_order=?, is_active=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['slug'] ?? '', $input['name'] ?? '', $input['description'] ?? null, $input['display_order'] ?? 0, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM product_categories WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/product-categories/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM product_categories WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/sectors':
        checkDbConnection($conn);
        $activeOnly = ($_GET['active_only'] ?? 'true') !== 'false';
        $lang = $_GET['lang'] ?? 'en';
        $sql = $activeOnly
            ? "SELECT * FROM sectors WHERE is_active = TRUE ORDER BY display_order ASC"
            : "SELECT * FROM sectors ORDER BY display_order ASC";
        $sectors = $conn->query($sql)->fetchAll();
        $translationFields = ['name', 'description'];
        foreach ($sectors as &$sector) {
            $translations = getTranslatedFields($conn, 'sectors', $sector['id'], $lang, $translationFields);
            $sector = mergeTranslations($sector, $translations, $translationFields);
        }
        $includeImages = ($_GET['include_images'] ?? 'false') === 'true';
        if (!$includeImages) {
            stripBase64FromList($sectors, 'sectors');
        }
        jsonResponse($sectors);
        break;

    case $method === 'POST' && $uri === '/sectors':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'sectors', $id);
        }

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("INSERT INTO sectors (id, name, slug, description, icon, color, image_url, display_order, is_active, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['name'] ?? '', $input['slug'] ?? '', $input['description'] ?? null, $input['icon'] ?? null, $input['color'] ?? null, $imageUrl, $input['display_order'] ?? 0, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM sectors WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/sectors/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'sectors', $m[1]);
        } else {
            $existing = $conn->prepare("SELECT image_url FROM sectors WHERE id = ?");
            $existing->execute([$m[1]]);
            $row = $existing->fetch();
            $imageUrl = $row ? $row['image_url'] : null;
        }

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("UPDATE sectors SET name=?, slug=?, description=?, icon=?, color=?, image_url=?, display_order=?, is_active=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['name'] ?? '', $input['slug'] ?? '', $input['description'] ?? null, $input['icon'] ?? null, $input['color'] ?? null, $imageUrl, $input['display_order'] ?? 0, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM sectors WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/sectors/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM sectors WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/certifications':
        checkDbConnection($conn);
        $activeOnly = ($_GET['active_only'] ?? 'true') !== 'false';
        $lang = $_GET['lang'] ?? 'en';
        $sql = $activeOnly
            ? "SELECT * FROM certifications WHERE is_active = TRUE ORDER BY display_order ASC"
            : "SELECT * FROM certifications ORDER BY display_order ASC";
        $certs = $conn->query($sql)->fetchAll();
        $translationFields = ['name', 'description'];
        foreach ($certs as &$cert) {
            $translations = getTranslatedFields($conn, 'certifications', $cert['id'], $lang, $translationFields);
            $cert = mergeTranslations($cert, $translations, $translationFields);
        }
        jsonResponse($certs);
        break;

    case $method === 'POST' && $uri === '/certifications':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'certifications', $id);
        }

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("INSERT INTO certifications (id, name, title, description, image_url, display_order, is_active, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['name'] ?? '', $input['title'] ?? '', $input['description'] ?? null, $imageUrl, $input['display_order'] ?? 0, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM certifications WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/certifications/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'certifications', $m[1]);
        } else {
            $existing = $conn->prepare("SELECT image_url FROM certifications WHERE id = ?");
            $existing->execute([$m[1]]);
            $row = $existing->fetch();
            $imageUrl = $row ? $row['image_url'] : null;
        }

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("UPDATE certifications SET name=?, title=?, description=?, image_url=?, display_order=?, is_active=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['name'] ?? '', $input['title'] ?? '', $input['description'] ?? null, $imageUrl, $input['display_order'] ?? 0, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM certifications WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/certifications/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM certifications WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/news-articles':
        checkDbConnection($conn);
        $publishedOnly = ($_GET['published_only'] ?? 'true') !== 'false';
        $lang = $_GET['lang'] ?? 'en';
        $sql = $publishedOnly
            ? "SELECT * FROM news_articles WHERE is_published = TRUE ORDER BY published_at DESC"
            : "SELECT * FROM news_articles ORDER BY created_at DESC";
        $articles = $conn->query($sql)->fetchAll();
        $translationFields = ['title', 'excerpt', 'content'];
        foreach ($articles as &$article) {
            $translations = getTranslatedFields($conn, 'news_articles', $article['id'], $lang, $translationFields);
            $article = mergeTranslations($article, $translations, $translationFields);
        }
        jsonResponse($articles);
        break;

    case $method === 'GET' && preg_match('#^/news-articles/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $lang = $_GET['lang'] ?? 'en';
        $stmt = $conn->prepare("SELECT * FROM news_articles WHERE slug = ?");
        $stmt->execute([$m[1]]);
        $article = $stmt->fetch();
        if (!$article)
            jsonResponse(['error' => 'Article not found'], 404);
        $translationFields = ['title', 'excerpt', 'content'];
        $translations = getTranslatedFields($conn, 'news_articles', $article['id'], $lang, $translationFields);
        $article = mergeTranslations($article, $translations, $translationFields);
        jsonResponse($article);
        break;

    case $method === 'POST' && $uri === '/news-articles':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'news_articles', $id);
        }

        $isPublished = isset($input['is_published']) ? ($input['is_published'] ? 1 : 0) : 0;
        $stmt = $conn->prepare("INSERT INTO news_articles (id, title, slug, excerpt, content, image_url, is_published, published_at, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['title'] ?? '', $input['slug'] ?? '', $input['excerpt'] ?? null, $input['content'] ?? null, $imageUrl, $isPublished, $input['published_at'] ?? null]);

        $stmt = $conn->prepare("SELECT * FROM news_articles WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/news-articles/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $imageUrl = $input['image_url'] ?? null;
        if ($imageUrl) {
            $imageUrl = saveBase64ImageToFile($imageUrl, 'news_articles', $m[1]);
        } else {
            $existing = $conn->prepare("SELECT image_url FROM news_articles WHERE id = ?");
            $existing->execute([$m[1]]);
            $row = $existing->fetch();
            $imageUrl = $row ? $row['image_url'] : null;
        }

        $isPublished = isset($input['is_published']) ? ($input['is_published'] ? 1 : 0) : 0;
        $stmt = $conn->prepare("UPDATE news_articles SET title=?, slug=?, excerpt=?, content=?, image_url=?, is_published=?, published_at=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['title'] ?? '', $input['slug'] ?? '', $input['excerpt'] ?? null, $input['content'] ?? null, $imageUrl, $isPublished, $input['published_at'] ?? null, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM news_articles WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/news-articles/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM news_articles WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/job-openings':
        checkDbConnection($conn);
        $activeOnly = ($_GET['active_only'] ?? 'true') !== 'false';
        $lang = $_GET['lang'] ?? 'en';
        $sql = $activeOnly
            ? "SELECT * FROM job_openings WHERE is_active = TRUE ORDER BY display_order ASC"
            : "SELECT * FROM job_openings ORDER BY display_order ASC";
        $jobs = $conn->query($sql)->fetchAll();
        $translationFields = ['title', 'description', 'requirements', 'responsibilities'];
        foreach ($jobs as &$j) {
            if (isset($j['requirements']))
                $j['requirements'] = json_decode($j['requirements'], true) ?: [];
            $translations = getTranslatedFields($conn, 'job_openings', $j['id'], $lang, $translationFields);
            $j = mergeTranslations($j, $translations, $translationFields);
        }
        jsonResponse($jobs);
        break;

    case $method === 'POST' && $uri === '/job-openings':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("INSERT INTO job_openings (id, title, department, location, type, employment_type, description, requirements, responsibilities, is_active, display_order, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['title'] ?? '', $input['department'] ?? null, $input['location'] ?? null, $input['type'] ?? null, $input['employment_type'] ?? null, $input['description'] ?? null, json_encode($input['requirements'] ?? []), $input['responsibilities'] ?? null, $isActive, $input['display_order'] ?? 0]);

        $stmt = $conn->prepare("SELECT * FROM job_openings WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/job-openings/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 1 : 0) : 1;
        $stmt = $conn->prepare("UPDATE job_openings SET title=?, department=?, location=?, type=?, employment_type=?, description=?, requirements=?, responsibilities=?, is_active=?, display_order=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['title'] ?? '', $input['department'] ?? null, $input['location'] ?? null, $input['type'] ?? null, $input['employment_type'] ?? null, $input['description'] ?? null, json_encode($input['requirements'] ?? []), $input['responsibilities'] ?? null, $isActive, $input['display_order'] ?? 0, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM job_openings WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/job-openings/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM job_openings WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/job-applications':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $stmt = $conn->query("SELECT * FROM job_applications ORDER BY created_at DESC");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'POST' && $uri === '/job-applications':
        checkDbConnection($conn);
        $input = getInput();
        $id = generateUUID();

        $stmt = $conn->prepare("INSERT INTO job_applications (id, job_opening_id, full_name, email, phone, current_company, current_position, experience_years, linkedin_url, cover_letter, why_suitable, value_addition, cv_url, cv_filename, is_general_application) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $input['job_opening_id'] ?? null, $input['full_name'] ?? '', $input['email'] ?? '', $input['phone'] ?? null, $input['current_company'] ?? null, $input['current_position'] ?? null, $input['experience_years'] ?? null, $input['linkedin_url'] ?? null, $input['cover_letter'] ?? null, $input['why_suitable'] ?? null, $input['value_addition'] ?? null, $input['cv_url'] ?? null, $input['cv_filename'] ?? null, $input['is_general_application'] ?? 0]);

        $stmt = $conn->prepare("SELECT * FROM job_applications WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/job-applications/([^/]+)/read$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("UPDATE job_applications SET is_read = TRUE WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'DELETE' && preg_match('#^/job-applications/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM job_applications WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'POST' && $uri === '/newsletter/subscribe':
        checkDbConnection($conn);
        $input = getInput();
        $email = trim($input['email'] ?? '');
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => 'Valid email address is required'], 400);
        }
        $check = $conn->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            jsonResponse(['success' => true, 'message' => 'Already subscribed']);
            break;
        }
        $id = generateUUID();
        $ip = $_SERVER['REMOTE_ADDR'] ?? null;
        $source = $input['source'] ?? 'website_footer';
        $stmt = $conn->prepare("INSERT INTO newsletter_subscribers (id, email, ip_address, source) VALUES (?, ?, ?, ?)");
        $stmt->execute([$id, $email, $ip, $source]);
        jsonResponse(['success' => true, 'message' => 'Successfully subscribed']);
        break;

    case $method === 'GET' && $uri === '/newsletter/subscribers':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $stmt = $conn->query("SELECT id, email, subscribed_at, source FROM newsletter_subscribers ORDER BY subscribed_at DESC");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'DELETE' && preg_match('#^/newsletter/subscribers/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM newsletter_subscribers WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/contact-enquiries':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $stmt = $conn->query("SELECT * FROM contact_enquiries ORDER BY created_at DESC");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'POST' && $uri === '/contact-enquiries':
        checkDbConnection($conn);
        $input = getInput();
        $id = generateUUID();

        $stmt = $conn->prepare("INSERT INTO contact_enquiries (id, name, email, phone, company, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $input['name'] ?? '', $input['email'] ?? '', $input['phone'] ?? null, $input['company'] ?? null, $input['subject'] ?? '', $input['message'] ?? '']);

        $stmt = $conn->prepare("SELECT * FROM contact_enquiries WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/contact-enquiries/([^/]+)/read$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("UPDATE contact_enquiries SET is_read = TRUE WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'DELETE' && preg_match('#^/contact-enquiries/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM contact_enquiries WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/contact-info':
        checkDbConnection($conn);
        jsonResponse($conn->query("SELECT * FROM contact_info ORDER BY id ASC")->fetchAll());
        break;

    case $method === 'POST' && $uri === '/contact-info':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $keyCol = $dbType === 'pgsql' ? '"key"' : '`key`';
        $stmt = $conn->prepare("INSERT INTO contact_info (id, $keyCol, value, label, synchronized_data) VALUES (?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['key'] ?? '', $input['value'] ?? '', $input['label'] ?? null]);

        $stmt = $conn->prepare("SELECT * FROM contact_info WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/contact-info/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $value = $input['value'] ?? $_GET['value'] ?? null;
        $keyCol = $dbType === 'pgsql' ? '"key"' : '`key`';
        if (isset($input['key'])) {
            $stmt = $conn->prepare("UPDATE contact_info SET $keyCol=?, value=?, label=?, synchronized_data=FALSE WHERE id=?");
            $stmt->execute([$input['key'], $value ?? '', $input['label'] ?? null, $m[1]]);
        } else {
            $stmt = $conn->prepare("UPDATE contact_info SET value=?, synchronized_data=FALSE WHERE id=?");
            $stmt->execute([$value ?? '', $m[1]]);
        }

        $stmt = $conn->prepare("SELECT * FROM contact_info WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/contact-info/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM contact_info WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    case $method === 'GET' && $uri === '/site-content':
        checkDbConnection($conn);
        $page = $_GET['page'] ?? null;
        $section = $_GET['section'] ?? null;

        $sql = "SELECT * FROM site_content WHERE 1=1";
        $params = [];
        if ($page) {
            $sql .= " AND page = ?";
            $params[] = $page;
        }
        if ($section) {
            $sql .= " AND section = ?";
            $params[] = $section;
        }
        $sql .= " ORDER BY display_order ASC";

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'POST' && $uri === '/site-content':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = generateUUID();

        $stmt = $conn->prepare("INSERT INTO site_content (id, page, section, content_key, content_value, content_type, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $input['page'] ?? '', $input['section'] ?? '', $input['content_key'] ?? '', $input['content_value'] ?? '', $input['content_type'] ?? 'text', $input['display_order'] ?? 0]);

        $stmt = $conn->prepare("SELECT * FROM site_content WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/site-content/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $stmt = $conn->prepare("UPDATE site_content SET page=?, section=?, content_key=?, content_value=?, content_type=?, display_order=? WHERE id=?");
        $stmt->execute([$input['page'] ?? '', $input['section'] ?? '', $input['content_key'] ?? '', $input['content_value'] ?? '', $input['content_type'] ?? 'text', $input['display_order'] ?? 0, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM site_content WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/site-content/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM site_content WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    // ============ SEO Keywords ============
    case $method === 'GET' && $uri === '/seo-keywords':
        checkDbConnection($conn);
        $stmt = $conn->query("SELECT * FROM seo_keywords ORDER BY priority DESC, keyword ASC");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && preg_match('#^/seo-keywords/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $stmt = $conn->prepare("SELECT * FROM seo_keywords WHERE id = ?");
        $stmt->execute([$m[1]]);
        $keyword = $stmt->fetch();
        if (!$keyword)
            jsonResponse(['error' => 'Keyword not found'], 404);

        // Get mapped products
        $stmt = $conn->prepare("SELECT skp.*, p.name as product_name, p.slug as product_slug FROM seo_keyword_products skp JOIN products p ON skp.product_id = p.id WHERE skp.keyword_id = ? ORDER BY skp.relevance_score DESC");
        $stmt->execute([$m[1]]);
        $keyword['products'] = $stmt->fetchAll();
        jsonResponse($keyword);
        break;

    case $method === 'POST' && $uri === '/seo-keywords':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = 'seo-' . generateUUID();

        $stmt = $conn->prepare("INSERT INTO seo_keywords (id, keyword, description, target_page, priority, search_volume, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql')
            $isActive = $input['is_active'] ?? true ? 1 : 0;
        $stmt->execute([$id, $input['keyword'] ?? '', $input['description'] ?? '', $input['target_page'] ?? '', $input['priority'] ?? 1, $input['search_volume'] ?? '', $isActive]);

        $stmt = $conn->prepare("SELECT * FROM seo_keywords WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/seo-keywords/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql')
            $isActive = $input['is_active'] ?? true ? 1 : 0;

        $stmt = $conn->prepare("UPDATE seo_keywords SET keyword=?, description=?, target_page=?, priority=?, search_volume=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?");
        $stmt->execute([$input['keyword'] ?? '', $input['description'] ?? '', $input['target_page'] ?? '', $input['priority'] ?? 1, $input['search_volume'] ?? '', $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM seo_keywords WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/seo-keywords/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM seo_keywords WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    // ============ SEO Keyword Product Mappings ============
    case $method === 'POST' && preg_match('#^/seo-keywords/([^/]+)/products$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = 'skp-' . generateUUID();

        $stmt = $conn->prepare("INSERT INTO seo_keyword_products (id, keyword_id, product_id, relevance_score) VALUES (?, ?, ?, ?)");
        $stmt->execute([$id, $m[1], $input['product_id'] ?? '', $input['relevance_score'] ?? 100]);

        $stmt = $conn->prepare("SELECT skp.*, p.name as product_name FROM seo_keyword_products skp JOIN products p ON skp.product_id = p.id WHERE skp.id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/seo-keyword-products/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM seo_keyword_products WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    // ============ SEO Page Meta ============
    case $method === 'GET' && $uri === '/seo-page-meta':
        checkDbConnection($conn);
        $stmt = $conn->query("SELECT * FROM seo_page_meta ORDER BY page_path ASC");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && $uri === '/seo-page-meta/by-path':
        checkDbConnection($conn);
        $path = $_GET['path'] ?? '/';
        $stmt = $conn->prepare("SELECT * FROM seo_page_meta WHERE page_path = ? AND is_active = TRUE");
        $stmt->execute([$path]);
        $meta = $stmt->fetch();
        jsonResponse($meta ?: ['error' => 'No custom meta for this page']);
        break;

    case $method === 'POST' && $uri === '/seo-page-meta':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = 'spm-' . generateUUID();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        $noIndex = isset($input['no_index']) ? ($input['no_index'] ? 'TRUE' : 'FALSE') : 'FALSE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
            $noIndex = $input['no_index'] ?? false ? 1 : 0;
        }

        $stmt = $conn->prepare("INSERT INTO seo_page_meta (id, page_path, title, description, keywords, og_title, og_description, og_image, canonical_url, no_index, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$id, $input['page_path'] ?? '', $input['title'] ?? '', $input['description'] ?? '', $input['keywords'] ?? '', $input['og_title'] ?? '', $input['og_description'] ?? '', $input['og_image'] ?? '', $input['canonical_url'] ?? '', $noIndex, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM seo_page_meta WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/seo-page-meta/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        $noIndex = isset($input['no_index']) ? ($input['no_index'] ? 'TRUE' : 'FALSE') : 'FALSE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
            $noIndex = $input['no_index'] ?? false ? 1 : 0;
        }

        $stmt = $conn->prepare("UPDATE seo_page_meta SET page_path=?, title=?, description=?, keywords=?, og_title=?, og_description=?, og_image=?, canonical_url=?, no_index=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?");
        $stmt->execute([$input['page_path'] ?? '', $input['title'] ?? '', $input['description'] ?? '', $input['keywords'] ?? '', $input['og_title'] ?? '', $input['og_description'] ?? '', $input['og_image'] ?? '', $input['canonical_url'] ?? '', $noIndex, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM seo_page_meta WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/seo-page-meta/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM seo_page_meta WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    // ============ Directors ============
    case $method === 'GET' && $uri === '/directors':
        checkDbConnection($conn);
        $lang = $_GET['lang'] ?? 'en';
        $directors = $conn->query("SELECT * FROM directors ORDER BY display_order ASC")->fetchAll();
        $translationFields = ['name', 'title', 'bio'];
        foreach ($directors as &$director) {
            $translations = getTranslatedFields($conn, 'directors', $director['id'], $lang, $translationFields);
            $director = mergeTranslations($director, $translations, $translationFields);
        }
        jsonResponse($directors);
        break;

    case $method === 'GET' && preg_match('#^/directors/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $lang = $_GET['lang'] ?? 'en';
        $stmt = $conn->prepare("SELECT * FROM directors WHERE id = ?");
        $stmt->execute([$m[1]]);
        $director = $stmt->fetch();
        if (!$director)
            jsonResponse(['error' => 'Director not found'], 404);
        $translationFields = ['name', 'title', 'bio'];
        $translations = getTranslatedFields($conn, 'directors', $director['id'], $lang, $translationFields);
        $director = mergeTranslations($director, $translations, $translationFields);
        jsonResponse($director);
        break;

    case $method === 'POST' && $uri === '/directors':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = 'dir-' . generateUUID();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
        }

        $photoUrl = $input['photo_url'] ?? '';
        if ($photoUrl) {
            $photoUrl = saveBase64ImageToFile($photoUrl, 'directors', $id);
        }

        $stmt = $conn->prepare("INSERT INTO directors (id, name, title, bio, linkedin_url, photo_url, display_order, is_active, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['name'] ?? '', $input['title'] ?? '', $input['bio'] ?? '', $input['linkedin_url'] ?? '', $photoUrl, $input['display_order'] ?? 0, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM directors WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/directors/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
        }

        $photoUrl = $input['photo_url'] ?? '';
        if ($photoUrl) {
            $photoUrl = saveBase64ImageToFile($photoUrl, 'directors', $m[1]);
        } else {
            $existing = $conn->prepare("SELECT photo_url FROM directors WHERE id = ?");
            $existing->execute([$m[1]]);
            $row = $existing->fetch();
            $photoUrl = $row ? $row['photo_url'] : '';
        }

        $stmt = $conn->prepare("UPDATE directors SET name=?, title=?, bio=?, linkedin_url=?, photo_url=?, display_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['name'] ?? '', $input['title'] ?? '', $input['bio'] ?? '', $input['linkedin_url'] ?? '', $photoUrl, $input['display_order'] ?? 0, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM directors WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/directors/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM directors WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    // ============ About Us Content ============
    case $method === 'GET' && $uri === '/about-us-content':
        checkDbConnection($conn);
        $lang = $_GET['lang'] ?? 'en';
        $content = $conn->query("SELECT * FROM about_us_content ORDER BY section, display_order ASC")->fetchAll();
        $translationFields = ['content_value'];
        foreach ($content as &$item) {
            $translations = getTranslatedFields($conn, 'about_us_content', $item['id'], $lang, $translationFields);
            $item = mergeTranslations($item, $translations, $translationFields);
        }
        jsonResponse($content);
        break;

    case $method === 'GET' && $uri === '/about-us-content/by-section':
        checkDbConnection($conn);
        $section = $_GET['section'] ?? '';
        $lang = $_GET['lang'] ?? 'en';
        $stmt = $conn->prepare("SELECT * FROM about_us_content WHERE section = ? AND is_active = TRUE ORDER BY display_order ASC");
        $stmt->execute([$section]);
        $content = $stmt->fetchAll();
        $translationFields = ['content_value'];
        foreach ($content as &$item) {
            $translations = getTranslatedFields($conn, 'about_us_content', $item['id'], $lang, $translationFields);
            $item = mergeTranslations($item, $translations, $translationFields);
        }
        jsonResponse($content);
        break;

    case $method === 'PUT' && $uri === '/about-us-content/bulk':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $updates = $input['updates'] ?? [];

        foreach ($updates as $update) {
            if (isset($update['id']) && isset($update['content_value'])) {
                $stmt = $conn->prepare("UPDATE about_us_content SET content_value=?, updated_at=CURRENT_TIMESTAMP, synchronized_data=FALSE WHERE id=?");
                $stmt->execute([$update['content_value'], $update['id']]);
            }
        }

        $stmt = $conn->query("SELECT * FROM about_us_content ORDER BY section, display_order ASC");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'PUT' && preg_match('#^/about-us-content/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
        }

        $stmt = $conn->prepare("UPDATE about_us_content SET content_value=?, is_active=?, updated_at=CURRENT_TIMESTAMP, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['content_value'] ?? '', $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM about_us_content WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    // ============ Global Operations ============
    case $method === 'GET' && $uri === '/global-operations':
        checkDbConnection($conn);
        $lang = $_GET['lang'] ?? 'en';
        $operations = $conn->query("SELECT * FROM global_operations ORDER BY display_order ASC")->fetchAll();
        $translationFields = ['location_name', 'description'];
        foreach ($operations as &$op) {
            $translations = getTranslatedFields($conn, 'global_operations', $op['id'], $lang, $translationFields);
            $op = mergeTranslations($op, $translations, $translationFields);
        }
        jsonResponse($operations);
        break;

    case $method === 'POST' && $uri === '/global-operations':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();
        $id = 'ops-' . generateUUID();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
        }

        $stmt = $conn->prepare("INSERT INTO global_operations (id, location_name, country, description, operations_type, display_order, is_active, synchronized_data) VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)");
        $stmt->execute([$id, $input['location_name'] ?? '', $input['country'] ?? '', $input['description'] ?? '', $input['operations_type'] ?? '', $input['display_order'] ?? 0, $isActive]);

        $stmt = $conn->prepare("SELECT * FROM global_operations WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'PUT' && preg_match('#^/global-operations/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        $isActive = isset($input['is_active']) ? ($input['is_active'] ? 'TRUE' : 'FALSE') : 'TRUE';
        if ($dbType === 'mysql') {
            $isActive = $input['is_active'] ?? true ? 1 : 0;
        }

        $stmt = $conn->prepare("UPDATE global_operations SET location_name=?, country=?, description=?, operations_type=?, display_order=?, is_active=?, synchronized_data=FALSE WHERE id=?");
        $stmt->execute([$input['location_name'] ?? '', $input['country'] ?? '', $input['description'] ?? '', $input['operations_type'] ?? '', $input['display_order'] ?? 0, $isActive, $m[1]]);

        $stmt = $conn->prepare("SELECT * FROM global_operations WHERE id = ?");
        $stmt->execute([$m[1]]);
        jsonResponse($stmt->fetch());
        break;

    case $method === 'DELETE' && preg_match('#^/global-operations/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $conn->prepare("DELETE FROM global_operations WHERE id = ?")->execute([$m[1]]);
        jsonResponse(['success' => true]);
        break;

    // ============ Image Upload for Directors ============
    case $method === 'POST' && $uri === '/upload/director-photo':
        checkDbConnection($conn);
        requireAuth($jwtSecret);

        if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(['error' => 'No file uploaded or upload error'], 400);
        }

        $file = $_FILES['photo'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!in_array($file['type'], $allowedTypes)) {
            jsonResponse(['error' => 'Invalid file type. Only JPEG, PNG and WebP allowed'], 400);
        }

        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            jsonResponse(['error' => 'File too large. Maximum 5MB allowed'], 400);
        }

        $directorId = $_POST['director_id'] ?? '';
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'director-' . $directorId . '-' . time() . '.' . $extension;

        $uploadDir = __DIR__ . '/../frontend/public/images/directors/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $destination = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $photoUrl = '/images/directors/' . $filename;

            if ($directorId) {
                $stmt = $conn->prepare("UPDATE directors SET photo_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
                $stmt->execute([$photoUrl, $directorId]);
            }

            jsonResponse(['success' => true, 'photo_url' => $photoUrl]);
        } else {
            jsonResponse(['error' => 'Failed to save file'], 500);
        }
        break;

    // ============ Analytics Tracking ============
    case $method === 'POST' && $uri === '/analytics/track':
        checkDbConnection($conn);
        $input = getInput();

        $visitorId = $input['visitor_id'] ?? '';
        $sessionId = $input['session_id'] ?? '';
        $pagePath = $input['page_path'] ?? '/';
        $pageTitle = $input['page_title'] ?? '';

        if (!$visitorId || !$sessionId) {
            jsonResponse(['error' => 'Missing visitor_id or session_id'], 400);
        }

        // Get client IP
        $ipAddress = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
        if (strpos($ipAddress, ',') !== false) {
            $ipAddress = trim(explode(',', $ipAddress)[0]);
        }

        // Check if session exists
        $stmt = $conn->prepare("SELECT id FROM visitor_sessions WHERE id = ?");
        $stmt->execute([$sessionId]);
        $existingSession = $stmt->fetch();

        if (!$existingSession) {
            // Create new session
            $browser = $input['browser'] ?? '';
            $browserVersion = $input['browser_version'] ?? '';
            $os = $input['operating_system'] ?? '';
            $deviceType = $input['device_type'] ?? 'desktop';
            $screenWidth = $input['screen_width'] ?? 0;
            $screenHeight = $input['screen_height'] ?? 0;
            $language = $input['language'] ?? '';
            $referrer = $input['referrer'] ?? '';
            $referrerDomain = $input['referrer_domain'] ?? '';
            $utmSource = $input['utm_source'] ?? '';
            $utmMedium = $input['utm_medium'] ?? '';
            $utmCampaign = $input['utm_campaign'] ?? '';
            $isNewVisitor = $input['is_new_visitor'] ?? true;

            // Get geographic info from IP using free API
            $country = '';
            $city = '';
            $region = '';
            $countryCode = '';

            if ($ipAddress && $ipAddress !== '127.0.0.1' && $ipAddress !== '::1') {
                $geoUrl = "http://ip-api.com/json/{$ipAddress}?fields=status,country,countryCode,region,regionName,city";
                $geoContext = stream_context_create(['http' => ['timeout' => 2]]);
                $geoData = @file_get_contents($geoUrl, false, $geoContext);
                if ($geoData) {
                    $geo = json_decode($geoData, true);
                    if ($geo && $geo['status'] === 'success') {
                        $country = $geo['country'] ?? '';
                        $countryCode = $geo['countryCode'] ?? '';
                        $region = $geo['regionName'] ?? '';
                        $city = $geo['city'] ?? '';
                    }
                }
            }

            $boolValue = $dbType === 'pgsql' ? ($isNewVisitor ? 'TRUE' : 'FALSE') : ($isNewVisitor ? 1 : 0);

            $stmt = $conn->prepare("INSERT INTO visitor_sessions (id, visitor_id, ip_address, country, city, region, country_code, browser, browser_version, operating_system, device_type, screen_width, screen_height, language, referrer, referrer_domain, utm_source, utm_medium, utm_campaign, is_new_visitor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " . $boolValue . ")");
            $stmt->execute([$sessionId, $visitorId, $ipAddress, $country, $city, $region, $countryCode, $browser, $browserVersion, $os, $deviceType, $screenWidth, $screenHeight, $language, $referrer, $referrerDomain, $utmSource, $utmMedium, $utmCampaign]);
        } else {
            // Update last activity
            $stmt = $conn->prepare("UPDATE visitor_sessions SET last_activity_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$sessionId]);
        }

        // Record page view
        $timeOnPage = $input['time_on_page'] ?? 0;
        $scrollDepth = $input['scroll_depth'] ?? 0;

        $stmt = $conn->prepare("INSERT INTO page_views (session_id, page_path, page_title, time_on_page, scroll_depth) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$sessionId, $pagePath, $pageTitle, $timeOnPage, $scrollDepth]);

        // Run cleanup with 1% probability to avoid running every request
        if (mt_rand(1, 100) === 1) {
            $threeMonthsAgo = date('Y-m-d H:i:s', strtotime('-3 months'));
            $conn->prepare("DELETE FROM page_views WHERE viewed_at < ?")->execute([$threeMonthsAgo]);
            $conn->prepare("DELETE FROM visitor_sessions WHERE started_at < ?")->execute([$threeMonthsAgo]);
        }

        jsonResponse(['success' => true]);
        break;

    // Analytics cleanup endpoint (can be called by cron job weekly)
    case $method === 'POST' && $uri === '/analytics/cleanup':
        checkDbConnection($conn);

        $threeMonthsAgo = date('Y-m-d H:i:s', strtotime('-3 months'));

        // Delete old page views first (due to foreign key)
        $stmt = $conn->prepare("DELETE FROM page_views WHERE viewed_at < ?");
        $stmt->execute([$threeMonthsAgo]);
        $deletedPageViews = $stmt->rowCount();

        // Delete old sessions
        $stmt = $conn->prepare("DELETE FROM visitor_sessions WHERE started_at < ?");
        $stmt->execute([$threeMonthsAgo]);
        $deletedSessions = $stmt->rowCount();

        jsonResponse([
            'success' => true,
            'deleted_page_views' => $deletedPageViews,
            'deleted_sessions' => $deletedSessions,
            'cutoff_date' => $threeMonthsAgo
        ]);
        break;

    case $method === 'GET' && $uri === '/analytics/summary':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $country = isset($_GET['country']) && $_GET['country'] !== '' ? trim($_GET['country']) : null;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $countryFilter = $country ? " AND country = ?" : "";
        $baseParams = $country ? [$dateLimit, $country] : [$dateLimit];

        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM visitor_sessions WHERE started_at >= ?" . $countryFilter);
        $stmt->execute($baseParams);
        $totalSessions = $stmt->fetch()['total'];

        if ($country) {
            $stmt = $conn->prepare("SELECT COUNT(*) as total FROM page_views pv JOIN visitor_sessions vs ON pv.session_id = vs.id WHERE pv.viewed_at >= ? AND vs.country = ?");
            $stmt->execute([$dateLimit, $country]);
        } else {
            $stmt = $conn->prepare("SELECT COUNT(*) as total FROM page_views WHERE viewed_at >= ?");
            $stmt->execute([$dateLimit]);
        }
        $totalPageViews = $stmt->fetch()['total'];

        $stmt = $conn->prepare("SELECT COUNT(DISTINCT visitor_id) as total FROM visitor_sessions WHERE started_at >= ?" . $countryFilter);
        $stmt->execute($baseParams);
        $uniqueVisitors = $stmt->fetch()['total'];

        $boolCheck = $dbType === 'pgsql' ? 'TRUE' : '1';
        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM visitor_sessions WHERE started_at >= ? AND is_new_visitor = " . $boolCheck . $countryFilter);
        $stmt->execute($baseParams);
        $newVisitors = $stmt->fetch()['total'];

        $avgPagesPerSession = $totalSessions > 0 ? round($totalPageViews / $totalSessions, 2) : 0;

        $stmt = $conn->prepare("SELECT DATE(started_at) as date, COUNT(*) as count FROM visitor_sessions WHERE started_at >= ?" . $countryFilter . " GROUP BY DATE(started_at) ORDER BY date ASC");
        $stmt->execute($baseParams);
        $sessionsByDay = $stmt->fetchAll();

        jsonResponse([
            'total_sessions' => (int) $totalSessions,
            'total_page_views' => (int) $totalPageViews,
            'unique_visitors' => (int) $uniqueVisitors,
            'new_visitors' => (int) $newVisitors,
            'returning_visitors' => (int) $uniqueVisitors - (int) $newVisitors,
            'avg_pages_per_session' => $avgPagesPerSession,
            'sessions_by_day' => $sessionsByDay
        ]);
        break;

    case $method === 'GET' && $uri === '/analytics/pages':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
        $country = isset($_GET['country']) && $_GET['country'] !== '' ? trim($_GET['country']) : null;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        if ($country) {
            $stmt = $conn->prepare("SELECT pv.page_path, pv.page_title, COUNT(*) as views, AVG(pv.time_on_page) as avg_time, AVG(pv.scroll_depth) as avg_scroll FROM page_views pv JOIN visitor_sessions vs ON pv.session_id = vs.id WHERE pv.viewed_at >= ? AND vs.country = ? GROUP BY pv.page_path, pv.page_title ORDER BY views DESC LIMIT " . $limit);
            $stmt->execute([$dateLimit, $country]);
        } else {
            $stmt = $conn->prepare("SELECT page_path, page_title, COUNT(*) as views, AVG(time_on_page) as avg_time, AVG(scroll_depth) as avg_scroll FROM page_views WHERE viewed_at >= ? GROUP BY page_path, page_title ORDER BY views DESC LIMIT " . $limit);
            $stmt->execute([$dateLimit]);
        }

        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && $uri === '/analytics/geographic':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $country = isset($_GET['country']) && $_GET['country'] !== '' ? trim($_GET['country']) : null;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $stmt = $conn->prepare("SELECT country, country_code, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND country IS NOT NULL AND country != '' GROUP BY country, country_code ORDER BY sessions DESC LIMIT 20");
        $stmt->execute([$dateLimit]);
        $byCountry = $stmt->fetchAll();

        if ($country) {
            $stmt = $conn->prepare("SELECT city, region, country, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND city IS NOT NULL AND city != '' AND country = ? GROUP BY city, region, country ORDER BY sessions DESC LIMIT 20");
            $stmt->execute([$dateLimit, $country]);
        } else {
            $stmt = $conn->prepare("SELECT city, region, country, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND city IS NOT NULL AND city != '' GROUP BY city, region, country ORDER BY sessions DESC LIMIT 20");
            $stmt->execute([$dateLimit]);
        }
        $byCity = $stmt->fetchAll();

        jsonResponse([
            'by_country' => $byCountry,
            'by_city' => $byCity
        ]);
        break;

    case $method === 'GET' && $uri === '/analytics/devices':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $country = isset($_GET['country']) && $_GET['country'] !== '' ? trim($_GET['country']) : null;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $countryFilter = $country ? " AND country = ?" : "";
        $baseParams = $country ? [$dateLimit, $country] : [$dateLimit];

        $stmt = $conn->prepare("SELECT device_type, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ?" . $countryFilter . " GROUP BY device_type ORDER BY sessions DESC");
        $stmt->execute($baseParams);
        $byDeviceType = $stmt->fetchAll();

        $stmt = $conn->prepare("SELECT browser, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND browser IS NOT NULL AND browser != ''" . $countryFilter . " GROUP BY browser ORDER BY sessions DESC LIMIT 10");
        $stmt->execute($baseParams);
        $byBrowser = $stmt->fetchAll();

        $stmt = $conn->prepare("SELECT operating_system, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND operating_system IS NOT NULL AND operating_system != ''" . $countryFilter . " GROUP BY operating_system ORDER BY sessions DESC LIMIT 10");
        $stmt->execute($baseParams);
        $byOS = $stmt->fetchAll();

        $stmt = $conn->prepare("SELECT screen_width, screen_height, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND screen_width > 0" . $countryFilter . " GROUP BY screen_width, screen_height ORDER BY sessions DESC LIMIT 10");
        $stmt->execute($baseParams);
        $byResolution = $stmt->fetchAll();

        jsonResponse([
            'by_device_type' => $byDeviceType,
            'by_browser' => $byBrowser,
            'by_os' => $byOS,
            'by_resolution' => $byResolution
        ]);
        break;

    case $method === 'GET' && $uri === '/analytics/referrers':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $country = isset($_GET['country']) && $_GET['country'] !== '' ? trim($_GET['country']) : null;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $countryFilter = $country ? " AND country = ?" : "";
        $baseParams = $country ? [$dateLimit, $country] : [$dateLimit];

        $stmt = $conn->prepare("SELECT referrer_domain, COUNT(*) as sessions FROM visitor_sessions WHERE started_at >= ? AND referrer_domain IS NOT NULL AND referrer_domain != ''" . $countryFilter . " GROUP BY referrer_domain ORDER BY sessions DESC LIMIT 20");
        $stmt->execute($baseParams);

        jsonResponse($stmt->fetchAll());
        break;

    // ============ BOT ANALYTICS ============
    case $method === 'GET' && $uri === '/analytics/bots/summary':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $stmt = $conn->prepare("SELECT COUNT(*) as total_visits FROM bot_visits WHERE visited_at >= ?");
        $stmt->execute([$dateLimit]);
        $totalVisits = $stmt->fetchColumn();

        $stmt = $conn->prepare("SELECT COUNT(DISTINCT bot_name) as unique_bots FROM bot_visits WHERE visited_at >= ?");
        $stmt->execute([$dateLimit]);
        $uniqueBots = $stmt->fetchColumn();

        $stmt = $conn->prepare("SELECT COUNT(DISTINCT page_path) as pages_crawled FROM bot_visits WHERE visited_at >= ?");
        $stmt->execute([$dateLimit]);
        $pagesCrawled = $stmt->fetchColumn();

        $stmt = $conn->prepare("SELECT COUNT(DISTINCT language) as languages_accessed FROM bot_visits WHERE visited_at >= ?");
        $stmt->execute([$dateLimit]);
        $languagesAccessed = $stmt->fetchColumn();

        $stmt = $conn->prepare("SELECT DATE(visited_at) as date, COUNT(*) as count FROM bot_visits WHERE visited_at >= ? GROUP BY DATE(visited_at) ORDER BY date ASC");
        $stmt->execute([$dateLimit]);
        $visitsByDay = $stmt->fetchAll();

        jsonResponse([
            'total_visits' => (int) $totalVisits,
            'unique_bots' => (int) $uniqueBots,
            'pages_crawled' => (int) $pagesCrawled,
            'languages_accessed' => (int) $languagesAccessed,
            'visits_by_day' => $visitsByDay,
        ]);
        break;

    case $method === 'GET' && $uri === '/analytics/bots/by-bot':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $stmt = $conn->prepare("SELECT bot_name, COUNT(*) as visits, COUNT(DISTINCT page_path) as unique_pages, MAX(visited_at) as last_visit FROM bot_visits WHERE visited_at >= ? GROUP BY bot_name ORDER BY visits DESC");
        $stmt->execute([$dateLimit]);

        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && $uri === '/analytics/bots/by-page':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $stmt = $conn->prepare("SELECT page_path, page_type, COUNT(*) as visits, COUNT(DISTINCT bot_name) as unique_bots FROM bot_visits WHERE visited_at >= ? GROUP BY page_path, page_type ORDER BY visits DESC LIMIT 50");
        $stmt->execute([$dateLimit]);

        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && $uri === '/analytics/bots/by-country':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $stmt = $conn->prepare("SELECT country, country_code, COUNT(*) as visits FROM bot_visits WHERE visited_at >= ? AND country IS NOT NULL AND country != '' GROUP BY country, country_code ORDER BY visits DESC LIMIT 20");
        $stmt->execute([$dateLimit]);

        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && $uri === '/analytics/bots/by-language':
        checkDbConnection($conn);

        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));

        $stmt = $conn->prepare("SELECT language, COUNT(*) as visits FROM bot_visits WHERE visited_at >= ? GROUP BY language ORDER BY visits DESC");
        $stmt->execute([$dateLimit]);

        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && $uri === '/analytics/bots/recent':
        checkDbConnection($conn);

        $limit = isset($_GET['limit']) ? min(intval($_GET['limit']), 100) : 25;

        $stmt = $conn->prepare("SELECT bot_name, page_path, page_type, language, domain, country, city, visited_at FROM bot_visits ORDER BY visited_at DESC LIMIT ?");
        $stmt->execute([$limit]);

        jsonResponse($stmt->fetchAll());
        break;

    // ============ VISITORS PANEL (No Auth Required) ============
    case $method === 'GET' && $uri === '/visitors/overview':
        checkDbConnection($conn);

        $validRanges = [1, 3, 7, 15, 30, 45, 90];
        $days = isset($_GET['days']) ? intval($_GET['days']) : 30;
        if (!in_array($days, $validRanges)) {
            $days = 30;
        }
        $dateLimit = date('Y-m-d H:i:s', strtotime("-{$days} days"));
        $boolTrue = $dbType === 'pgsql' ? 'TRUE' : '1';
        $boolFalse = $dbType === 'pgsql' ? 'FALSE' : '0';

        // Exclude admin pages from page_views
        $pageExclude = "AND pv.page_path NOT LIKE '/admin%'";

        // 1. Headline numbers
        $stmt = $conn->prepare("SELECT COUNT(*) as total_sessions FROM visitor_sessions WHERE started_at >= ?");
        $stmt->execute([$dateLimit]);
        $totalSessions = (int) $stmt->fetch()['total_sessions'];

        $stmt = $conn->prepare("SELECT COUNT(DISTINCT visitor_id) as total FROM visitor_sessions WHERE started_at >= ?");
        $stmt->execute([$dateLimit]);
        $uniqueVisitors = (int) $stmt->fetch()['total'];

        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM visitor_sessions WHERE started_at >= ? AND is_new_visitor = $boolTrue");
        $stmt->execute([$dateLimit]);
        $freshVisitors = (int) $stmt->fetch()['total'];

        $repeatVisitors = $uniqueVisitors - $freshVisitors;

        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM page_views pv WHERE pv.viewed_at >= ? $pageExclude");
        $stmt->execute([$dateLimit]);
        $totalViews = (int) $stmt->fetch()['total'];

        // 2. Visits per day trend
        $stmt = $conn->prepare("SELECT DATE(started_at) as day, COUNT(*) as visits, COUNT(DISTINCT visitor_id) as uniques FROM visitor_sessions WHERE started_at >= ? GROUP BY DATE(started_at) ORDER BY day");
        $stmt->execute([$dateLimit]);
        $dailyTrend = $stmt->fetchAll();

        // 3. Top pages (exclude admin)
        $stmt = $conn->prepare("SELECT pv.page_path, pv.page_title, COUNT(*) as hits, ROUND(AVG(pv.time_on_page)) as avg_seconds FROM page_views pv WHERE pv.viewed_at >= ? $pageExclude GROUP BY pv.page_path, pv.page_title ORDER BY hits DESC LIMIT 15");
        $stmt->execute([$dateLimit]);
        $topPages = $stmt->fetchAll();

        // 4. Locations - countries
        $stmt = $conn->prepare("SELECT country, country_code, COUNT(*) as visits FROM visitor_sessions WHERE started_at >= ? AND country IS NOT NULL AND country != '' GROUP BY country, country_code ORDER BY visits DESC LIMIT 10");
        $stmt->execute([$dateLimit]);
        $countries = $stmt->fetchAll();

        // 5. Locations - cities
        $stmt = $conn->prepare("SELECT city, country, COUNT(*) as visits FROM visitor_sessions WHERE started_at >= ? AND city IS NOT NULL AND city != '' GROUP BY city, country ORDER BY visits DESC LIMIT 10");
        $stmt->execute([$dateLimit]);
        $cities = $stmt->fetchAll();

        // 6. Devices
        $stmt = $conn->prepare("SELECT device_type, COUNT(*) as count FROM visitor_sessions WHERE started_at >= ? AND device_type IS NOT NULL GROUP BY device_type ORDER BY count DESC");
        $stmt->execute([$dateLimit]);
        $devices = $stmt->fetchAll();

        // 7. Browsers
        $stmt = $conn->prepare("SELECT browser, COUNT(*) as count FROM visitor_sessions WHERE started_at >= ? AND browser IS NOT NULL AND browser != '' GROUP BY browser ORDER BY count DESC LIMIT 8");
        $stmt->execute([$dateLimit]);
        $browsers = $stmt->fetchAll();

        // 8. Operating Systems
        $stmt = $conn->prepare("SELECT operating_system, COUNT(*) as count FROM visitor_sessions WHERE started_at >= ? AND operating_system IS NOT NULL AND operating_system != '' GROUP BY operating_system ORDER BY count DESC LIMIT 8");
        $stmt->execute([$dateLimit]);
        $operatingSystems = $stmt->fetchAll();

        // 9. Referrer sources
        $stmt = $conn->prepare("SELECT referrer_domain, COUNT(*) as count FROM visitor_sessions WHERE started_at >= ? AND referrer_domain IS NOT NULL AND referrer_domain != '' GROUP BY referrer_domain ORDER BY count DESC LIMIT 10");
        $stmt->execute([$dateLimit]);
        $sources = $stmt->fetchAll();

        // 10. AI bots
        $stmt = $conn->prepare("SELECT bot_name, COUNT(*) as crawls FROM bot_visits WHERE visited_at >= ? GROUP BY bot_name ORDER BY crawls DESC");
        $stmt->execute([$dateLimit]);
        $bots = $stmt->fetchAll();

        $stmt = $conn->prepare("SELECT COUNT(*) as total FROM bot_visits WHERE visited_at >= ?");
        $stmt->execute([$dateLimit]);
        $totalBotCrawls = (int) $stmt->fetch()['total'];

        jsonResponse([
            'headline' => [
                'total_sessions' => $totalSessions,
                'unique_visitors' => $uniqueVisitors,
                'fresh_visitors' => $freshVisitors,
                'repeat_visitors' => $repeatVisitors,
                'total_page_views' => $totalViews,
            ],
            'daily_trend' => $dailyTrend,
            'top_pages' => $topPages,
            'countries' => $countries,
            'cities' => $cities,
            'devices' => $devices,
            'browsers' => $browsers,
            'operating_systems' => $operatingSystems,
            'sources' => $sources,
            'bots' => [
                'total_crawls' => $totalBotCrawls,
                'by_name' => $bots,
            ],
        ]);
        break;

    // ============ LANGUAGES & TRANSLATIONS ============
    case $method === 'GET' && $uri === '/languages':
        checkDbConnection($conn);
        $stmt = $conn->query("SELECT * FROM supported_languages WHERE is_active = TRUE ORDER BY display_order");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && preg_match('#^/translations/([a-z]{2})$#', $uri, $matches):
        checkDbConnection($conn);
        $lang = $matches[1];

        // Get entity type filter if provided
        $entityType = isset($_GET['entity_type']) ? $_GET['entity_type'] : null;
        $entityId = isset($_GET['entity_id']) ? $_GET['entity_id'] : null;

        $sql = "SELECT * FROM translations WHERE language_code = ?";
        $params = [$lang];

        if ($entityType) {
            $sql .= " AND entity_type = ?";
            $params[] = $entityType;
        }
        if ($entityId) {
            $sql .= " AND entity_id = ?";
            $params[] = $entityId;
        }

        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'GET' && preg_match('#^/ui-translations/([a-z]{2})$#', $uri, $matches):
        checkDbConnection($conn);
        $lang = $matches[1];
        $stmt = $conn->prepare("SELECT translation_key, translated_text FROM ui_translations WHERE language_code = ?");
        $stmt->execute([$lang]);
        $translations = $stmt->fetchAll();

        // Convert to key-value object for easy lookup
        $result = [];
        foreach ($translations as $t) {
            $result[$t['translation_key']] = $t['translated_text'];
        }
        jsonResponse($result);
        break;

    case $method === 'GET' && $uri === '/ui-translations':
        checkDbConnection($conn);
        $stmt = $conn->query("SELECT * FROM ui_translations ORDER BY translation_key, language_code");
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'POST' && $uri === '/ui-translations':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        // Batch upsert UI translations
        if (isset($input['translations']) && is_array($input['translations'])) {
            $upserted = 0;
            foreach ($input['translations'] as $t) {
                if (!isset($t['translation_key']) || !isset($t['language_code']) || !isset($t['translated_text'])) {
                    continue;
                }

                // PostgreSQL uses ON CONFLICT, MySQL uses ON DUPLICATE KEY
                global $dbType;
                if ($dbType === 'pgsql') {
                    $stmt = $conn->prepare("INSERT INTO ui_translations (translation_key, language_code, translated_text) VALUES (?, ?, ?) ON CONFLICT (translation_key, language_code) DO UPDATE SET translated_text = EXCLUDED.translated_text, updated_at = CURRENT_TIMESTAMP");
                } else {
                    $stmt = $conn->prepare("INSERT INTO ui_translations (translation_key, language_code, translated_text) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text), updated_at = CURRENT_TIMESTAMP");
                }
                $stmt->execute([$t['translation_key'], $t['language_code'], $t['translated_text']]);
                $upserted++;
            }
            jsonResponse(['success' => true, 'upserted' => $upserted]);
        } else {
            jsonResponse(['error' => 'Missing translations array'], 400);
        }
        break;

    case $method === 'POST' && $uri === '/translations':
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $input = getInput();

        if (!isset($input['entity_type']) || !isset($input['entity_id']) || !isset($input['field_name']) || !isset($input['language_code']) || !isset($input['translated_text'])) {
            jsonResponse(['error' => 'Missing required fields'], 400);
        }

        global $dbType;
        if ($dbType === 'pgsql') {
            $stmt = $conn->prepare("INSERT INTO translations (entity_type, entity_id, field_name, language_code, translated_text, is_auto_translated) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (entity_type, entity_id, field_name, language_code) DO UPDATE SET translated_text = EXCLUDED.translated_text, is_auto_translated = EXCLUDED.is_auto_translated, updated_at = CURRENT_TIMESTAMP");
        } else {
            $stmt = $conn->prepare("INSERT INTO translations (entity_type, entity_id, field_name, language_code, translated_text, is_auto_translated) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text), is_auto_translated = VALUES(is_auto_translated), updated_at = CURRENT_TIMESTAMP");
        }

        $isAuto = isset($input['is_auto_translated']) ? ($input['is_auto_translated'] ? 1 : 0) : 1;
        $stmt->execute([
            $input['entity_type'],
            $input['entity_id'],
            $input['field_name'],
            $input['language_code'],
            $input['translated_text'],
            $isAuto
        ]);

        jsonResponse(['success' => true]);
        break;

    case $method === 'DELETE' && preg_match('#^/translations/(\d+)$#', $uri, $matches):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $id = $matches[1];
        $stmt = $conn->prepare("DELETE FROM translations WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    // Translation Sync - Scan for unsynchronized content (checks synchronized_data = FALSE)
    case $method === 'GET' && ($uri === '/sync/scan' || $uri === '/api/sync/scan'):
        checkDbConnection($conn);
        requireAuth($jwtSecret);

        $items = [];
        $languages = ['zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];
        $falseVal = ($GLOBALS['dbType'] === 'pgsql') ? 'false' : '0';
        $totalPending = 0;

        // Check products where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, name FROM products WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'product', 'id' => $row['id'], 'name' => $row['name'], 'fields' => ['name', 'description', 'full_description'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check product_categories where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, name FROM product_categories WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'category', 'id' => $row['id'], 'name' => $row['name'], 'fields' => ['name', 'description'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check sectors where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, name FROM sectors WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'sector', 'id' => $row['id'], 'name' => $row['name'], 'fields' => ['name', 'description'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check certifications where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, name FROM certifications WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'certification', 'id' => $row['id'], 'name' => $row['name'], 'fields' => ['name', 'title', 'description'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check news_articles where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, title FROM news_articles WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'news', 'id' => $row['id'], 'name' => $row['title'], 'fields' => ['title', 'excerpt', 'content'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check job_openings where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, title FROM job_openings WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'job', 'id' => $row['id'], 'name' => $row['title'], 'fields' => ['title', 'description', 'requirements', 'responsibilities'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check hero_slides where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, title FROM hero_slides WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'hero_slide', 'id' => $row['id'], 'name' => $row['title'], 'fields' => ['title', 'subtitle', 'cta_text'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check directors where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, name FROM directors WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'director', 'id' => $row['id'], 'name' => $row['name'], 'fields' => ['name', 'title', 'bio'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check global_operations where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, location_name FROM global_operations WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'global_operation', 'id' => $row['id'], 'name' => $row['location_name'], 'fields' => ['location_name', 'description'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check about_us_content where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, content_key FROM about_us_content WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'about_content', 'id' => $row['id'], 'name' => $row['content_key'], 'fields' => ['content_value'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        // Check contact_info where synchronized_data = FALSE
        $stmt = $conn->query("SELECT id, \"key\" as info_key FROM contact_info WHERE synchronized_data = $falseVal");
        foreach ($stmt->fetchAll() as $row) {
            $items[] = ['type' => 'contact_info', 'id' => $row['id'], 'name' => $row['info_key'], 'fields' => ['value', 'label'], 'languageCount' => count($languages)];
            $totalPending += count($languages);
        }

        jsonResponse(['items' => $items, 'total' => count($items), 'totalMissingTranslations' => $totalPending]);
        break;

    // Translation Sync - Get current status (check if translation is in progress)
    case $method === 'GET' && ($uri === '/sync/status' || $uri === '/api/sync/status'):
        $statusFile = sys_get_temp_dir() . '/translation_sync_status.json';
        if (file_exists($statusFile)) {
            $status = json_decode(file_get_contents($statusFile), true);
            if (isset($status['lastUpdate']) && (time() - $status['lastUpdate']) > 30) {
                unlink($statusFile);
                jsonResponse(['inProgress' => false]);
            } else {
                jsonResponse(array_merge(['inProgress' => true], $status));
            }
        } else {
            jsonResponse(['inProgress' => false]);
        }
        break;

    // Translation Sync - Trigger translation process as background worker
    case $method === 'POST' && ($uri === '/sync/translate' || $uri === '/api/sync/translate'):
        checkDbConnection($conn);
        requireAuth($jwtSecret);

        $statusFile = sys_get_temp_dir() . '/translation_sync_status.json';
        $stopFile = sys_get_temp_dir() . '/translation_sync_stop';

        if (file_exists($statusFile)) {
            $status = json_decode(file_get_contents($statusFile), true);
            if (isset($status['lastUpdate']) && (time() - $status['lastUpdate']) < 30) {
                jsonResponse(['error' => 'A sync is already in progress'], 409);
                break;
            }
        }

        @unlink($stopFile);

        $inputRaw = file_get_contents('php://input');
        $inputData = $inputRaw ? json_decode($inputRaw, true) : [];

        $tmpInput = tempnam(sys_get_temp_dir(), 'sync_');
        file_put_contents($tmpInput, json_encode($inputData));

        file_put_contents($statusFile, json_encode([
            'lastUpdate' => time(),
            'total' => 0,
            'completed' => 0,
            'remaining' => 0,
            'current' => 'Starting translation sync...',
        ]));

        $workerScript = __DIR__ . '/sync_worker.php';
        $cmd = 'php ' . escapeshellarg($workerScript) . ' ' . escapeshellarg($tmpInput) . ' > /dev/null 2>&1 &';
        exec($cmd);

        jsonResponse(['started' => true, 'message' => 'Translation sync started in background']);
        break;

    // Translation Sync - Stop background sync
    case $method === 'POST' && ($uri === '/sync/stop' || $uri === '/api/sync/stop'):
        requireAuth($jwtSecret);
        $stopFile = sys_get_temp_dir() . '/translation_sync_stop';
        file_put_contents($stopFile, '1');
        jsonResponse(['stopped' => true, 'message' => 'Stop signal sent']);
        break;

    case $method === 'GET' && preg_match('#^/tables/list$#', $uri):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);

        $entityConfigs = [
            'products' => ['label' => 'Products'],
            'product_categories' => ['label' => 'Product Categories'],
            'hero_slides' => ['label' => 'Hero Slides'],
            'sectors' => ['label' => 'Sectors'],
            'certifications' => ['label' => 'Certifications'],
            'news_articles' => ['label' => 'News Articles'],
            'job_openings' => ['label' => 'Job Openings'],
            'about_us_content' => ['label' => 'About Us Content'],
            'directors' => ['label' => 'Directors'],
            'global_operations' => ['label' => 'Global Operations'],
            'contact_info' => ['label' => 'Contact Info'],
            'newsletter_subscribers' => ['label' => 'Newsletter Subscribers'],
            'seo_keywords' => ['label' => 'SEO Keywords'],
            'bot_visits' => ['label' => 'AI Bot Visits'],
            'visitor_sessions' => ['label' => 'Visitor Sessions'],
            'page_views' => ['label' => 'Page Views'],
            'pending_changes' => ['label' => 'Pending Changes'],
        ];

        $languages = [
            ['code' => 'en', 'name' => 'English', 'flag' => '🇬🇧'],
            ['code' => 'zh', 'name' => 'Chinese', 'flag' => '🇨🇳'],
            ['code' => 'es', 'name' => 'Spanish', 'flag' => '🇪🇸'],
            ['code' => 'fr', 'name' => 'French', 'flag' => '🇫🇷'],
            ['code' => 'ar', 'name' => 'Arabic', 'flag' => '🇸🇦'],
            ['code' => 'pt', 'name' => 'Portuguese', 'flag' => '🇧🇷'],
            ['code' => 'ru', 'name' => 'Russian', 'flag' => '🇷🇺'],
            ['code' => 'de', 'name' => 'German', 'flag' => '🇩🇪'],
            ['code' => 'ja', 'name' => 'Japanese', 'flag' => '🇯🇵'],
            ['code' => 'sw', 'name' => 'Swahili', 'flag' => '🇰🇪'],
            ['code' => 'tr', 'name' => 'Turkish', 'flag' => '🇹🇷'],
            ['code' => 'vi', 'name' => 'Vietnamese', 'flag' => '🇻🇳'],
            ['code' => 'ko', 'name' => 'Korean', 'flag' => '🇰🇷'],
            ['code' => 'th', 'name' => 'Thai', 'flag' => '🇹🇭'],
            ['code' => 'it', 'name' => 'Italian', 'flag' => '🇮🇹'],
            ['code' => 'pl', 'name' => 'Polish', 'flag' => '🇵🇱'],
        ];

        $tables = [];
        foreach ($entityConfigs as $baseTable => $config) {
            $tables[] = [
                'table' => $baseTable,
                'label' => $config['label'],
            ];
        }

        jsonResponse(['tables' => $tables, 'languages' => $languages]);
        break;

    case $method === 'GET' && preg_match('#^/tables/data$#', $uri):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);

        $table = $_GET['table'] ?? '';
        $lang = $_GET['lang'] ?? 'en';
        $page = max(1, intval($_GET['page'] ?? 1));
        $perPage = 10;
        $offset = ($page - 1) * $perPage;

        $allowedBaseTables = ['products', 'product_categories', 'hero_slides', 'sectors', 'certifications', 'news_articles', 'job_openings', 'about_us_content', 'directors', 'global_operations', 'contact_info', 'newsletter_subscribers', 'seo_keywords', 'bot_visits', 'visitor_sessions', 'page_views', 'pending_changes'];
        $allowedLangs = ['en', 'zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];

        if (!in_array($table, $allowedBaseTables)) {
            jsonResponse(['error' => 'Invalid table name'], 400);
        }
        if (!in_array($lang, $allowedLangs)) {
            jsonResponse(['error' => 'Invalid language code'], 400);
        }

        $actualTable = $lang === 'en' ? $table : $table . '_' . $lang;

        // Check if table exists in current database type
        global $dbType;
        if ($dbType === 'pgsql') {
            $checkStmt = $conn->prepare("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ?)");
            $checkStmt->execute([$actualTable]);
            if (!$checkStmt->fetchColumn()) {
                // Return empty instead of error to keep the UI smooth if a specific lang table is missing
                jsonResponse([
                    'table' => $actualTable,
                    'baseTable' => $table,
                    'language' => $lang,
                    'columns' => [],
                    'primaryKeys' => ['id'],
                    'foreignKeys' => ['master_id'],
                    'rows' => [],
                    'pagination' => [
                        'page' => $page,
                        'perPage' => $perPage,
                        'totalRows' => 0,
                        'totalPages' => 1,
                    ],
                ]);
            }
        }

        global $dbType;
        $q = ($dbType === 'pgsql') ? '"' : '`';
        $countStmt = $conn->query("SELECT COUNT(*) FROM {$q}$actualTable{$q}");
        $totalRows = $countStmt->fetchColumn();
        $totalPages = max(1, ceil($totalRows / $perPage));

        $colStmt = $conn->query("SELECT column_name FROM information_schema.columns WHERE table_name = '$actualTable' AND table_schema = 'public' ORDER BY ordinal_position");
        $columns = $colStmt->fetchAll(PDO::FETCH_COLUMN);

        $pkCols = ['id'];
        $fkCols = ['master_id'];

        $dataStmt = $conn->query("SELECT * FROM {$q}$actualTable{$q} ORDER BY id LIMIT $perPage OFFSET $offset");
        $rows = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

        jsonResponse([
            'table' => $actualTable,
            'baseTable' => $table,
            'language' => $lang,
            'columns' => $columns,
            'primaryKeys' => $pkCols,
            'foreignKeys' => $fkCols,
            'rows' => $rows,
            'pagination' => [
                'page' => $page,
                'perPage' => $perPage,
                'totalRows' => (int) $totalRows,
                'totalPages' => (int) $totalPages,
            ],
        ]);
        break;

    case $method === 'PUT' && preg_match('#^/tables/update$#', $uri):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);

        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $lang = $input['lang'] ?? 'en';
        $rowId = $input['id'] ?? '';
        $updates = $input['updates'] ?? [];

        $allowedBaseTables = ['products', 'product_categories', 'hero_slides', 'sectors', 'certifications', 'news_articles', 'job_openings', 'about_us_content', 'directors', 'global_operations', 'contact_info', 'newsletter_subscribers', 'seo_keywords', 'bot_visits', 'visitor_sessions', 'page_views', 'pending_changes'];
        $allowedLangs = ['en', 'zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];

        if (!in_array($table, $allowedBaseTables)) {
            jsonResponse(['error' => 'Invalid table name'], 400);
        }
        if (!in_array($lang, $allowedLangs)) {
            jsonResponse(['error' => 'Invalid language code'], 400);
        }
        if (empty($rowId) || empty($updates)) {
            jsonResponse(['error' => 'Missing id or updates'], 400);
        }

        $protectedCols = ['id', 'master_id'];
        $updates = array_diff_key($updates, array_flip($protectedCols));

        if (empty($updates)) {
            jsonResponse(['error' => 'No editable fields provided'], 400);
        }

        $actualTable = $lang === 'en' ? $table : $table . '_' . $lang;

        global $dbType;
        $q = ($dbType === 'pgsql') ? '"' : '`';

        $setClauses = [];
        $params = [];
        foreach ($updates as $col => $val) {
            if (preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $col)) {
                $setClauses[] = "{$q}$col{$q} = ?";
                $params[] = $val;
            }
        }

        if (empty($setClauses)) {
            jsonResponse(['error' => 'No valid columns to update'], 400);
        }

        $params[] = $rowId;
        $sql = "UPDATE {$q}$actualTable{$q} SET " . implode(', ', $setClauses) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        jsonResponse(['success' => true, 'message' => 'Record updated successfully']);
        break;

    case $method === 'DELETE' && preg_match('#^/tables/delete$#', $uri):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);

        $input = json_decode(file_get_contents('php://input'), true);
        $table = $input['table'] ?? '';
        $lang = $input['lang'] ?? 'en';
        $rowId = $input['id'] ?? '';

        $allowedBaseTables = ['products', 'product_categories', 'hero_slides', 'sectors', 'certifications', 'news_articles', 'job_openings', 'about_us_content', 'directors', 'global_operations', 'contact_info', 'newsletter_subscribers', 'seo_keywords', 'bot_visits', 'visitor_sessions', 'page_views', 'pending_changes'];
        $allowedLangs = ['en', 'zh', 'es', 'fr', 'ar', 'pt', 'ru', 'de', 'ja', 'sw', 'tr', 'vi', 'ko', 'th', 'it', 'pl'];

        if (!in_array($table, $allowedBaseTables)) {
            jsonResponse(['error' => 'Invalid table name'], 400);
        }
        if (!in_array($lang, $allowedLangs)) {
            jsonResponse(['error' => 'Invalid language code'], 400);
        }
        if (empty($rowId)) {
            jsonResponse(['error' => 'Missing record id'], 400);
        }

        $actualTable = $lang === 'en' ? $table : $table . '_' . $lang;

        if ($lang !== 'en') {
            // Check if table exists
            global $dbType;
            if ($dbType === 'pgsql') {
                $checkStmt = $conn->prepare("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ?)");
                $checkStmt->execute([$actualTable]);
                if (!$checkStmt->fetchColumn()) {
                    jsonResponse(['error' => "Table $actualTable does not exist"], 404);
                }
            }

            global $dbType;
            $q = ($dbType === 'pgsql') ? '"' : '`';
            $masterIdStmt = $conn->prepare("SELECT master_id FROM {$q}$actualTable{$q} WHERE id = ?");
            $masterIdStmt->execute([$rowId]);
            $masterId = $masterIdStmt->fetchColumn();

            $stmt = $conn->prepare("DELETE FROM {$q}$actualTable{$q} WHERE id = ?");
            $stmt->execute([$rowId]);

            if ($masterId) {
                $isPostgres = $conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql';
                $falseVal = $isPostgres ? 'FALSE' : '0';
                $conn->prepare("UPDATE {$q}$table{$q} SET synchronized_data = $falseVal WHERE id = ?")->execute([$masterId]);
            }
        } else {
            global $dbType;
            $q = ($dbType === 'pgsql') ? '"' : '`';
            $stmt = $conn->prepare("DELETE FROM {$q}$actualTable{$q} WHERE id = ?");
            $stmt->execute([$rowId]);
        }

        jsonResponse(['success' => true, 'message' => 'Record deleted successfully']);
        break;

    // ==================== PENDING CHANGES ====================
    case $method === 'GET' && $uri === '/pending-changes/my':
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);

        $stmt = $conn->prepare("SELECT * FROM pending_changes WHERE created_by = ? ORDER BY created_at DESC");
        $stmt->execute([$user['sub']]);
        $changes = $stmt->fetchAll();

        foreach ($changes as &$change) {
            if ($change['original_data'])
                $change['original_data'] = json_decode($change['original_data'], true);
            if ($change['new_data'])
                $change['new_data'] = json_decode($change['new_data'], true);
        }

        jsonResponse($changes);
        break;

    case $method === 'GET' && $uri === '/pending-changes':
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);

        $userStmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'");
        $userStmt->execute([$user['sub']]);
        if (!$userStmt->fetch()) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $status = $_GET['status'] ?? null;
        if ($status) {
            $stmt = $conn->prepare("SELECT pc.*, u.email as creator_email FROM pending_changes pc LEFT JOIN users u ON pc.created_by = u.id WHERE pc.status = ? ORDER BY pc.created_at DESC");
            $stmt->execute([$status]);
        } else {
            $stmt = $conn->prepare("SELECT pc.*, u.email as creator_email FROM pending_changes pc LEFT JOIN users u ON pc.created_by = u.id ORDER BY pc.created_at DESC");
            $stmt->execute();
        }
        $changes = $stmt->fetchAll();

        foreach ($changes as &$change) {
            if ($change['original_data'])
                $change['original_data'] = json_decode($change['original_data'], true);
            if ($change['new_data'])
                $change['new_data'] = json_decode($change['new_data'], true);
        }

        jsonResponse($changes);
        break;

    case $method === 'POST' && $uri === '/pending-changes':
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);
        $input = getInput();

        $id = generateUUID();
        $now = date('Y-m-d H:i:s');

        $newData = $input['new_data'] ?? null;
        if ($newData && is_array($newData)) {
            $tbl = $input['table_name'] ?? '';
            $imgField = ($tbl === 'directors') ? 'photo_url' : 'image_url';
            if (isset($newData[$imgField]) && $newData[$imgField]) {
                $imgId = $newData['id'] ?? $input['record_id'] ?? $id;
                $newData[$imgField] = saveBase64ImageToFile($newData[$imgField], $tbl, $imgId);
            }
        }

        $stmt = $conn->prepare("INSERT INTO pending_changes (id, table_name, record_id, change_type, original_data, new_data, status, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)");
        $stmt->execute([
            $id,
            $input['table_name'],
            $input['record_id'] ?? null,
            $input['change_type'],
            $input['original_data'] ? json_encode($input['original_data']) : null,
            $newData ? json_encode($newData) : null,
            $user['sub'],
            $now,
            $now
        ]);

        $stmt = $conn->prepare("SELECT * FROM pending_changes WHERE id = ?");
        $stmt->execute([$id]);
        $change = $stmt->fetch();
        if ($change['original_data'])
            $change['original_data'] = json_decode($change['original_data'], true);
        if ($change['new_data'])
            $change['new_data'] = json_decode($change['new_data'], true);

        jsonResponse($change, 201);
        break;

    case $method === 'PUT' && preg_match('#^/pending-changes/([^/]+)/review$#', $uri, $m):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);
        $changeId = $m[1];
        $input = getInput();

        $userStmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'");
        $userStmt->execute([$user['sub']]);
        if (!$userStmt->fetch()) {
            jsonResponse(['error' => 'Admin access required'], 403);
        }

        $action = $input['action'];
        $revisionNotes = $input['revision_notes'] ?? null;
        $now = date('Y-m-d H:i:s');

        $statusMap = [
            'approve' => 'approved',
            'reject' => 'rejected',
            'request_revision' => 'revision_requested'
        ];
        $newStatus = $statusMap[$action] ?? 'pending';

        $stmt = $conn->prepare("SELECT * FROM pending_changes WHERE id = ?");
        $stmt->execute([$changeId]);
        $change = $stmt->fetch();
        if (!$change) {
            jsonResponse(['error' => 'Pending change not found'], 404);
        }

        if ($newStatus === 'approved') {
            $tableName = $change['table_name'];
            $changeType = $change['change_type'];
            $recordId = $change['record_id'];
            $newData = json_decode($change['new_data'], true);

            try {
                $imageField = ($tableName === 'directors') ? 'photo_url' : 'image_url';
                if (isset($newData[$imageField]) && $newData[$imageField]) {
                    $imgId = $newData['id'] ?? $recordId ?? generateUUID();
                    $newData[$imageField] = saveBase64ImageToFile($newData[$imageField], $tableName, $imgId);
                }

                if ($changeType === 'create' && $newData) {
                    $newData['id'] = generateUUID();
                    $columns = implode(', ', array_map(function ($col) use ($conn) {
                        $q = ($conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql') ? '"' : '`';
                        return $q . $col . $q;
                    }, array_keys($newData)));
                    $placeholders = implode(', ', array_fill(0, count($newData), '?'));
                    $sql = ($conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql')
                        ? "INSERT INTO \"$tableName\" ($columns) VALUES ($placeholders)"
                        : "INSERT INTO `$tableName` ($columns) VALUES ($placeholders)";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute(array_values($newData));
                } elseif ($changeType === 'update' && $recordId && $newData) {
                    unset($newData['id'], $newData['created_at'], $newData['updated_at']);
                    $setClauses = [];
                    $values = [];
                    foreach ($newData as $col => $val) {
                        $q = ($conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql') ? '"' : '`';
                        $setClauses[] = $q . $col . $q . " = ?";
                        $values[] = $val;
                    }
                    $values[] = $recordId;
                    $setString = implode(', ', $setClauses);
                    $sql = ($conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql')
                        ? "UPDATE \"$tableName\" SET $setString WHERE id = ?"
                        : "UPDATE `$tableName` SET $setString WHERE id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute($values);
                } elseif ($changeType === 'delete' && $recordId) {
                    $sql = ($conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'pgsql')
                        ? "DELETE FROM \"$tableName\" WHERE id = ?"
                        : "DELETE FROM `$tableName` WHERE id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute([$recordId]);
                }
            } catch (Exception $e) {
                error_log("Error applying pending change: " . $e->getMessage());
                jsonResponse(['error' => 'Failed to apply change: ' . $e->getMessage()], 500);
            }
        }

        $stmt = $conn->prepare("UPDATE pending_changes SET status = ?, revision_notes = ?, reviewed_by = ?, reviewed_at = ?, updated_at = ? WHERE id = ?");
        $stmt->execute([$newStatus, $revisionNotes, $user['sub'], $now, $now, $changeId]);

        $stmt = $conn->prepare("SELECT * FROM pending_changes WHERE id = ?");
        $stmt->execute([$changeId]);
        $change = $stmt->fetch();
        if ($change['original_data'])
            $change['original_data'] = json_decode($change['original_data'], true);
        if ($change['new_data'])
            $change['new_data'] = json_decode($change['new_data'], true);

        jsonResponse($change);
        break;

    case $method === 'PUT' && preg_match('#^/pending-changes/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);
        $changeId = $m[1];
        $input = getInput();

        $stmt = $conn->prepare("SELECT * FROM pending_changes WHERE id = ? AND created_by = ?");
        $stmt->execute([$changeId, $user['sub']]);
        $change = $stmt->fetch();
        if (!$change) {
            jsonResponse(['error' => 'Pending change not found'], 404);
        }

        $now = date('Y-m-d H:i:s');
        $stmt = $conn->prepare("UPDATE pending_changes SET new_data = ?, status = 'pending', revision_notes = NULL, updated_at = ? WHERE id = ?");
        $stmt->execute([json_encode($input), $now, $changeId]);

        $stmt = $conn->prepare("SELECT * FROM pending_changes WHERE id = ?");
        $stmt->execute([$changeId]);
        $change = $stmt->fetch();
        if ($change['original_data'])
            $change['original_data'] = json_decode($change['original_data'], true);
        if ($change['new_data'])
            $change['new_data'] = json_decode($change['new_data'], true);

        jsonResponse($change);
        break;

    case $method === 'DELETE' && preg_match('#^/pending-changes/([^/]+)$#', $uri, $m):
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);
        $changeId = $m[1];

        $userStmt = $conn->prepare("SELECT role FROM user_roles WHERE user_id = ? AND role = 'admin'");
        $userStmt->execute([$user['sub']]);
        $isAdmin = $userStmt->fetch();

        if ($isAdmin) {
            $stmt = $conn->prepare("DELETE FROM pending_changes WHERE id = ?");
            $stmt->execute([$changeId]);
        } else {
            $stmt = $conn->prepare("DELETE FROM pending_changes WHERE id = ? AND created_by = ?");
            $stmt->execute([$changeId, $user['sub']]);
        }

        jsonResponse(['success' => true]);
        break;

    // Product Specifications CRUD
    case $method === 'GET' && $uri === '/product-specifications':
        checkDbConnection($conn);

        $productId = $_GET['product_id'] ?? null;
        if ($productId) {
            $stmt = $conn->prepare("SELECT * FROM product_specifications WHERE product_id = ? ORDER BY created_at DESC");
            $stmt->execute([$productId]);
        } else {
            $stmt = $conn->query("SELECT * FROM product_specifications ORDER BY created_at DESC");
        }
        jsonResponse($stmt->fetchAll());
        break;

    case $method === 'POST' && $uri === '/product-specifications':
        checkDbConnection($conn);
        $user = requireAuth($jwtSecret);
        $input = getInput();

        $id = uniqid('spec-', true);
        $stmt = $conn->prepare("INSERT INTO product_specifications (id, product_id, name, file_name, file_url, file_path, file_size, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $id,
            $input['product_id'],
            $input['name'] ?? null,
            $input['file_name'],
            $input['file_url'],
            $input['file_path'] ?? null,
            $input['file_size'] ?? null,
            $user['sub']
        ]);

        $stmt = $conn->prepare("SELECT * FROM product_specifications WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse($stmt->fetch(), 201);
        break;

    case $method === 'DELETE' && preg_match('#^/product-specifications/(.+)$#', $uri, $m):
        checkDbConnection($conn);
        requireAuth($jwtSecret);
        $specId = $m[1];

        $stmt = $conn->prepare("DELETE FROM product_specifications WHERE id = ?");
        $stmt->execute([$specId]);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Not found'], 404);
}
