<?php
error_reporting(E_ALL); // Hiển thị tất cả lỗi
ini_set('display_errors', 1); // Bật hiển thị lỗi trên trình duyệt

require_once '../src/core/database.php';

$conn = Database::getInstance();

if ($conn) {
    echo "✅ Kết nối MySQL thành công!";
} else {
    echo "❌ Lỗi kết nối!";
}
?>