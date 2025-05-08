<?php
require_once "../models/user.php";
require_once "../models/shop.php";

class AuthService {

    public function checkSession() {
        session_start();

        if (isset($_SESSION['user_id'])) {

            $userAcc = new User();
            $user = $userAcc->getUserById($_SESSION['user_id']);
            $shop = new Shop();
            $shopInfo = $shop->getShopInfo();
            
            return [
                "authenticated" => true,
                "admin" => $_SESSION['role'] == 1,
                "user" => [
                    "id" => $_SESSION['user_id'],
                    "name" => $_SESSION['name'],
                    "email" => $_SESSION['email'],
                    "role" => $_SESSION['role'],
                    "avatar" => $user['avatar']
                ],
                "logo" => $shopInfo['logo']
            ];
        } else {
            return [
                "authenticated" => false,
                "admin" => false
            ];
        }
    }
}

?>
