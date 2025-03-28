<?php
require_once '../controllers/user.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Lấy đường dẫn request và loại bỏ đường dẫn thư mục gốc
$basePath = '/BTL_LTW/src/public'; // Cập nhật base path cho phù hợp
$uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$uri = trim($uri, '/'); // Loại bỏ dấu '/'

$requestMethod = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();

switch (true) {
    case $uri === 'users' && $requestMethod === 'GET':
        $userController->getUsers();
        break;

    case $uri === 'users' && $requestMethod === 'POST':
        $userController->createUser();
        break;

    case $uri === 'register' && $requestMethod === 'POST':
        $userController->register();
        break;

    case $uri === 'login' && $requestMethod === 'POST':
        $userController->login();
        break;
    case $uri === 'profile' && $requestMethod === 'POST':
        $userController->editProfile();
        break;
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Route không tồn tại"]);
        break;
}
?>
