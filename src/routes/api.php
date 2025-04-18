<?php
require_once '../controllers/user.php';
require_once '../controllers/contact.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
// Lấy đường dẫn request và loại bỏ đường dẫn thư mục gốc

$basePath = '/src/public'; // Cập nhật base path cho phù hợp
$uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$uri = trim($uri, '/'); // Loại bỏ dấu '/'

$requestMethod = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();
$contactController = new ContactController();

if ($requestMethod == 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit();
}

switch (true) {
    // USER
    case $uri === 'login' && $requestMethod === 'POST':
        $userController->login();
        break;

    case $uri === 'register' && $requestMethod === 'POST':
        $userController->register();
        break;

    case $uri === 'users' && $requestMethod === 'GET':
        $userController->getUsers();
        break;

    // case $uri === 'users' && $requestMethod === 'POST':
    //     $userController->createUser();
    //     break;

    case $uri === 'profile' && $requestMethod === 'POST':
        $userController->editProfile();
        break;

    // CONTACT
    // GET /contacts hoặc /contacts?email=... hoac /contacts?id=...
    case $uri === 'contacts' && $requestMethod === 'GET':
        if (isset($_GET['email'])) {
            $contactController->getContactByEmail($_GET['email']);
        } elseif (isset($_GET['id'])) {
            $contactController->getContactById($_GET['id']);
        } else {
            $contactController->getAllContacts();
        }
        break;


    // POST /contacts
    case $uri === 'contacts' && $requestMethod === 'POST':
        $contactController->createContact();
        break;

    // DELETE /contacts?id=...
    case $uri === 'contacts' && $requestMethod === 'DELETE':
        if (isset($_GET['id'])) {
            $contactController->deleteContact($_GET['id']);
        } else {
            http_response_code(428);
            echo json_encode(["success" => false, "message" => "Cần thông tin id"]);
        }
        break;

    // POST /contacts/answer
    case $uri === 'contacts/answer' && $requestMethod === 'POST':
        $contactController->answerContact();
        break;

    // PUT /contacts
    case $uri === 'contacts' && $requestMethod === 'PUT':
        $contactController->changeStatus();
        break;

    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Route không tồn tại"]);
        break;
}
?>