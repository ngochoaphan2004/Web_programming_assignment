<?php
require_once '../models/shop.php';
require_once '../core/auth.php';
require_once '../helpers/avatarHandle.php';
class ShopController
{
    private $shop;

    public function __construct()
    {
        $this->shop = new Shop();
    }

    private function checkSess()
    {
        session_start();

        if (isset($_SESSION['user_id'])) {
            return [
                "authenticated" => true,
                "admin" => $_SESSION['role'] == 1,
                "user" => [
                    "id" => $_SESSION['user_id'],
                    "name" => $_SESSION['name'],
                    "email" => $_SESSION['email'],
                    "role" => $_SESSION['role']
                ]
            ];
        } else {
            return [
                "authenticated" => false,
                "admin" => false
            ];
        }
    }

    public function getShopInfo()
    {
        $info = $this->shop->getShopInfo();
        echo json_encode($info);
    }

    public function updateShopInfo()
    {
        // Authentication
        $sessionInfo = $this->checkSess();
        if ($sessionInfo['admin'] === false) {
            echo json_encode(["success" => false, "message" => "This api just user by admin"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $success = $this->shop->updateShopInfo($data);
        echo json_encode(["success" => true, "data" => $success]);
    }

    public function deleteAddress()
    {
        // Authentication
        $sessionInfo = $this->checkSess();
        if (!$sessionInfo['admin']) {
            echo json_encode(["success" => false, "message" => "This api just user by admin"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $success = $this->shop->deleteAddress($data);
        echo json_encode(["success" => true, "data" => $success]);
    }

    public function changeLogo()
    {
        // Authentication
        $sessionInfo = $this->checkSess();
        if (!$sessionInfo['admin']) {
            echo json_encode(["success" => false, "message" => "This api just user by admin"]);
            return;
        }

        $info = $this->shop->getShopInfo();

        $logoPath = $info['logo'];
        if (isset($_FILES['logo']) && $_FILES['logo']['error'] == 0) {
            $logoUpload = handleAvatarUpload($_FILES['logo']);
            if (!$logoUpload['success']) {
                echo json_encode(['success' => false, 'message' => $logoUpload['message']]);
                return;
            }

            $path = '../..'.$logoPath;
            if (!empty($logoPath) && file_exists($path)) {
                unlink($path);
            }

            $logoPath = $logoUpload['path'];
        }
        $stmt = $this->shop->updateLogo($logoPath);
        if ($stmt) {
            echo json_encode(["success" => true, "message" => "Logo updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Logo update failed"]);
        }
    }
}
