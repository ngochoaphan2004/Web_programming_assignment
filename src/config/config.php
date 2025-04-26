<?php
function loadEnv($file) {
    if (!file_exists($file)) {
        die("⚠️ Không tìm thấy file .env");
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

// Load biến môi trường từ file `.env`
loadEnv(__DIR__ . '/../.env');

return [
    "DB_HOST" => $_ENV["DB_HOST"] ?? "localhost",
    "DB_NAME" => $_ENV["DB_NAME"] ?? "",
    "DB_USER" => $_ENV["DB_USER"] ?? "",
    "DB_PASSWORD" => $_ENV["DB_PASSWORD"] ?? "",
    "JWT_SECRET" => $_ENV["JWT_SECRET"] ?? "",
];
?>
