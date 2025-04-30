<?php
require_once '../models/OrderModel.php';
require_once '../models/products.php';

class OrderController {
    private OrderModel $orderModel;
    private Product    $productModel;

    public function __construct() {
        $this->orderModel = new OrderModel();
        $this->productModel = new Product();
    }

    /* GET /orders  – Admin lấy toàn bộ */
    public function index() {
        session_start();
        if (($_SESSION['role'] ?? 0) != 1) { 
            http_response_code(403); 
            echo json_encode(["success"=>false, "message"=>"Không có quyền truy cập"]);
            exit; 
        }

        $orders = $this->orderModel->getAllOrders();
        foreach ($orders as &$o) {
            $o['items'] = $this->orderModel->getItemsByOrder($o['id']);
        }
        echo json_encode(["success"=>true,"data"=>$orders]);
    }

    /* GET /user/orders  – User lấy đơn của mình (không bao gồm pending) */
    public function getUserOrders() {
        session_start();
        $uid = $_SESSION['user_id'] ?? null;
        if (!$uid) {
            http_response_code(401);
            echo json_encode(["success"=>false,"message"=>"Bạn chưa đăng nhập"]);
            return;
        }

        $orders = $this->orderModel->getUserOrders($uid);
        foreach ($orders as &$o) {
            $o['items'] = $this->orderModel->getItemsByOrder($o['id']);
        }
        echo json_encode(["success"=>true,"data"=>$orders]);
    }

    /* POST /orders/{id}/status  {status} */
    public function updateStatus($id) {
        session_start();
        // Debug
        error_log("updateStatus called for order: $id");
        
        // Lấy trạng thái mới từ request
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $status = $data['status'] ?? null;
        
        // Nếu không có trong JSON, thử lấy từ POST
        if (!$status) {
            $status = $_POST['status'] ?? 'pending';
        }
        
        error_log("New status: $status");
        
        // Xác minh quyền admin hoặc chủ sở hữu đơn hàng
        $isAdmin = ($_SESSION['role'] ?? 0) == 1;
        $uid = $_SESSION['user_id'] ?? 0;
        $orderOwner = $this->orderModel->getOrderOwner($id);
        
        if (!$isAdmin && $uid != $orderOwner) {
            http_response_code(403);
            echo json_encode(["success"=>false, "message"=>"Không có quyền thay đổi"]);
            return;
        }
        
        // Cập nhật trạng thái
        $ok = $this->orderModel->updateStatus($id, $status);
        
        // Debug
        error_log("Update result: " . ($ok ? "success" : "failed"));
        
        echo json_encode(["success"=>$ok, "debug"=>["status"=>$status, "id"=>$id]]);
    }

    /* POST /orders/{id}/item/{itemId} { qty } (đổi số lượng) */
    public function updateItem($orderId,$itemId) {
        // Lấy dữ liệu từ cả JSON và POST
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);
        $qty = isset($data['quantity']) ? max(1, (int)$data['quantity']) : max(1, (int)($_POST['quantity'] ?? 1));
        
        $ok  = $this->orderModel->updateItemQty($itemId, $qty);
        echo json_encode(["success"=>$ok]);
    }

    /* DELETE /orders/{id}/item/{itemId} */
    public function deleteItem($orderId,$itemId) {
        $ok = $this->orderModel->deleteItem($itemId);
        echo json_encode(["success"=>$ok]);
    }

    /* --------- USER: Thanh toán giỏ hàng --------- */
    public function pay($orderId) {
        session_start();
        $uid = $_SESSION['user_id'] ?? null;
        if (!$uid) {
            http_response_code(401);
            echo json_encode(["success"=>false,"message"=>"Bạn chưa đăng nhập"]);
            return;
        }

        // Verify order belongs to user
        $orderOwner = $this->orderModel->getOrderOwner($orderId);
        if ($orderOwner !== $uid) {
            http_response_code(403);
            echo json_encode(["success"=>false,"message"=>"Đơn hàng không thuộc về bạn"]);
            return;
        }

        /* đổi status "processing" sau khi nhấn Thanh toán */
        $ok = $this->orderModel->updateStatus($orderId,'processing');
        echo json_encode(["success"=>$ok]);
    }
}