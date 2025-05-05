<?php
require_once '../core/database.php';

class OrderModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /* lấy đơn "pending" hiện tại, nếu chưa có thì tạo mới */
    // public function getOrCreatePendingOrder(int $userId): int {
    //     $stmt = $this->db->prepare("SELECT id FROM orders WHERE user_id = ? AND status = 'pending'");
    //     $stmt->execute([$userId]);
    //     $row = $stmt->fetch(PDO::FETCH_ASSOC);
    //     if ($row) return (int)$row['id'];

    //     $this->db->prepare("INSERT INTO orders (user_id,total_price,status) VALUES (?,0,'pending')")
    //              ->execute([$userId]);
    //     return (int)$this->db->lastInsertId();
    // }




    /* OrderModel.php */

    public function findPendingOrder(int $userId): ?int {
        $st = $this->db->prepare(
            "SELECT id FROM orders WHERE user_id = ? AND status = 'pending' LIMIT 1"
        );
        $st->execute([$userId]);
        $id = $st->fetchColumn();
        return $id ? (int)$id : null;
    }

    public function createPending(int $userId): int {
        $this->db->prepare(
            "INSERT INTO orders (user_id,total_price,status) VALUES (?,0,'pending')"
        )->execute([$userId]);
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
    
    /* Lấy đơn hàng của user (không bao gồm pending) */
    public function getUserOrders(int $userId): array {
        $stmt = $this->db->prepare("
            SELECT id, user_id, total_price, status, created_at, updated_at 
            FROM orders 
            WHERE user_id = ? AND status != 'pending' 
            ORDER BY created_at DESC
        ");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /* Kiểm tra người sở hữu đơn hàng */
    public function getOrderOwner(int $orderId): ?int {
        $stmt = $this->db->prepare("SELECT user_id FROM orders WHERE id = ?");
        $stmt->execute([$orderId]);
        return (int)($stmt->fetchColumn() ?? 0);
    }

    /* thêm / tăng số lượng 1 sản phẩm */
    public function addItem(int $orderId, int $pid, int $qty, float $price): void
    {
        $sql = "INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?,?,?,?)
                ON DUPLICATE KEY UPDATE
                    quantity = quantity + VALUES(quantity),
                    price    = VALUES(price)";   // luôn ghi đơn giá mới
        $this->db->prepare($sql)->execute([$orderId,$pid,$qty,$price]);

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

    public function getAllOrders(): array {
        $sql = "SELECT o.*, u.name, u.address, u.phone
                FROM orders o
                JOIN users u ON u.id = o.user_id
                ORDER BY o.created_at DESC";
        return $this->db->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getItemsByOrder(int $orderId): array {
        $sql = "SELECT oi.id, oi.product_id, p.name, p.image, oi.quantity, oi.price
                FROM order_items oi
                JOIN products p ON p.id = oi.product_id
                WHERE oi.order_id = ?";
        $st = $this->db->prepare($sql);
        $st->execute([$orderId]);
        return $st->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /* đổi trạng thái */
    public function updateStatus(int $orderId, string $status): bool {
        // Debug
        error_log("OrderModel::updateStatus - orderId: $orderId, status: $status");
        
        // Xác nhận đơn hàng tồn tại trước khi cập nhật
        $checkStmt = $this->db->prepare("SELECT id FROM orders WHERE id = ?");
        $checkStmt->execute([$orderId]);
        if (!$checkStmt->fetch()) {
            error_log("OrderModel::updateStatus - Đơn hàng không tồn tại: $orderId");
            return false;
        }
        
        // Cập nhật trạng thái và thêm thời gian cập nhật
        $stmt = $this->db->prepare("UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?");
        $result = $stmt->execute([$status, $orderId]);
        
        // Kiểm tra số dòng được cập nhật
        $rowCount = $stmt->rowCount();
        error_log("OrderModel::updateStatus - Kết quả: " . ($result ? "true" : "false") . ", Số dòng cập nhật: $rowCount");
        
        return $result && $rowCount > 0;
    }

    /* kiểm tra & trừ tồn kho – chạy trong transaction */
    public function validateAndDecreaseStock(int $orderId): array
    {
        $this->db->beginTransaction();

        /* gộp quantity theo product_id */
        $sql = "SELECT oi.product_id, SUM(oi.quantity) AS qty,
                    p.stock, p.name
                FROM order_items oi
                JOIN products p ON p.id = oi.product_id
                WHERE oi.order_id = ?
                GROUP BY oi.product_id";
        $st = $this->db->prepare($sql);
        $st->execute([$orderId]);
        $rows = $st->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $r) {
            if ($r['qty'] > $r['stock']) {
                $this->db->rollBack();
                return [
                    'ok'      => false,
                    'product' => $r['name'],
                    'remain'  => $r['stock']
                ];
            }
        }

        /* đủ hàng → trừ kho */
        $upd = $this->db->prepare(
            "UPDATE products SET stock = stock - :qty WHERE id = :pid"
        );
        foreach ($rows as $r) {
            $upd->execute([':qty' => $r['qty'], ':pid' => $r['product_id']]);
        }

        $this->db->commit();
        return ['ok' => true];
    }


}