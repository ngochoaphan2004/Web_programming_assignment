<?php
require_once '../core/database.php';

class Intro {
    private $db;
    
    public function __construct() {
        $this->db =  Database::getInstance();
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
}