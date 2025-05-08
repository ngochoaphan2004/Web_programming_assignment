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
                'thank' => $thanks
            ];

            // Trả về dữ liệu dưới dạng JSON
            echo json_encode($data);

        } catch (Exception $e) {
            echo json_encode(['error' => 'Something went wrong']);
        }
    }
    public function addContent() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $content = trim($_POST['content'] ?? null);
            $section = trim($_POST['section'] ?? null);
            $order_index = trim($_POST['order_index'] ?? null);
            if (!isset($content) || !isset($order_index) || !isset($section)) {
                echo json_encode(["success" => false, "message" => 'Thiếu dữ liệu cần thiết.']);
                return;
            }

            // $section = $data['section'];
            if (!in_array($section, ['intro', 'commitment', 'thank'])) {
                echo json_encode(["success" => false, "message" => 'Loại nội dung không hợp lệ.', "section" => $section]);
                return;
            }
            // var_dump($order_index, $section); die();
            // var_dump($this->introModel->getSectionByIndex($order_index, $section)); die();

            if($this->introModel->getSectionByIndex($order_index, $section)){
                echo json_encode(["success" => false, "message" => 'Vị trí hiển thị đã tồn tại.', "section" => $this->introModel->getSectionByIndex($order_index, $section)]);
                return;
            }
            
            $result = $this->introModel->addContent($section, $content, $order_index);
            
            header('Content-Type: application/json');
            echo json_encode($result);
        } catch (Exception $e) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Update content
    public function updateContent($section, $order_index) {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['content']) || !isset($data['order_index'])) {
                echo json_encode(["success" => false, "message" => 'Thiếu dữ liệu cần thiết.']);
                return;
            }

            if (!in_array($section, ['intro', 'commitment', 'thank'])) {
                echo json_encode(["success" => false, "message" => 'Loại nội dung không hợp lệ.']);
                return;
            }

            $result = $this->introModel->updateContent($section, $order_index, $data['content'], $data['order_index']);
            
            header('Content-Type: application/json');
            echo json_encode($result);
        } catch (Exception $e) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    // Delete content
    public function deleteContent($section, $order_index) {
        try {
            if (!in_array($section, ['intro', 'commitment', 'thank'])) {
                echo json_encode(["success" => false, "message" => 'Loại nội dung không hợp lệ.']);
                return;
            }

            $result = $this->introModel->deleteContent($section, $order_index);
            
            header('Content-Type: application/json');
            echo json_encode($result);
        } catch (Exception $e) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}