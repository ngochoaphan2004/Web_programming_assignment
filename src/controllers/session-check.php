<?php
session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "authenticated" => true,
        "admin" => $_SESSION['role'] == 1,
        "user" => [
            "id" => $_SESSION['user_id'],
            "username" => $_SESSION['username'],
            "email" => $_SESSION['email'],
            "role" => $_SESSION['role']
        ]
    ]);
} else {
    echo json_encode([
        "authenticated" => false,
        "admin" => false
    ]);
}
