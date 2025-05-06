<?php
require_once '../core/database.php';

class Banner {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }
    public function getAllBanner() {
        $baseURL = $_ENV['BASE_URL'];
        
        $stmt = $this->db->query("SELECT image FROM banners");
        $banners = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        // Nối đường dẫn đầy đủ vào ảnh
        foreach ($banners as &$banner) {
            $banner['image'] = $baseURL . $banner['image'];
        }
    
        return $banners;
    }
    public function uploadBanner($file) {
        $targetDir = __DIR__ . '/../public/uploads/';
        $fileName = uniqid() . '-' . basename($file['name']);
        $targetFile = $targetDir . $fileName;
        $imagePath = '/api/public/uploads/' . $fileName; // Đường dẫn để FE sử dụng
    
        // Kiểm tra và di chuyển file
        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            $stmt = $this->db->prepare("INSERT INTO banners (image) VALUES (:image)");
            $stmt->execute(['image' => $imagePath]);
            return ['success' => true, 'image' => $imagePath];
        } else {
            return ['success' => false, 'message' => 'Upload failed'];
        }
    }
}