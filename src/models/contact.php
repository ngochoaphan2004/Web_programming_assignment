<?php
require_once '../core/database.php';

class Contact {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAllContacts() {
        $stmt = $this->db->query("
            SELECT contacts.*, faqs.answer, faqs.created_at AS faq_created_at
            FROM contacts
            LEFT JOIN faqs ON contacts.id_faq = faqs.id
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getContactByEmail($email) {
        $stmt = $this->db->prepare("
            SELECT contacts.*, faqs.answer, faqs.created_at AS faq_created_at
            FROM contacts
            LEFT JOIN faqs ON contacts.id_faq = faqs.id
            WHERE contacts.email = ?
        ");
        $stmt->execute([$email]);
        $contact = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if ($contact === false) {
            return ['error' => 'Không tìm thấy email này', 'status' => 428];
        }
        
        return $contact;
    }
    
    public function getContactById($id) {
        $stmt = $this->db->prepare("
            SELECT contacts.*, faqs.answer, faqs.created_at AS faq_created_at
            FROM contacts
            LEFT JOIN faqs ON contacts.id_faq = faqs.id
            WHERE contacts.id = ?
        ");
        $stmt->execute([$id]);
        $contact = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($contact === false) {
            return ['error' => 'Không tìm thấy ID này', 'status' => 428];
        }
    
        if (is_null($contact['answer'])) {
            $contact['answer'] = '';
        }
        if (is_null($contact['faq_created_at'])) {
            $contact['faq_created_at'] = '';
        }
    
        return $contact;
    }
    
    
    public function createContact($name, $email, $message) {
        try {
            $stmt = $this->db->prepare("INSERT INTO contacts (name, email, message, status, created_at) VALUES (:name, :email, :message, 'pending', current_timestamp())");
    
            $result = $stmt->execute([
                ":name" => $name,
                ":email" => $email,
                ":message" => $message
            ]);
    
            if ($result) {
                return ['success' => true, 'message' => 'Liên hệ đã được tạo thành công.'];
            } else {
                return ['success' => false, 'message' => 'Không thể tạo liên hệ.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Lỗi khi kết nối cơ sở dữ liệu: ' . $e->getMessage()];
        }
    }

    public function deleteContact($id) {
        $stmt = $this->db->prepare("SELECT * FROM contacts WHERE id = ?");
        $stmt->execute([$id]);
        $contact = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($contact === false) {
            return ['error' => 'Không tìm thấy ID cần xóa', 'status' => 428];
        }

        $stmt = $this->db->prepare("DELETE FROM contacts WHERE id = ?");
        $result = $stmt->execute([$id]);

        if ($result) {
            return ['success' => true];
        } else {
            return ['error' => 'Lỗi khi xóa bản ghi', 'status' => 500];
        }
    }
    

    public function answerContact($contact_id, $answer)  {
        $stmt = $this->db->prepare("INSERT INTO faqs (answer, created_at) VALUES (:answer, current_timestamp())");
        $stmt->execute([':answer' => $answer]);

        $faqId = $this->db->lastInsertId();

        $temp_stmt = $this->db->prepare("UPDATE contacts SET status = :status, id_faq = :id_faq WHERE id = :id");
        $result = $temp_stmt->execute([
            ':status' => 'replied',
            ':id_faq' => $faqId,
            ':id' => $contact_id
        ]);
    
        if ($result) {
            return ['success' => true];
        } else {
            return ['error' => 'Lỗi khi cập nhật câu trả lời', 'status' => 500];
        }
    }

    public function changeContact($contact_id, $status)  {

        $temp_stmt = $this->db->prepare("UPDATE contacts SET status = :status WHERE id = :id");
        $result = $temp_stmt->execute([
            ':status' => $status,
            ':id' => $contact_id
        ]);
    
        if ($result) {
            return ['success' => true];
        } else {
            return ['error' => 'Lỗi khi cập nhật câu trả lời', 'status' => 500];
        }
    }
}
?>
