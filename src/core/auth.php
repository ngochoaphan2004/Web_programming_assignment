<?php
// core/AuthService.php
class AuthService {

    public function checkSession() {
        session_start();

        if (isset($_SESSION['user_id'])) {
            return [
                "authenticated" => true,
                "admin" => $_SESSION['role'] == 1,
                "user" => [
                    "id" => $_SESSION['user_id'],
                    "username" => $_SESSION['username'],
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
}

?>
