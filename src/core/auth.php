<?php
require_once '../utils/JWT.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth {
    private static $secretKey = "tuansieucapdeptrai"; // Cần trùng với config

    // Tạo JWT Token
    public static function generateToken($user) {
        $payload = [
            "id" => $user["id"],
            "email" => $user["email"],
            "exp" => time() + 3600 // Token hết hạn sau 1 giờ
        ];
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    // Xác thực JWT
    public static function verifyToken($token) {
        try {
            return JWT::decode($token, new Key(self::$secretKey, 'HS256'));
        } catch (Exception $e) {
            return null;
        }
    }
}
?>
