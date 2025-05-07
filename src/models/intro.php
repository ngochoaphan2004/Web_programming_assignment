<?php
require_once '../core/database.php';

class Intro {
    private $db;
    
    public function __construct() {
        $this->db =  Database::getInstance();
    }

    public function getSectionByIndex($order_index, $section) {
        $stmt = $this->db->prepare("SELECT * FROM introduce_contents WHERE order_index = :order_index AND section = :section");
        $stmt->execute([':order_index' => $order_index, ':section' => $section]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getIntroContent() {
        $stmt = $this->db->prepare("SELECT content , order_index FROM introduce_contents WHERE section = 'intro' ORDER BY order_index ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy cam kết từ bảng cam kết
    public function getCommitments() {
        $stmt = $this->db->prepare("SELECT content , order_index FROM introduce_contents WHERE section = 'commitment' ORDER BY order_index ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy nội dung cảm ơn từ bảng cảm ơn
    public function getThanks() {
        $stmt = $this->db->prepare("SELECT content , order_index FROM introduce_contents WHERE section = 'thank' ORDER BY order_index ASC");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function addContent($section, $content, $order_index) {
        try {
            $stmt = $this->db->prepare("INSERT INTO introduce_contents (section, content, order_index) VALUES (:section, :content, :order_index)");
            $stmt->execute([
                ':section' => $section,
                ':content' => $content,
                ':order_index' => $order_index
            ]);
            return ['message' => 'Thêm mới thành công!'];
        } catch (PDOException $e) {
            throw new Exception('Lỗi khi thêm mới: ' . $e->getMessage());
        }
    }

    // Update content
    public function updateContent($section, $order_index, $content, $new_order_index) {
        try {
            $stmt = $this->db->prepare("UPDATE introduce_contents SET content = :content, order_index = :new_order_index WHERE section = :section AND order_index = :order_index");
            $stmt->execute([
                ':content' => $content,
                ':new_order_index' => $new_order_index,
                ':section' => $section,
                ':order_index' => $order_index
            ]);
            return ['message' => 'Cập nhật thành công!'];
        } catch (PDOException $e) {
            throw new Exception('Lỗi khi cập nhật: ' . $e->getMessage());
        }
    }

    // Delete content
    public function deleteContent($section, $order_index) {
        try {
            $stmt = $this->db->prepare("DELETE FROM introduce_contents WHERE section = :section AND order_index = :order_index");
            $stmt->execute([
                ':section' => $section,
                ':order_index' => $order_index
            ]);
            return ['message' => 'Xóa thành công!'];
        } catch (PDOException $e) {
            throw new Exception('Lỗi khi xóa: ' . $e->getMessage());
        }
    }
}