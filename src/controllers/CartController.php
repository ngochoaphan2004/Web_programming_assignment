<?php
require_once '../models/OrderModel.php';
require_once '../models/products.php';

class CartController {
    private OrderModel $orderModel;
    private Product   $productModel;

    public function __construct() {
        $this->orderModel   = new OrderModel();
        $this->productModel = new Product();
    }

    /* GET /cart  – lấy giỏ của user hiện tại */
    // public function getCart() {
    //     session_start();
    //     $uid = $_SESSION['user_id'] ?? null;
    //     if (!$uid) {
    //         http_response_code(401);
    //         echo json_encode(["success"=>false,"message"=>"Not logged in"]);
    //         return;
    //     }
    //     $orderId = $this->orderModel->getOrCreatePendingOrder($uid);
    //     /* KHÔNG có đơn pending → giỏ rỗng */
    //     if (!$orderId) {
    //         echo json_encode([
    //             "success" => true,
    //             "data"    => ["order_id" => null, "items" => []]
    //         ]);
    //         return;
    //     }

    //     $items   = $this->orderModel->getCartItems($orderId);
    //     echo json_encode(["success"=>true,"data"=>["order_id"=>$orderId,"items"=>$items]]);
    // }

    // /* POST /cart/add  { product_id, quantity } */
    // public function add() {
    //     session_start();
    //     $uid = $_SESSION['user_id'] ?? null;
        
    //     // Debug session
    //     error_log("Session user_id: " . ($uid ? $uid : "not found"));
        
    //     if (!$uid) { 
    //         http_response_code(401); 
    //         echo json_encode(["success" => false, "message" => "User not logged in"]); 
    //         return; 
    //     }
    
    //     // Get JSON input data
    //     $json = file_get_contents('php://input');
    //     $data = json_decode($json, true);
        
    //     // Debug received data
    //     error_log("Received data: " . $json);
        
    //     $pid = (int)($data['product_id'] ?? 0);
    //     $qty = max(1, (int)($data['quantity'] ?? 1));
        
    //     // Fallback to POST if JSON is empty (in case form data is used)
    //     if ($pid === 0) {
    //         $pid = (int)($_POST['product_id'] ?? 0);
    //         $qty = max(1, (int)($_POST['quantity'] ?? 1));
    //     }
        
    //     // Debug product ID
    //     error_log("Processing product ID: $pid with quantity: $qty");
    
    //     $prod = $this->productModel->getProductById($pid);
    //     if (!$prod) { 
    //         http_response_code(400); 
    //         echo json_encode(["success" => false, "message" => "Product not found"]); 
    //         return; 
    //     }
    
    //     $orderId = $this->orderModel->getOrCreatePendingOrder($uid);
    //     $this->orderModel->addItem($orderId, $pid, $qty, $prod['price']);
    //     echo json_encode(["success" => true]);
    // }





    /* ============ 1. GET /cart ============ */
    public function getCart() {
        session_start();
        $uid = $_SESSION['user_id'] ?? null;
        if (!$uid) { http_response_code(401); echo json_encode(["success"=>false]); return; }

        /* CHỈ TÌM đơn pending, KHÔNG tạo mới */
        $orderId = $this->orderModel->findPendingOrder($uid);

        if (!$orderId) {
            echo json_encode([
                "success" => true,
                "data"    => ["order_id" => null, "items" => []]
            ]);
            return;
        }

        $items = $this->orderModel->getCartItems($orderId);
        echo json_encode(["success"=>true,"data"=>["order_id"=>$orderId,"items"=>$items]]);
    }

    /* ============ 2. POST /cart/add ============ */
    public function add() {
        session_start();
        $uid = $_SESSION['user_id'] ?? null;
        if (!$uid) { http_response_code(401); echo json_encode(["success"=>false]); return; }

        /* nhận product_id & quantity (như cũ) */
        $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $pid  = (int)($data['product_id'] ?? 0);
        $qty  = max(1,(int)($data['quantity']  ?? 1));

        $prod = $this->productModel->getProductById($pid);
        if (!$prod) { http_response_code(400); echo json_encode(["success"=>false]); return; }

        /* tìm hoặc tạo đơn pending */
        $orderId = $this->orderModel->findPendingOrder($uid);
        if (!$orderId) $orderId = $this->orderModel->createPending($uid);

        $this->orderModel->addItem($orderId, $pid, $qty, $prod['price']);
        echo json_encode(["success"=>true]);
    }










    /* POST /cart/item/{id}  { quantity } */
    public function updateItem($itemId) {
        /* nhận JSON hoặc form-data */
        $data = json_decode(file_get_contents('php://input'), true) ?: $_POST;
        $qty  = max(1, (int)($data['quantity'] ?? 1));     // <-- lấy đúng

        $ok   = $this->orderModel->updateItemQty($itemId, $qty);
        echo json_encode(["success" => $ok]);
    }


    /* DELETE /cart/item/{id} */
    public function deleteItem($itemId) {
        $ok = $this->orderModel->deleteItem($itemId);
        echo json_encode(["success"=>$ok]);
    }
}
