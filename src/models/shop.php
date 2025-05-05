<?php
require_once '../core/database.php';

class Shop
{
    private $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getShopInfo()
    {
        $stmt = $this->db->query("
            SELECT shop_info.*, shop_address.address, shop_address.id as address_id
            FROM shop_info
            LEFT JOIN shop_address ON shop_info.id = shop_address.shop_id
        ");
        $temp = $stmt->fetchALL(PDO::FETCH_ASSOC);

        $shop = [
            'id' => $temp[0]['id'],
            'name' => $temp[0]['name'],
            'logo' => $temp[0]['logo'],
            'description' => $temp[0]['description'],
            'phone' => $temp[0]['phone'],
            'email' => $temp[0]['email'],
            'addresses' => [],
        ];
    
        foreach ($temp as $row) {
            if (!empty($row['address']) && !empty($row['address_id'])) {
                $shop['addresses'][] = [
                    'id' => $row['address_id'],
                    'address' => $row['address'],
                ];
            }
        }

        return $shop;
    }

    public function updateShopInfo($data)
    {
        if (empty($data['id'])) {
            return ['error' => 'ID was needed', 'status' => 500];
        }

        if (!empty($data['name'])) {
            $stmt = $this->db->prepare("UPDATE `shop_info` SET `name` = :name WHERE id = :id");
            $stmt->execute([':name' => $data['name'], ':id' => $data['id']]);
        }
        
        if (!empty($data['description'])) {
            $stmt = $this->db->prepare("UPDATE `shop_info` SET `description` = :description WHERE id = :id");
            $stmt->execute([':description' => $data['description'], ':id' => $data['id']]);
        }

        if (!empty($data['email'])) {
            $stmt = $this->db->prepare("UPDATE `shop_info` SET `email` = :email WHERE id = :id");
            $stmt->execute([':email' => $data['email'], ':id' => $data['id']]);
        }
        
        if (!empty($data['phone'])) {
            $stmt = $this->db->prepare("UPDATE `shop_info` SET `phone` = :phone WHERE id = :id");
            $stmt->execute([':phone' => $data['phone'], ':id' => $data['id']]);
        }

        if (!empty($data['address'])) {
            $addresses = $data['address'];

            if (!is_array($addresses)) {
                return ['error' => 'Address must be array', 'status' => 500];
            }

            $stmt = $this->db->prepare("UPDATE `shop_address` SET `address` = :address WHERE id = :id");
            
            foreach ($addresses as $address) {
                if (!empty($address['id']) && !empty($address['address'])) {
                    $stmt->execute([
                        ':address' => $address['address'],
                        ':id' => $address['id'],
                    ]);
                }
            }
        }
        
        
        return ['success' => 'Update successfully', 'status' => 200];
    }

    public function deleteAddress($data) {
        if (empty($data['id'])) {
            return ['error' => 'ID was needed', 'status' => 500];
        }
        
        $stmt = $this->db->prepare("DELETE FROM shop_address WHERE id = :id");
        $stmt->execute([':id' => $data['id']]);
    }

    public function updateLogo($path) {
        $query = "UPDATE shop_info SET logo = :logo WHERE id = 1";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([':logo' => $path]);
    }
}
