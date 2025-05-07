<?php
require_once '../controllers/user.php';
require_once '../controllers/contact.php';
require_once '../controllers/products.php';
require_once '../controllers/CartController.php';
require_once '../controllers/OrderController.php';
require_once '../controllers/shop.php';
<<<<<<< HEAD
require_once '../controllers/banner.php';
require_once '../controllers/intro.php';
require_once '../controllers/question.php';

=======

// Cho phép các phương thức và header phù hợp
// $basePath = '/BTL_LTW/src/public'; 
// $basePath = '/api';
// $uri = str_replace($basePath, '', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
>>>>>>> main
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

$cartController = new CartController();
$orderController = new OrderController();
$shopController = new ShopController();
<<<<<<< HEAD
$bannerController = new BannerController();
$introController = new IntroController();
$questionController = new QuestionController();
=======

>>>>>>> main

if ($requestMethod == 'OPTIONS') {
    header("HTTP/1.1 204 No Content");
    exit();
}

switch (true) {
    // USER
    case $uri === 'user/login' && $requestMethod === 'POST':
        $userController->login();
        break;
    case $uri === 'user/now'  && $requestMethod === 'GET':
        $userController->getUser();
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
    case $uri === 'user/avatar' && $requestMethod === 'POST':
        $userController->changeAvatar();
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
    // lấy tất cả sản phẩm
    case $uri === 'products' && $requestMethod === 'GET':
        $productController->getAllProducts();
        break;
    // lấy sản phẩm theo id
    case preg_match('/^products\/(\d+)$/', $uri, $matches) && $requestMethod === 'GET':
        $productController->getProductById($matches[1]);
        break;
    // lấy sản phẩm được mua nhiều nhất
    case $uri === 'products/popular' && $requestMethod === 'GET':
        $productController->getPopularProducts();
        break;
    // lấy sản phẩm mới nhất
    case $uri === 'products/newest' && $requestMethod === 'GET':
        $productController->getNewestProducts();
        break;
    // Tạo sản phẩm mới
    case $uri === 'products' && $requestMethod === 'POST':
        $productController->createProduct();
        break;
    // Cập nhật sản phẩm
    case preg_match('/^products\/(\d+)$/', $uri, $matches) && $requestMethod === 'POST':
        $productController->updateProduct($matches[1]);
        break;
    // Xoá sản phẩm
    case preg_match('/^products\/(\d+)$/', $uri, $matches) && $requestMethod === 'DELETE':
        $productController->deleteProduct($matches[1]);
        break;
    // Lấy sản phẩm theo danh mục
    case preg_match('/^products\/category\/(.+)$/', $uri, $matches) && $requestMethod === 'GET':
        $productController->getProductsByCategory($matches[1]);
        break;
    // Lấy sản phẩm theo danh mục với phân trang
    case preg_match('/^products\/category\/(.+)\/paginate$/', $uri, $matches) && $requestMethod === 'GET':
        $productController->getProductsByCategoryPaginated($matches[1]);
        break;
    // Lấy toàn bộ sản phẩm – lần này không phân trang   
    case $uri === 'products/grouped' && $requestMethod === 'GET':
        $productController->getAllProductsGrouped();
        break;
        
    /* lấy giỏ */
    case $uri === 'cart' && $requestMethod === 'GET':
        $cartController->getCart();
        break;
    
    // BANNER
    case $uri === 'banner' && $requestMethod === 'GET':
        $bannerController->getBanner();
        break;
    case $uri === 'banner' && $requestMethod === 'POST':
        $bannerController->uploadBanner();
        break;
    case $uri === 'banner/update' && $requestMethod === 'POST':
        $bannerController->editBanner();
        break;
    case $uri === 'banner' && $requestMethod === 'DELETE':
        $bannerController->deleteBanner();
        break;

    /* thêm sp vào giỏ */
    case $uri === 'cart/add' && $requestMethod === 'POST':
        $cartController->add();
        break;

    /* cập nhật số lượng */
    case preg_match('/^cart\\/item\\/(\\d+)$/',$uri,$m) && $requestMethod === 'POST':
        $cartController->updateItem($m[1]);
        break;

    /* xoá item */
    case preg_match('/^cart\\/item\\/(\\d+)$/',$uri,$m) && $requestMethod === 'DELETE':
        $cartController->deleteItem($m[1]);
        break;

    /* TÌM KIẾM – theo kw, cat[], price[]=min-max */
    case $uri === 'products/search' && $requestMethod === 'GET':
        $productController->search();
        break;

    /* ============ ADMIN ============ */
    case $uri === 'orders' && $requestMethod === 'GET':
        $orderController->index();            // danh sách
        break;

    case preg_match('/^orders\\/(\\d+)\\/status$/',$uri,$m) && $requestMethod === 'POST':
        $orderController->updateStatus($m[1]);
        break;

    case preg_match('/^orders\\/(\\d+)\\/item\\/(\\d+)$/',$uri,$m) && $requestMethod === 'POST':
        $orderController->updateItem($m[1],$m[2]);
        break;

    case preg_match('/^orders\\/(\\d+)\\/item\\/(\\d+)$/',$uri,$m) && $requestMethod === 'DELETE':
        $orderController->deleteItem($m[1],$m[2]);
        break;

    /* ============ USER ============ */
    case preg_match('/^orders\\/(\\d+)\\/pay$/',$uri,$m) && $requestMethod === 'POST':
        $orderController->pay($m[1]);
        break;
    // SHOP INFOMATION
    
    case $uri === 'shop/info' && $requestMethod === 'GET':
        $shopController->getShopInfo();
        break;
    case $uri === 'shop/info/update' && $requestMethod === 'POST':
        $shopController->updateShopInfo();
        break;
    case $uri === 'shop/info/logo' && $requestMethod === 'POST':
        $shopController->changeLogo();
        break;

    // lấy sản phẩm mà user đó order
    case $uri === 'user/orders' && $requestMethod === 'GET':
        $orderController->getUserOrders();
        break;
<<<<<<< HEAD
            // SHOP INFOMATION
            case $uri === 'shop/info' && $requestMethod === 'GET':
                $shopController->getShopInfo();
                break;
            case $uri === 'shop/info/update' && $requestMethod === 'POST':
                $shopController->updateShopInfo();
                break;
            case $uri === 'shop/info/logo' && $requestMethod === 'POST':
                $shopController->changeLogo();
                break;
    // INTRO
    case $uri === 'introduce' && $requestMethod === 'GET':
        $introController->getIntroduceData();
        break;
    // Add new content
    case $uri === 'introduce' && $requestMethod === 'POST':
        // case $uri === 'introduce/commitment' && $requestMethod === 'POST':
        // case $uri === 'introduce/thank' && $requestMethod === 'POST':
        //     $section = $matches[1];
            $introController->addContent();
            break;
    
        // Update content
        case preg_match('#^introduce/(intro|commitment|thank)/(\d+)$#', $uri, $matches) && $requestMethod === 'PUT':
            $section = $matches[1];
            $order_index = $matches[2];
            $introController->updateContent($section, $order_index);
            break;
    
        // Delete content
        case preg_match('#^introduce/(intro|commitment|thank)/(\d+)$#', $uri, $matches) && $requestMethod === 'DELETE':
            $section = $matches[1];
            $order_index = $matches[2];
            $introController->deleteContent($section, $order_index);
            break;
    

    // QUESTION
    case $uri === 'question' && $requestMethod === 'GET':
        $questionController->getQuestion();
        break;
    case $uri === 'question/create' && $requestMethod === 'POST':
        $questionController->createQuestion();
        break;
    case $uri === 'answer/create' && $requestMethod === 'POST':
        $questionController->createAnswer();
        break;
    // Lấy câu hỏi của người dùng
    case $uri === 'user/questions' && $requestMethod === 'GET':
        $questionController->getUserQuestions();
        break;

    // Lấy câu trả lời của người dùng
    case $uri === 'user/answers' && $requestMethod === 'GET':
        $questionController->getUserAnswers();
        break;

    // Cập nhật câu hỏi
    case preg_match('/^question\/(\d+)$/', $uri, $matches) && $requestMethod === 'PUT':
        $questionController->updateQuestion();
        break;

    // Xóa câu hỏi
    case preg_match('/^question\/(\d+)$/', $uri, $matches) && $requestMethod === 'DELETE':
        $questionController->deleteQuestion();
        break;

    // Cập nhật câu trả lời
    case preg_match('/^answer\/(\d+)$/', $uri, $matches) && $requestMethod === 'PUT':
        $questionController->updateAnswer();
        break;

    // Xóa câu trả lời
    case preg_match('/^answer\/(\d+)$/', $uri, $matches) && $requestMethod === 'DELETE':
        $questionController->deleteAnswer();
        break;
=======
        
>>>>>>> main
    // DEFAULT
    default:
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Route không tồn tại " . $uri]);
        break;
}
