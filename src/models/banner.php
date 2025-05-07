<?php
require_once '../core/database.php';

class Banner {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }
    public function getAllBanner() {
        $baseURL = $_ENV['BASE_URL'];
        
        $stmt = $this->db->query("SELECT image, id FROM banners");
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
            $stmt->execute(['image' => $fileName]);
            return ['success' => true, 'image' => $imagePath];
        } else {
            return ['success' => false, 'message' => 'Upload failed'];
        }
    }
    public function updateBanner($id, $file) {
        // Kiểm tra banner có tồn tại không
        $stmt = $this->db->prepare("SELECT image FROM banners WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $banner = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$banner) {
            return ['success' => false, 'message' => 'Banner not found'];
        }

        // Xóa file ảnh cũ nếu tồn tại
        $oldImagePath = __DIR__ . '/../public' . $banner['image'];
        if (file_exists($oldImagePath)) {
            unlink($oldImagePath);
        }

        // Xử lý file ảnh mới
        $targetDir = __DIR__ . '/../public/uploads/';
        $fileName = uniqid() . '-' . basename($file['name']);
        $targetFile = $targetDir . $fileName;
        $imagePath = '/api/public/uploads/' . $fileName;

        // Kiểm tra và di chuyển file
        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            $stmt = $this->db->prepare("UPDATE banners SET image = :image WHERE id = :id");
            $stmt->execute(['image' => $fileName, 'id' => $id]);
            return ['success' => true, 'image' => $imagePath, 'message' => 'Banner updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to upload new image'];
        }
    }

    public function deleteBanner($id) {
        // Kiểm tra banner có tồn tại không
        $stmt = $this->db->prepare("SELECT image FROM banners WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $banner = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$banner) {
            return ['success' => false, 'message' => 'Banner not found'];
        }

        // Xóa file ảnh khỏi server
        $imagePath = __DIR__ . '/../public' . $banner['image'];
        if (file_exists($imagePath)) {
            unlink($imagePath);
        }

        // Xóa banner khỏi cơ sở dữ liệu
        $stmt = $this->db->prepare("DELETE FROM banners WHERE id = :id");
        $stmt->execute(['id' => $id]);

        return ['success' => true, 'message' => 'Banner deleted successfully'];
    }
}