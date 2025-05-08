<?php
require_once '../core/database.php';

class Question {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    // Lấy tất cả câu hỏi kèm theo danh sách câu trả lời
    public function getQuestionsWithAnswers($offset = 0, $limit = 5) {
        $start = $offset * $limit;
    
        $query = "SELECT q.id AS question_id, q.title, q.content, q.created_at, u.name 
                  FROM questions q 
                  JOIN users u ON q.user_id = u.id 
                  ORDER BY q.created_at DESC 
                  LIMIT ?, ?";
    
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(1, $start, PDO::PARAM_INT);
        $stmt->bindValue(2, $limit, PDO::PARAM_INT);
        $stmt->execute();
        $questionsResult = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        $questions = [];
    
        foreach ($questionsResult as $row) {
            $questionId = $row['question_id'];
    
            $answerQuery = "SELECT a.id, a.content, a.created_at, u.name 
                            FROM answers a 
                            JOIN users u ON a.user_id = u.id 
                            WHERE a.question_id = ? 
                            ORDER BY a.created_at ASC";
    
            $answerStmt = $this->db->prepare($answerQuery);
            $answerStmt->bindValue(1, $questionId, PDO::PARAM_INT);
            $answerStmt->execute();
            $answersResult = $answerStmt->fetchAll(PDO::FETCH_ASSOC);
    
            $row['answers'] = $answersResult;
            $questions[] = $row;
        }
    
        return $questions;
    }

    // Lấy câu hỏi của người dùng
    public function getUserQuestions($user_id) {
        $query = "SELECT q.id AS question_id, q.title, q.content, q.created_at, u.name 
                  FROM questions q 
                  JOIN users u ON q.user_id = u.id 
                  WHERE q.user_id = ? 
                  ORDER BY q.created_at DESC";
    
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(1, $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Lấy câu trả lời của người dùng
    public function getUserAnswers($user_id) {
        $query = "SELECT a.id, a.content, a.created_at, u.name, q.title AS question_title, q.content AS question_content, a.question_id 
                  FROM answers a 
                  JOIN users u ON a.user_id = u.id 
                  JOIN questions q ON a.question_id = q.id 
                  WHERE a.user_id = ? 
                  ORDER BY a.created_at DESC";
    
        $stmt = $this->db->prepare($query);
        $stmt->bindValue(1, $user_id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Tạo người dùng
    public function createUser($name, $email, $password) {
        $stmt = $this->db->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
        return $stmt->execute(["name" => $name, "email" => $email, "password" => $password]);
    }

    // Tạo câu hỏi
    public function createQuestion($title, $content, $user_id) {
        $stmt = $this->db->prepare("INSERT INTO questions (title, content, user_id) VALUES (:title, :content, :user_id)");
        return $stmt->execute(["title" => $title, "content" => $content, "user_id" => $user_id]);
    }

    // Tạo câu trả lời
    public function createAnswer($question_id, $content, $user_id) {
        $stmt = $this->db->prepare("INSERT INTO answers (question_id, content, user_id) VALUES (:question_id, :content, :user_id)");
        return $stmt->execute(["question_id" => $question_id, "content" => $content, "user_id" => $user_id]);
    }

    // Cập nhật câu hỏi
    public function updateQuestion($question_id, $title, $content, $user_id) {
        $query = "UPDATE questions SET title = :title, content = :content WHERE id = :question_id AND user_id = :user_id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            "title" => $title,
            "content" => $content,
            "question_id" => $question_id,
            "user_id" => $user_id
        ]);
    }

    // Xóa câu hỏi
    public function deleteQuestion($question_id, $user_id, $isAdmin = false) {
        $query = $isAdmin ? 
            "DELETE FROM questions WHERE id = :question_id" :
            "DELETE FROM questions WHERE id = :question_id AND user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $params = ["question_id" => $question_id];
        if (!$isAdmin) {
            $params["user_id"] = $user_id;
        }
        return $stmt->execute($params);
    }

    // Cập nhật câu trả lời
    public function updateAnswer($answer_id, $content, $user_id) {
        $query = "UPDATE answers SET content = :content WHERE id = :answer_id AND user_id = :user_id";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([
            "content" => $content,
            "answer_id" => $answer_id,
            "user_id" => $user_id
        ]);
    }

    // Xóa câu trả lời
    public function deleteAnswer($answer_id, $user_id, $isAdmin = false) {
        $query = $isAdmin ? 
            "DELETE FROM answers WHERE id = :answer_id" :
            "DELETE FROM answers WHERE id = :answer_id AND user_id = :user_id";
        $stmt = $this->db->prepare($query);
        $params = ["answer_id" => $answer_id];
        if (!$isAdmin) {
            $params["user_id"] = $user_id;
        }
        return $stmt->execute($params);
    }
}
?>