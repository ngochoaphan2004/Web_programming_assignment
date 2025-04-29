<?php
require_once '../controllers/user.php';
require_once '../controllers/contact.php';
require_once '../controllers/products.php';

// Cho phép các phương thức và header phù hợp
// $basePath = '/BTL_LTW/src/public'; 
// $basePath = '/api';
// $uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$basePath = dirname($_SERVER['SCRIPT_NAME']); 
$scriptName = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);
$basePath = rtrim(dirname($scriptName), '/');
$uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$uri = trim($uri, '/');
$uri = str_replace("api", '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$uri = trim($uri, '/');
$requestMethod = $_SERVER['REQUEST_METHOD'];
$userController = new UserController();
$contactController = new ContactController();
$productController = new ProductController();



if ($requestMethod == 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit();
}

switch (true) {
    // USER
    case $uri === 'user/login' && $requestMethod === 'POST':
        $userController->login();
        break;

    case $uri === 'user/register' && $requestMethod === 'POST':
        $userController->register();
        break;

    case $uri === 'users' && $requestMethod === 'GET':
        $userController->getUsers();
        break;

    case $uri === 'user/profile' && $requestMethod === 'POST':
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

    // CONTACT
    case $uri === 'contacts' && $requestMethod === 'GET':
        if (isset($_GET['email'])) {
            $contactController->getContactByEmail($_GET['email']);
        } elseif (isset($_GET['id'])) {
            $contactController->getContactById($_GET['id']);
        } else {
            $contactController->getAllContacts();
        }
        break;
    case $uri === 'contacts' && $requestMethod === 'POST':
        $contactController->createContact();
        break;
    case $uri === 'contacts' && $requestMethod === 'DELETE':
        if (isset($_GET['id'])) {
            $contactController->deleteContact($_GET['id']);
        } else {
            http_response_code(428);
            echo json_encode(["success" => false, "message" => "Cần thông tin id"]);
        }
        break;
    case $uri === 'contacts/answer' && $requestMethod === 'POST':
        $contactController->answerContact();
    case $uri === 'user/edit-profile' && $requestMethod === 'POST':
        $userController->editProfile();
        break;
    case $uri === 'contacts' && $requestMethod === 'PUT':
        $contactController->changeStatus();
        break;

    // PRODUCTS

    case $uri === 'products' && $requestMethod === 'GET':
        $productController->getAllProducts();
        break;

    case preg_match('/^products\/(\d+)$/', $uri, $matches) && $requestMethod === 'GET':
        $productController->getProductById($matches[1]);
        break;

    case $uri === 'products/popular' && $requestMethod === 'GET':
        $productController->getPopularProducts();
        break;
        
    case $uri === 'products/newest' && $requestMethod === 'GET':
        $productController->getNewestProducts();
        break;
        
    case $uri === 'products' && $requestMethod === 'POST':
        $productController->createProduct();
        break;

    case preg_match('/^products\/(\d+)$/', $uri, $matches) && $requestMethod === 'POST':
        $productController->updateProduct($matches[1]);
        break;

    case preg_match('/^products\/(\d+)$/', $uri, $matches) && $requestMethod === 'DELETE':
        $productController->deleteProduct($matches[1]);
        break;

    case preg_match('/^products\/category\/(.+)$/', $uri, $matches) && $requestMethod === 'GET':
        $productController->getProductsByCategory($matches[1]);
        break;
    
    case preg_match('/^products\/category\/(.+)\/paginate$/', $uri, $matches) && $requestMethod === 'GET':
        $productController->getProductsByCategoryPaginated($matches[1]);
        break;
    
    case $uri === 'products/grouped' && $requestMethod === 'GET':
        $productController->getAllProductsGrouped();
        break;
        
    // DEFAULT
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Route không tồn tại"]);
        break;
}