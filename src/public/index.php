<?php
// Bật hiển thị lỗi khi debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Danh sách origin được phép
$allowedOrigins = [
    'http://localhost:3000',
    'http://172.19.16.1:3000'
];

// Lấy origin gửi lên từ client
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Kiểm tra và set header phù hợp
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}

// OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

// Các header mặc định khác
header("Content-Type: application/json");

// Import route
require_once '../routes/api.php';
?>
