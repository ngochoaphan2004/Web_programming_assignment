<?php
require_once '../models/question.php';

class QuestionController {
    private $questionModel;

    public function __construct() {
        $this->questionModel = new Question();
    }
    
    public function getQuestion() {
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $limit = 5;

        $questions = $this->questionModel->getQuestionsWithAnswers($offset, $limit);
        echo json_encode($questions, JSON_UNESCAPED_UNICODE);
    }

    public function createQuestion() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }

        if (empty($_POST)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Không nhận được dữ liệu từ biểu mẫu"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }
        $title = trim($_POST['title'] ?? '');
        $content = trim($_POST['content'] ?? '');
        if (empty($title) || empty($content)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }
        $result = $this->questionModel->createQuestion($title, $content, $user_id);
        if ($result) {
            echo json_encode(["success" => true, "message" => "Tạo câu hỏi thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Tạo câu hỏi thất bại"]);
        }
    }

    public function createAnswer() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }

        if (empty($_POST)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Không nhận được dữ liệu từ biểu mẫu"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }
        $question_id = trim($_POST['question_id'] ?? '');
        $content = trim($_POST['content'] ?? '');
        if (empty($question_id) || empty($content)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }
        $result = $this->questionModel->createAnswer($question_id, $content, $user_id);
        if ($result) {
            echo json_encode(["success" => true, "message" => "Tạo câu trả lời thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Tạo câu trả lời thất bại"]);
        }
    }

    public function getUserQuestions() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }
        $questions = $this->questionModel->getUserQuestions($user_id);
        echo json_encode($questions, JSON_UNESCAPED_UNICODE);
    }

    public function getUserAnswers() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }
        $answers = $this->questionModel->getUserAnswers($user_id);
        echo json_encode($answers, JSON_UNESCAPED_UNICODE);
    }

    public function updateQuestion() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $question_id = trim($input['question_id'] ?? '');
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');

        if (empty($question_id) || empty($title) || empty($content)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }

        $result = $this->questionModel->updateQuestion($question_id, $title, $content, $user_id);
        if ($result) {
            echo json_encode(["success" => true, "message" => "Cập nhật câu hỏi thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Cập nhật câu hỏi thất bại"]);
        }
    }

    public function deleteQuestion() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;
        $isAdmin = isset($_SESSION['role']) && $_SESSION['role'] === 1;

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $question_id = trim($input['question_id'] ?? '');

        if (empty($question_id)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }

        $result = $this->questionModel->deleteQuestion($question_id, $user_id, $isAdmin);
        if ($result) {
            echo json_encode(["success" => true, "message" => "Xóa câu hỏi thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Xóa câu hỏi thất bại"]);
        }
    }

    public function updateAnswer() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;

        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $answer_id = trim($input['answer_id'] ?? '');
        $content = trim($input['content'] ?? '');

        if (empty($answer_id) || empty($content)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }

        $result = $this->questionModel->updateAnswer($answer_id, $content, $user_id);
        if ($result) {
            echo json_encode(["success" => true, "message" => "Cập nhật câu trả lời thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Cập nhật câu trả lời thất bại"]);
        }
    }

    public function deleteAnswer() {
        session_start();
        $user_id = $_SESSION['user_id'] ?? null;
        $isAdmin = isset($_SESSION['role']) && $_SESSION['role'] === 1;

        if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Phương thức không được phép"]);
            exit;
        }
        if ($user_id === null) {
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Người dùng chưa đăng nhập"]);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $answer_id = trim($input['answer_id'] ?? '');

        if (empty($answer_id)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            return;
        }

        $result = $this->questionModel->deleteAnswer($answer_id, $user_id, $isAdmin);
        if ($result) {
            echo json_encode(["success" => true, "message" => "Xóa câu trả lời thành công"]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Xóa câu trả lời thất bại"]);
        }
    }
}
?>