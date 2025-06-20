<?php
require_once '../core/database.php';

require_once '../utils/JWT.php';


class User
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAllUsers()
    {
        $stmt = $this->db->query("SELECT * FROM users");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createUser($name, $email, $password)
    {
        $stmt = $this->db->prepare("INSERT INTO users (name, email,password) VALUES (:name, :email,:password)");
        return $stmt->execute(["name" => $name, "email" => $email, "password => $password"]);
    }
    public function createUserWithPassword($name, $email, $password, $avatar, $dob, $phone, $address, $gender) {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password, avatar, dob, phone, address, gender) 
        VALUES (:name, :email, :password, :avatar, :dob, :phone, :address, :gender)");
        return $stmt->execute([':name' => $name,
        ':email' => $email,
        ':password' => $password,
        'avatar' => $avatar,
        'dob' => $dob,
        'phone' => $phone,
        'address' => $address,
        'gender' => $gender]);
    }


    public function getUserByEmail($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function getUserByIdByClient($id)
    {
        $stmt = $this->db->prepare("SELECT id,name,email,avatar,dob,address,role,phone FROM users WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public function getUserById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $baseURL = $_ENV['BASE_URL'];
        $user['avatar'] = $baseURL . $user['avatar'];
        return $user;

    }
    public function login($email, $password)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($password, $user['password'])) {


            return null;
        }
        return $user;
    }

    public function updateProfile($id,$name, $dob, $phone, $address, $gender) {
        $stmt = $this->db->prepare("UPDATE users SET name = :name, dob = :dob, phone = :phone, address = :address, gender = :gender WHERE id = :id");
        return $stmt->execute([
            ':id' => $id,
            ':name' => $name,
            ':dob' => $dob,
            ':phone' => $phone,
            ':address' => $address,
            ':gender' => $gender
        ]);
    }

    public function changePassword($id, $newPassword)
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare("UPDATE users SET password = :password WHERE id = :id");
        return $stmt->execute([':id' => $id, ':password' => $hashedPassword]);
    }

    public function deleteUser($id)
    {
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function updateAvatar($id, $avatarPath)
    {
        $query = "UPDATE users SET avatar = :avatar WHERE id = :id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([':avatar' => $avatarPath, ':id' => $id]);
    }
}
