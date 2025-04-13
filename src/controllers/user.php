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
            echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
            exit;
        }

        if (empty($_POST)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Không nhận được dữ liệu từ form"]);
            exit;
        }
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $dob = trim($_POST['dob'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address' ] ?? '');
        if (empty($name) || empty($email) || empty($password) || empty($username) || empty($dob) || empty($phone) || empty($address)) {
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }
        $avatarPath = __DIR__ . 'uploads/default.jpg';
        $userModel = new User();
        if ($userModel->getUserByEmail($email)) {
            echo json_encode(["success" => false, "message" => "Email đã tồn tại"]);
            return;
        }

        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        if ($userModel->createUserWithPassword($name, $email, $hashedPassword, username: $username, avatar: $avatarPath, dob: $dob, phone: $phone, address: $address)) {
            echo json_encode(["success" => true, "message" => "Đăng ký thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi đăng ký"]);
        }
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
            exit;
        }

        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
    
        if (empty($email) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Email và mật khẩu không được để trống"]);
            return;
        }
    
        $userModel = new User();
        $user = $userModel->login($email, $password);
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Tài khoản không tồn tại"]);
            return;
        }

        if (!password_verify($password, $user['password'])) {
            echo json_encode(["success" => false, "message" => "Mật khẩu không chính xác"]);
            return;
        }

        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công",
            "user" => [
                "id" => $user['id'],
                "username" => $user['username'],
                "email" => $user['email'],
                "avatar" => $user['avatar']
            ]
        ]);
    }
    

    public function editProfile() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            return;
        }
    
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
            return;
        }
    
        $name = trim($_POST['name'] ?? $user['name']);
        // $email    = trim($_POST['email'] ?? $user['email']);
        $dob = trim($_POST['dob'] ?? $user['dob']);
        $phone = trim($_POST['phone'] ?? $user['phone']);
        $address = trim($_POST['address'] ?? $user['address']);
        $username = trim($_POST['username'] ?? $user['username']);
        // $password = !empty($_POST['password']) ? password_hash($_POST['password'], PASSWORD_BCRYPT) : $user['password'];
        echo json_encode($_POST['username']);
        // Xử lý avatar (nếu có)
        $avatarPath = $user['avatar']; // Giữ nguyên avatar cũ nếu không có ảnh mới
        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == 0) {
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
    
            $file = $_FILES['avatar'];
            $fileName = uniqid() . '-' . basename($file['name']);
            $targetPath = $uploadDir . $fileName;
    
            // Kiểm tra định dạng file hợp lệ
            $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!in_array($file['type'], $allowedTypes)) {
                echo json_encode(['success' => false, 'message' => 'Chỉ cho phép ảnh PNG, JPG']);
                return;
            }
    
            // Kiểm tra kích thước file (tối đa 5MB)
            if ($file['size'] > 5 * 1024 * 1024) {
                echo json_encode(['success' => false, 'message' => 'File quá lớn, tối đa 5MB']);
                return;
            }
    
            // Lưu file ảnh
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $avatarPath = $targetPath;
            } else {
                echo json_encode(['success' => false, 'message' => 'Lỗi khi lưu file']);
                return;
            }
        }
    
        $stmt = $userModel->updateProfile($user_id, $name, $username, $dob, $phone, $address);
    
        if ($stmt) {
            echo json_encode(["success" => true, "message" => "Cập nhật hồ sơ thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi cập nhật hồ sơ"]);
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        echo json_encode(["success" => true, "message" => "Đăng xuất thành công"]);
    }
    public function getUser() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            return;
        }
    
        $userModel = new User();
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
            return;
        }
    
        echo json_encode(["success" => true, "data" => $user]);
    }
    public function changeAvatar() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            return;
        }
    
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
            return;
        }
    
        $avatarPath = $user['avatar']; 
        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == 0) {
            $avatarUpload = handleAvatarUpload($_FILES['avatar']);
            if (!$avatarUpload['success']) {
                echo json_encode(['success' => false, 'message' => $avatarUpload['message']]);
                return;
            }
            $avatarPath = $avatarUpload['path'];
        }
        $stmt = $userModel->updateAvatar($user_id, $avatarPath);
        if ($stmt) {
            echo json_encode(["success" => true, "message" => "Cập nhật ảnh đại diện thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi cập nhật ảnh đại diện"]);
        }
    }
    public function changePassword() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            return;
        }
    
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
            return;
        }
    
        $newPassword = trim($_POST['new_password'] ?? '');
    
        if (empty($newPassword)) {
            echo json_encode(["success" => false, "message" => "Mật khẩu mới không được để trống"]);
            return;
        }
    
        if ($userModel->changePassword($user_id, $newPassword)) {
            echo json_encode(["success" => true, "message" => "Đổi mật khẩu thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi đổi mật khẩu"]);
        }
    }
    public function deleteUser() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
            exit;
        }
    
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; 
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            return;
        }
        $role = $_SESSION['role'] ?? null;
        if ($role !== '1') {
            echo json_encode(["success" => false, "message" => "Chỉ admin mới có quyền xóa tài khoản"]);
            return;
        }
        $userModel = new User();
    
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
            return;
        }
    
        if ($userModel->deleteUser($user_id)) {
            session_destroy();
            echo json_encode(["success" => true, "message" => "Xóa tài khoản thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi xóa tài khoản"]);
        }
    }
    public function checkSession() {
        $authService = new AuthService();
        $sessionStatus = $authService->checkSession();
        echo json_encode($sessionStatus);
    }
}
?>
