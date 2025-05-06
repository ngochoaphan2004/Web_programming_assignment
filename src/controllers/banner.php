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
}
