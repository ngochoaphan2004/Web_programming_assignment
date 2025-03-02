<?php
require_once '../core/database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAllUsers() {
        $stmt = $this->db->query("SELECT name, email FROM user");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createUser($name, $email) {
        $stmt = $this->db->prepare("INSERT INTO user (name, email) VALUES (:name, :email)");
        return $stmt->execute(["name" => $name, "email" => $email]);
    }
}
?>
