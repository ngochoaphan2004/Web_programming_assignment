<?php
// Bật hiển thị lỗi khi debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Header (cho phép API hoạt động)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:3000");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
    http_response_code(200);
    exit();
}
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cung cấp origin chính xác
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Cung cấp các header bạn sử dụng
header("Access-Control-Allow-Credentials: true");
// Import file API routes
require_once '../routes/api.php';
?>