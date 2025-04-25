<?php
header('Content-Type: application/json');
require_once '../models/user.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Xử lý đăng ký
if ($method === 'POST' && $uri === '/register') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');
    $email = trim($data['email'] ?? '');
    if (!$username || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Vui lòng nhập username và password']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(['error' => 'Tên người dùng đã tồn tại']);
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        $stmt->execute([$username, $hashedPassword]);

        echo json_encode(['message' => 'Đăng ký thành công']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Lỗi hệ thống']);
    }
}
