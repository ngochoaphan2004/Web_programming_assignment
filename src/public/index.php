<?php
// Bật hiển thị lỗi khi debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Header (cho phép API hoạt động)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Import file API routes
require_once '../routes/api.php';
