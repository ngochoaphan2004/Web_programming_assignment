<?php
require_once '../models/user.php';

class UserController {
    public function getUsers() {
        $userModel = new User();
        $users = $userModel->getAllUsers();
        echo json_encode(["success" => true, "data" => $users], JSON_PRETTY_PRINT);
    }

    public function createUser() {
        $input = json_decode(file_get_contents("php://input"), true);
        if (!isset($input["name"]) || !isset($input["email"])) {
            echo json_encode(["success" => false, "message" => "Thiếu dữ liệu"]);
            return;
        }

        $userModel = new User();
        if ($userModel->createUser($input["name"], $input["email"])) {
            echo json_encode(["success" => true, "message" => "Thêm user thành công"]);
        } else {
            echo json_encode(["success" => false, "message" => "Lỗi thêm user"]);
        }
    }
}
?>
