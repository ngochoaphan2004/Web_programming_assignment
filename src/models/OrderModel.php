<?php
require_once '../core/database.php';

class OrderModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /* lấy đơn “pending” hiện tại, nếu chưa có thì tạo mới */
    public function getOrCreatePendingOrder(int $userId): int {
        $stmt = $this->db->prepare("SELECT id FROM orders WHERE user_id = ? AND status = 'pending'");
        $stmt->execute([$userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) return (int)$row['id'];

        $this->db->prepare("INSERT INTO orders (user_id,total_price,status) VALUES (?,0,'pending')")
                 ->execute([$userId]);
        return (int)$this->db->lastInsertId();
    }

    /* lấy tất cả item trong giỏ */
    public function getCartItems(int $orderId): array {
        $sql = "SELECT oi.id, oi.product_id, p.name, p.image, oi.quantity, oi.price
                FROM order_items oi
                JOIN products p ON p.id = oi.product_id
                WHERE oi.order_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$orderId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /* thêm / tăng số lượng 1 sản phẩm */
    public function addItem(int $orderId, int $productId, int $quantity, float $unitPrice): void {
        $q = "INSERT INTO order_items (order_id,product_id,quantity,price)
              VALUES (?,?,?,?)
              ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
        $this->db->prepare($q)->execute([$orderId,$productId,$quantity,$unitPrice]);
        $this->recalcTotal($orderId);
    }

    /* đổi quantity */
    public function updateItemQty(int $itemId, int $quantity): bool {
        $ok = $this->db->prepare("UPDATE order_items SET quantity = ? WHERE id = ?")
                       ->execute([$quantity,$itemId]);
        if ($ok) {
            $orderId = $this->getOrderIdByItem($itemId);
            $this->recalcTotal($orderId);
        }
        return $ok;
    }

    /* xoá 1 item */
    public function deleteItem(int $itemId): bool {
        $orderId = $this->getOrderIdByItem($itemId);
        $ok = $this->db->prepare("DELETE FROM order_items WHERE id = ?")
                       ->execute([$itemId]);
        if ($ok) $this->recalcTotal($orderId);
        return $ok;
    }

    /* -------- helper -------- */
    private function getOrderIdByItem(int $itemId): int {
        $st = $this->db->prepare("SELECT order_id FROM order_items WHERE id = ?");
        $st->execute([$itemId]);
        return (int)($st->fetchColumn() ?? 0);
    }

    private function recalcTotal(int $orderId): void {
        $sum = $this->db->prepare("SELECT IFNULL(SUM(quantity*price),0) FROM order_items WHERE order_id = ?");
        $sum->execute([$orderId]);
        $total = $sum->fetchColumn();
        $this->db->prepare("UPDATE orders SET total_price = ? WHERE id = ?")
                 ->execute([$total,$orderId]);
    }
}
