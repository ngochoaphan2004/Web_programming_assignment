<?php
require_once '../models/user.php';

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
    
        // Kiểm tra xem dữ liệu có đến từ form không
        if (empty($_POST)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Không nhận được dữ liệu từ form"]);
            exit;
        }
        // $input = json_decode(file_get_contents("php://input"), true);
        // $name = trim($input["name"]);
        // $email = trim($input["email"]);
        // $password = trim($input["password"]);
        // $username = trim($input["username"]);
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $dob = trim($_POST['dob'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $address = trim($_POST['address' ] ?? '');
        // dob	date			Không	Không			Thay đổi Thay đổi	Xóa Xóa	
        // 8	created_at	timestamp			Không	current_timestamp()			Thay đổi Thay đổi	Xóa Xóa	
        // 9	phone	varchar(10)	utf8mb4_general_ci		Không	Không			Thay đổi Thay đổi	Xóa Xóa	
        // 10	address
        if (empty($name) || empty($email) || empty($password) || empty($username) || empty($dob) || empty($phone) || empty($address)) {
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }
        // $avatarPath = null;
        // if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] == 0) {
        //     $uploadDir = __DIR__ . '/../uploads/';
        //     if (!is_dir($uploadDir)) {
        //         mkdir($uploadDir, 0777, true);
        //     }

        //     $file = $_FILES['avatar'];
        //     $fileName = uniqid() . '-' . basename($file['name']);
        //     $targetPath = $uploadDir . $fileName;

        //     // Kiểm tra định dạng file hợp lệ
        //     $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        //     if (!in_array($file['type'], $allowedTypes)) {
        //         http_response_code(400);
        //         echo json_encode(['success' => false, 'message' => 'Chỉ cho phép tải lên ảnh PNG, JPG']);
        //         return;
        //     }

        //     // Kiểm tra kích thước file (giới hạn 5MB)
        //     if ($file['size'] > 5 * 1024 * 1024) {
        //         http_response_code(400);
        //         echo json_encode(['success' => false, 'message' => 'File quá lớn, tối đa 5MB']);
        //         return;
        //     }

        //     // Lưu file
        //     if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        //         $avatarPath = $targetPath;
        //     } else {
        //         http_response_code(500);
        //         echo json_encode(['success' => false, 'message' => 'Lỗi khi lưu file']);
        //         return;
        //     }
        // }
        // else 
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
    
        // Lấy dữ liệu từ request
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
    
        if (empty($email) || empty($password)) {
            echo json_encode(["success" => false, "message" => "Email và mật khẩu không được để trống"]);
            return;
        }
    
        // Kết nối database
    
        // Kiểm tra xem email có tồn tại không
        $userModel = new User();
        $user = $userModel->login($email, $password);
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Tài khoản không tồn tại"]);
            return;
        }
    
        // Kiểm tra mật khẩu
        if (!password_verify($password, $user['password'])) {
            echo json_encode(["success" => false, "message" => "Mật khẩu không chính xác"]);
            return;
        }
    
        // Đăng nhập thành công → Tạo session (hoặc JWT token)
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
    
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
    
        // 🔹 Giả sử user_id được lưu trong session (hoặc lấy từ token)
        session_start();
        $user_id = $_SESSION['user_id'] ?? null; // Hoặc lấy từ JWT Token
        
        if (!$user_id) {
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            return;
        }
    
        // Kết nối database
        $userModel = new User();
    
        // Lấy dữ liệu cũ từ database
        $user = $userModel->getUserById($user_id);
    
        if (!$user) {
            echo json_encode(["success" => false, "message" => "Người dùng không tồn tại"]);
            return;
        }
    
        // Nếu dữ liệu không được gửi lên, giữ nguyên giá trị cũ
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
    
        // 🔹 Cập nhật thông tin người dùng (KHÔNG cập nhật user_id)
        $stmt = $userModel->updateProfile($user_id, $name, $username, $dob, $phone, $address);
    
        if ($stmt) {
            echo json_encode(["success" => true, "message" => "Cập nhật hồ sơ thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi cập nhật hồ sơ"]);
        }
    }
}
?>
