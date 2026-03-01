<?php
set_time_limit(0);
ini_set('max_execution_time', 0);

$inputFile = $argv[1] ?? null;
if (!$inputFile || !file_exists($inputFile)) {
    error_log("sync_worker: No input file provided or file not found");
    exit(1);
}

$inputData = json_decode(file_get_contents($inputFile), true);
@unlink($inputFile);

$selectedItems = $inputData['selectedItems'] ?? null;

$statusFile = sys_get_temp_dir() . '/translation_sync_status.json';
$stopFile = sys_get_temp_dir() . '/translation_sync_stop';

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
        error_log("sync_worker DB error: " . $e->getMessage());
        exit(1);
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
        error_log("sync_worker DB error: " . $e->getMessage());
        exit(1);
    }
} else {
    $host = getenv('MYSQL_HOST') ?: 'localhost';
    $user = getenv('MYSQL_USER') ?: 'root';
    $password = getenv('MYSQL_PASSWORD') ?: '';
    $database = getenv('MYSQL_DATABASE') ?: 'app_database';
    try {
        $conn = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $user, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("sync_worker DB error: " . $e->getMessage());
        exit(1);
    }
}

$languages = [
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

$falseVal = ($dbType === 'pgsql') ? 'false' : '0';
$trueVal = ($dbType === 'pgsql') ? 'true' : '1';
$translationServiceUrl = 'http://localhost:3001/translate';

$updateStatusFile = function($data) use ($statusFile) {
    $data['lastUpdate'] = time();
    file_put_contents($statusFile, json_encode($data));
};

$clearStatusFile = function() use ($statusFile) {
    if (file_exists($statusFile)) {
        @unlink($statusFile);
    }
};

$entityConfigs = [
    'product' => ['table' => 'products', 'fields' => ['name', 'description', 'full_description'], 'nameField' => 'name'],
    'category' => ['table' => 'product_categories', 'fields' => ['name', 'description'], 'nameField' => 'name'],
    'sector' => ['table' => 'sectors', 'fields' => ['name', 'description'], 'nameField' => 'name'],
    'certification' => ['table' => 'certifications', 'fields' => ['name', 'title', 'description'], 'nameField' => 'name'],
    'news' => ['table' => 'news_articles', 'fields' => ['title', 'excerpt', 'content'], 'nameField' => 'title'],
    'job' => ['table' => 'job_openings', 'fields' => ['title', 'description', 'requirements', 'responsibilities'], 'nameField' => 'title'],
    'hero_slide' => ['table' => 'hero_slides', 'fields' => ['title', 'subtitle', 'cta_text'], 'nameField' => 'title'],
    'director' => ['table' => 'directors', 'fields' => ['name', 'title', 'bio'], 'nameField' => 'name'],
    'global_operation' => ['table' => 'global_operations', 'fields' => ['location_name', 'description'], 'nameField' => 'location_name'],
    'about_content' => ['table' => 'about_us_content', 'fields' => ['content_value'], 'nameField' => 'content_key'],
    'contact_info' => ['table' => 'contact_info', 'fields' => ['value', 'label'], 'nameField' => 'key'],
];

$batchSize = 10;

$pendingItems = [];
foreach ($entityConfigs as $type => $config) {
    $table = $config['table'];
    $nameField = $config['nameField'];
    $selectFields = implode(', ', array_merge(['id'], $config['fields']));
    $selectFieldsSafe = str_replace('key', '"key"', $selectFields);
    $nameFieldSafe = $nameField === 'key' ? '"key"' : $nameField;

    $stmt = $conn->query("SELECT $selectFieldsSafe, $nameFieldSafe as display_name FROM $table WHERE synchronized_data = $falseVal");
    foreach ($stmt->fetchAll() as $row) {
        if ($selectedItems !== null) {
            $itemKey = $type . ':' . $row['id'];
            if (!in_array($itemKey, $selectedItems)) {
                continue;
            }
        }
        $fields = [];
        foreach ($config['fields'] as $field) {
            $fields[$field] = $row[$field] ?? '';
        }
        $pendingItems[] = [
            'type' => $type,
            'table' => $table,
            'id' => $row['id'],
            'name' => $row['display_name'],
            'fields' => $fields
        ];
    }
}

$totalPendingItems = count($pendingItems);

if ($totalPendingItems === 0) {
    $clearStatusFile();
    exit(0);
}

$batchItems = array_slice($pendingItems, 0, $batchSize);
$remainingAfterBatch = $totalPendingItems - count($batchItems);
$batchTotal = count($batchItems) * count($languages);
$completed = 0;

$updateStatusFile([
    'total' => $batchTotal,
    'completed' => 0,
    'remaining' => $batchTotal,
    'current' => "Processing batch of " . count($batchItems) . " items (" . $remainingAfterBatch . " remaining after this batch)...",
    'batchSize' => count($batchItems),
    'totalPending' => $totalPendingItems,
    'remainingAfterBatch' => $remainingAfterBatch
]);

$errors = [];

foreach ($batchItems as $item) {
    if (file_exists($stopFile)) {
        @unlink($stopFile);
        $updateStatusFile([
            'total' => $batchTotal,
            'completed' => $completed,
            'remaining' => $batchTotal - $completed,
            'current' => 'Sync stopped by user. All completed translations are saved.',
            'stopped' => true,
            'remainingAfterBatch' => $remainingAfterBatch,
            'hasMore' => false,
            'errorCount' => count($errors),
        ]);
        sleep(2);
        $clearStatusFile();
        exit(0);
    }

    $table = $item['table'];
    $masterId = $item['id'];
    $fields = $item['fields'];
    $itemHadError = false;

    foreach ($languages as $lang) {
        if (file_exists($stopFile)) {
            break;
        }

        $langCode = $lang['code'];
        $langTable = "{$table}_{$langCode}";

        try {
            $translatedFields = [];
            foreach ($fields as $field => $value) {
                if (!empty($value)) {
                    $postData = json_encode(['text' => $value, 'targetLanguage' => $lang['name']]);
                    $opts = [
                        'http' => [
                            'method' => 'POST',
                            'header' => 'Content-Type: application/json',
                            'content' => $postData,
                            'timeout' => 60
                        ]
                    ];
                    $context = stream_context_create($opts);
                    $result = @file_get_contents($translationServiceUrl, false, $context);

                    if ($result !== false) {
                        $translationResult = json_decode($result, true);
                        if (isset($translationResult['error'])) {
                            $errorMsg = "Translation API error for '{$item['name']}' ({$field}) to {$lang['name']}: {$translationResult['error']}";
                            $errors[] = $errorMsg;
                            error_log($errorMsg);
                            $translatedFields[$field] = $value;
                            $itemHadError = true;
                        } else {
                            $translatedFields[$field] = $translationResult['translation'] ?? $value;
                        }
                    } else {
                        $lastError = error_get_last();
                        $errorDetail = $lastError ? $lastError['message'] : 'Connection failed';
                        $errorMsg = "Translation service unreachable for '{$item['name']}' ({$field}) to {$lang['name']}: {$errorDetail}";
                        $errors[] = $errorMsg;
                        error_log($errorMsg);
                        $translatedFields[$field] = $value;
                        $itemHadError = true;
                    }
                } else {
                    $translatedFields[$field] = '';
                }
            }

            $fieldNames = array_keys($translatedFields);
            $fieldPlaceholders = array_fill(0, count($fieldNames), '?');
            $fieldValues = array_values($translatedFields);

            $checkStmt = $conn->prepare("SELECT id FROM $langTable WHERE master_id = ?");
            $checkStmt->execute([$masterId]);
            $existingRecord = $checkStmt->fetch();

            if ($existingRecord) {
                $setClause = implode(', ', array_map(fn($f) => "$f = ?", $fieldNames));
                $updateStmt = $conn->prepare("UPDATE $langTable SET $setClause, updated_at = CURRENT_TIMESTAMP WHERE master_id = ?");
                $updateStmt->execute(array_merge($fieldValues, [$masterId]));
            } else {
                $insertFields = array_merge(['master_id'], $fieldNames);
                $insertPlaceholders = array_merge(['?'], $fieldPlaceholders);
                $insertStmt = $conn->prepare("INSERT INTO $langTable (" . implode(', ', $insertFields) . ") VALUES (" . implode(', ', $insertPlaceholders) . ")");
                $insertStmt->execute(array_merge([$masterId], $fieldValues));
            }

            $completed++;
            $remaining = $batchTotal - $completed;
            $progressData = [
                'total' => $batchTotal,
                'completed' => $completed,
                'remaining' => $remaining,
                'current' => "Translated {$item['name']} to {$lang['name']}",
                'entityType' => $table,
                'entityName' => $item['name'],
                'languageCode' => $lang['code'],
                'languageName' => $lang['name'],
                'languageFlag' => $lang['flag'],
                'remainingAfterBatch' => $remainingAfterBatch
            ];
            if ($itemHadError) {
                $progressData['error'] = end($errors);
            }
            $updateStatusFile($progressData);

        } catch (Exception $e) {
            $errorMsg = "Database error for '{$item['name']}' to {$lang['name']}: {$e->getMessage()}";
            $errors[] = $errorMsg;
            error_log($errorMsg);
            $itemHadError = true;
            $completed++;
        }
    }

    if (!$itemHadError) {
        $conn->prepare("UPDATE $table SET synchronized_data = $trueVal WHERE id = ?")->execute([$masterId]);
    }
}

$hasMore = $remainingAfterBatch > 0;
$updateStatusFile([
    'total' => $batchTotal,
    'completed' => $completed,
    'remaining' => 0,
    'current' => $hasMore ? "Batch complete! {$remainingAfterBatch} items remaining." : "All content synchronized!",
    'batchComplete' => true,
    'hasMore' => $hasMore,
    'remainingItems' => $remainingAfterBatch,
    'batchCompleted' => $completed,
    'errorCount' => count($errors),
    'errors' => count($errors) > 0 ? array_slice($errors, -5) : [],
    'remainingAfterBatch' => $remainingAfterBatch
]);

sleep(5);
$clearStatusFile();
