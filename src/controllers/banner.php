<?php
require_once '../models/banner.php';

class BannerController {
    private $bannerModel;

    public function __construct() {
        $this->bannerModel = new Banner(); 
    }

    public function getBanner() {
        $banner = $this->bannerModel->getAllBanner();
        echo json_encode($banner);
    }

    public function uploadBanner() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
            $result = $this->bannerModel->uploadBanner($_FILES['image']);
            echo json_encode($result);
        } else {
            echo json_encode(['success' => false, 'message' => 'No image uploaded']);
        }
    }
    public function editBanner() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Nhận dữ liệu từ body của request
            $id = trim($_POST['id'] ?? null);
            if ($id && isset($_FILES['image'])) {
                $result = $this->bannerModel->updateBanner($id, $_FILES['image']);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid input or no image provided', 'data' => $id]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
    }

    public function deleteBanner() {
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            // Nhận dữ liệu từ body của request
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data['id']) ? (int)$data['id'] : null;

            if ($id) {
                $result = $this->bannerModel->deleteBanner($id);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid banner ID']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid request method']);
        }
    }
}
