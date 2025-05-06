<?php
require_once '../models/user.php';
require_once '../core/auth.php';
require_once '../helpers/avatarHandle.php';
class UserController {
    public function getUsers() {
        $userModel = new User();
        $users = $userModel->getAllUsers();
        echo json_encode(["success" => true, "data" => $users], JSON_PRETTY_PRINT);
    }

    public function register() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            exit;
        }

        if (empty($_POST)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "No data received from the form"]);
            exit;
        }
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $dob = trim($_POST['dob'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address'] ?? '');
        $gender =trim($_POST['gender'] ?? '');
        if (empty($name) || empty($email) || empty($password) || empty($dob) || empty($phone) || empty($address) || empty($gender)) {
            echo json_encode(["success" => false, "message" => "Invalid data"]);
            return;
        }
        $avatarPath = 'default.png';
        $userModel = new User();
        if ($userModel->getUserByEmail($email)) {
            echo json_encode(["success" => false, "message" => "Email already exists"]);
            return;
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        if ($userModel->createUserWithPassword($name, $email, $hashedPassword, avatar: $avatarPath, dob: $dob, phone: $phone, address: $address, gender: $gender)) {
            echo json_encode(["success" => true, "message" => "Registration successful"]);
        } else {
            echo json_encode(["success" => false, "message" => "Registration failed"]);
        }
    }


    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            exit;
        }

        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
    
        if (empty($email) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Email and password are required"]);
            return;
        }
    
        $userModel = new User();
        $user = $userModel->login($email, $password);
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Account does not exist"]);
            return;
        }

        if (!password_verify($password, $user['password'])) {
            echo json_encode(["success" => false, "message" => "Incorrect password"]);
            return;
        }
        $baseUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/api/src/public';

        // Giả sử $user['avatar'] chứa tên file
        $avatarFile = basename($user['avatar']); // Lấy tên file thôi, tránh đường dẫn tuyệt đối

        // Nếu có avatar thì tạo URL
        $avatarUrl = $avatarFile
            ? $baseUrl . '/uploads/' . rawurlencode($avatarFile)
            : null;

        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['name'] = $user['name'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['avatar'] = $avatarUrl;
        $_SESSION['role'] = $user['role'];

        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "avatar" => $user['avatar'],
                "role" => $user['role']
            ]
        ]);
    }
    
    

    public function editProfile() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User is not logged in"]);
            return;
        }
    
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "User does not exist"]);
            return;
        }
    
        $name = trim($_POST['name'] ?? $user['name']);
        $dob = trim($_POST['dob'] ?? $user['dob']);
        $phone = trim($_POST['phone'] ?? $user['phone']);
        $address = trim($_POST['address'] ?? $user['address']);
        $gender = trim($_POST['gender'] ?? $user['gender']);

        // Handle avatar (if any)
        
        $stmt = $userModel->updateProfile($user_id, $name,$dob, $phone, $address,$gender);
    
        if ($stmt) {
            echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Profile update failed"]);
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(["success" => true, "message" => "Logged out successfully"]);
    }

    public function getUser() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User is not logged in"]);
            return;
        }
    
        $userModel = new User();
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "User does not exist"]);
            return;
        }
    
        echo json_encode(["success" => true, "data" => $user]);
    }

    public function changeAvatar() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User is not logged in"]);
            return;
        }
    
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "User does not exist"]);
            return;
        }
        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == 0) {
            $uploadDir = __DIR__ . '/../../src/public/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $file = $_FILES['avatar'];
            $fileName = uniqid() . '-' . basename($file['name']);
            $targetPath = $uploadDir . $fileName; // đường vật lý
            $avatarPath = 'public/uploads/' . $fileName;
    
            // Check valid file format
            $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!in_array($file['type'], $allowedTypes)) {
                echo json_encode(['success' => false, 'message' => 'Only PNG, JPG images are allowed']);
                return;
            }
    
            // Check file size (max 5MB)
            if ($file['size'] > 5 * 1024 * 1024) {
                echo json_encode(['success' => false, 'message' => 'File too large, max 5MB']);
                return;
            }
            
            // Save file
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $avatarPath = $targetPath;
            } else {
                echo json_encode(['success' => false, 'message' => 'Error saving file']);
                return;
            }
        }
        else {
            echo json_encode(["success" => false, "message" => "Avatar update failed"]);
            return;
        }
        // Cập nhật avatar mới trong cơ sở dữ liệu
        $stmt = $userModel->updateAvatar($user_id, $fileName);
        if ($stmt) {
            $_SESSION['avatar']  = $_ENV['BASE_URL'] . $fileName;
            echo json_encode(["success" => true, "message" => "Avatar updated successfully", "user" => $user, "avatar" => $avatarPath]);
        } else {
            echo json_encode(["success" => false, "message" => "Avatar update failed"]);
        }
    }
    

    public function changePassword() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User is not logged in"]);
            return;
        }
    
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "User does not exist"]);
            return;
        }
    
        $newPassword = trim($_POST['new_password'] ?? '');
    
        if (empty($newPassword)) {
            echo json_encode(["success" => false, "message" => "New password is required"]);
            return;
        }
    
        if ($userModel->changePassword($user_id, $newPassword)) {
            echo json_encode(["success" => true, "message" => "Password changed successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Password change failed"]);
        }
    }

    public function deleteUser() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "User is not logged in"]);
            return;
        }
        $role = $_SESSION['role'] ?? null;
        if ($role !== '1') {
            echo json_encode(["success" => false, "message" => "Only admins can delete accounts"]);
            return;
        }
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "User does not exist"]);
            return;
        }
    
        if ($userModel->deleteUser($user_id)) {
            session_destroy();
            echo json_encode(["success" => true, "message" => "Delete user successfull"]);
        } else {
            echo json_encode(["success" => false, "message" => "Delete user unsuccessfull"]);
        }
    }
    public function checkSession() {
        $authService = new AuthService();
        $sessionStatus = $authService->checkSession();
        echo json_encode($sessionStatus);
    }
}
?>
