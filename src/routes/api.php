<?php
require_once '../controllers/user.php';
require_once '../controllers/contact.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$basePath = '/BTL_LTW/src/public'; 
// $uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
// $basePath = dirname($_SERVER['SCRIPT_NAME']); 
$scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);
$basePath = rtrim(dirname($scriptName), '/');

$uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$uri = trim($uri, '/');

$requestMethod = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();
$contactController = new ContactController();

switch (true) {
    // USER
    case $uri === 'login' && $requestMethod === 'POST':
        $userController->login();
        break;

    case $uri === 'user/register' && $requestMethod === 'POST':
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
    case $uri === 'user/login' && $requestMethod === 'POST':
        $userController->login();
        break;
    case $uri === 'user/edit-profile' && $requestMethod === 'POST':
        $userController->editProfile();
        break;
    case $uri === 'user/session-check' && $requestMethod === 'GET':
        $userController->checkSession();
        break;
    case $uri === 'user/logout' && $requestMethod === 'POST':
        $userController->logout();
        break;
    case $uri === 'user' && $requestMethod === 'DELETE':
        $userController->deleteUser();
        break;
    case $uri === 'users/avatar' && $requestMethod === 'POST':
        $userController->uploadAvatar();
        break;
    case $uri === 'users/change-password' && $requestMethod === 'POST':
        $userController->changePassword();
        break;

    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Route không tồn tại"]);
        break;
}
?>