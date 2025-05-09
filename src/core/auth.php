<?php
require_once "../models/user.php";

class AuthService {

    public function checkSession() {
        session_start();
        $shop = new Shop();
        $shopInfo = $shop->getShopInfo();

        if (isset($_SESSION['user_id'])) {

            $userAcc = new User();
            $user = $userAcc->getUserById($_SESSION['user_id']);
            
            return [
                "authenticated" => true,
                "admin" => $_SESSION['role'] == 1,
                "user" => [
                    "id" => $_SESSION['user_id'],
                    "name" => $_SESSION['name'],
                    "email" => $_SESSION['email'],
                    "role" => $_SESSION['role'],
                    "avatar" => $user['avatar'],
                    "phone" => $user['phone']
                ],
                "logo" => $shopInfo['logo']
            ];
        } else {
            return [
                "authenticated" => false,
                "admin" => false,
                "logo" => $shopInfo['logo']
            ];
        }
    }
}

?>
