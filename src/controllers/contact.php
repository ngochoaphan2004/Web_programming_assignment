<?php
require_once '../models/contact.php';

class ContactController {
    private $contactModel;

    public function __construct() {
        $this->contactModel = new Contact();
    }

    public function getAllContacts() {
        $contacts = $this->contactModel->getAllContacts();
        echo json_encode($contacts);
    }

    public function getContactById($id) {
        $contact = $this->contactModel->getContactById($id);
        echo json_encode($contact);
    }

    public function getContactByEmail($email) {
        $contact = $this->contactModel->getContactByEmail($email);
        echo json_encode($contact);
    }

    public function createContact() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['name'], $data['email'], $data['message'])) {
            $success = $this->contactModel->createContact($data['name'], $data['email'], $data['message']);
            echo json_encode(["success" => $success]);
        } else {
            echo json_encode(["error" => "Thiếu dữ liệu"]);
        }
    }

    public function deleteContact($id) {
        $success = $this->contactModel->deleteContact($id);
        echo json_encode(["success" => $success]);
    }

    public function answerContact() {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['id'], $data['answer'])) {
            $success = $this->contactModel->answerContact($data['id'], $data['answer']);
            echo json_encode(["success" => $success]);
        } else {
            echo json_encode(["error" => "Thiếu ID hoặc câu trả lời"]);
        }
    }
}
