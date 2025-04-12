<?php
class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $config = require_once __DIR__ . '/../config/config.php';

        $host = $config['DB_HOST'];
        $dbname = $config['DB_NAME'];
        $user = $config['DB_USER'];
        $password = $config['DB_PASSWORD'];

        try {
            $this->conn = new PDO(
                "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                $user,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        } catch (PDOException $e) {
            die("❌ Lỗi kết nối Database: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>
