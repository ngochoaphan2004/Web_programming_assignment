<?php
require_once '../models/shop.php';
require_once '../core/auth.php';
require_once '../helpers/avatarHandle.php';
class ShopController
{
    private $auth;
    private $shop;

    public function __construct()
    {
        $this->auth = new AuthService();
        $this->shop = new Shop();
    }

    public function getShopInfo()
    {
        $info = $this->shop->getShopInfo();
        echo json_encode($info);
    }

    public function updateShopInfo()
    {
        // Authentication
        $sessionInfo = $this->auth->checkSession();
        if(!$sessionInfo['admin']){
            echo json_encode(["success" => false, "message" => "This api just user by admin"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $success = $this->shop->updateShopInfo($data);
        echo json_encode(["success" => $success]);
    }

    public function deleteAddress()
    {
        // Authentication
        $sessionInfo = $this->auth->checkSession();
        if(!$sessionInfo['admin']){
            echo json_encode(["success" => false, "message" => "This api just user by admin"]);
            return;
        }

        $data = json_decode(file_get_contents("php://input"), true);
        $success = $this->shop->deleteAddress($data);
        echo json_encode(["success" => $success]);
    }

    public function changeLogo()
    {
        // Authentication
        $sessionInfo = $this->auth->checkSession();
        if(!$sessionInfo['admin']){
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
            if (!empty($logoPath) && file_exists($logoPath)) {
                unlink($logoPath);
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
