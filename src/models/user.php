<?php
require_once '../core/database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAllUsers() {
        $stmt = $this->db->query("SELECT * FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createUser($name, $email, $password) {
        $stmt = $this->db->prepare("INSERT INTO users (name, email,password) VALUES (:name, :email,:password)");
        return $stmt->execute(["name" => $name, "email" => $email, "password => $password"]);
    }
    public function createUserWithPassword($name, $email, $password, $username, $avatar, $dob, $phone, $address) {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, username, avatar, dob, phone, address) 
        VALUES (:name, :email, :password, :username, :avatar, :dob, :phone, :address)");
        return $stmt->execute([':name' => $name,
        ':email' => $email,
        ':password' => $password,
        ':username' => $username,
        'avatar' => $avatar,
        'dob' => $dob,
        'phone' => $phone,
        'address' => $address]);
    }
    
    
    public function getUserByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function getUserById($id) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function login($email, $password){
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$user || !password_verify($password, $user['password'])) {
            return null;
        }
        return $user;
    }

    public function updateProfile($id,$name, $username, $dob, $phone, $address) {
        $stmt = $this->db->prepare("UPDATE users SET name = :name, username = :username, dob = :dob, phone = :phone, address = :address WHERE id = :id");
        return $stmt->execute([
            ':id' => $id,
            ':name' => $name,
            ':username' => $username,
            ':dob' => $dob,
            ':phone' => $phone,
            ':address' => $address
        ]);
    }
    public function changePassword($id, $newPassword) {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare("UPDATE users SET password = :password WHERE id = :id");
        return $stmt->execute([':id' => $id, ':password' => $hashedPassword]);
    }
    public function deleteUser($id) {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>
