<?php
require_once '../models/intro.php';

class IntroController {
    private $introModel;

    public function __construct() {
        $this->introModel = new Intro();
    }
    public function getIntroduceData() {
        try {
            // Lấy tất cả dữ liệu
            $intro = $this->introModel->getIntroContent();
            $commitments = $this->introModel->getCommitments();
            $thanks = $this->introModel->getThanks();

            // Tạo mảng dữ liệu trả về
            $data = [
                'intro' => $intro,
                'commitments' => $commitments,
                'thanks' => $thanks
            ];

            // Trả về dữ liệu dưới dạng JSON
            echo json_encode($data);

        } catch (Exception $e) {
            echo json_encode(['error' => 'Something went wrong']);
        }
    }
}