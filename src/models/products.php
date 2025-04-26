<?php
/**  Product model – thao tác CRUD cho bảng products  */
require_once '../core/database.php';
class Product {
    /** @var PDO */
    private $db;

    public function __construct() {
        // Database::getInstance() giả định trả về 1 đối tượng PDO singleton
        $this->db = Database::getInstance();
    }

    /* -------------------------------------------------
     * 1. LẤY DỮ LIỆU
     * -------------------------------------------------*/

    /** Lấy toàn bộ sản phẩm  */
    public function getAllProducts() {
        $stmt = $this->db->query("SELECT * FROM products ORDER BY created_at DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** Lấy 1 sản phẩm theo ID  */
    public function getProductById(int $id) {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /** Tìm kiếm sản phẩm theo tên hoặc mô tả  */
    public function search(string $keyword) {
        $kw = "%{$keyword}%";
        $stmt = $this->db->prepare("
            SELECT * FROM products
            WHERE name LIKE :kw OR description LIKE :kw
            ORDER BY created_at DESC
        ");
        $stmt->execute(['kw' => $kw]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getPopularProducts(int $limit = 5) {
        // ví dụ sắp xếp theo cột `sold` (số lần bán) cao → thấp.
        // Nếu bạn có cột khác (ví dụ `is_popular` hay `view_count`) thì thay ORDER BY cho phù hợp
        $stmt = $this->db->prepare("
            SELECT * FROM products
            ORDER BY sold DESC
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function getNewestProducts(int $limit = 5) {
        $stmt = $this->db->prepare("
            SELECT * FROM products
            ORDER BY created_at DESC
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    

    /* -------------------------------------------------
     * 2. THÊM MỚI
     * -------------------------------------------------*/

    /**
     * Thêm sản phẩm mới
     * @return bool true nếu thành công
     */
    public function create(
        string $name,
        string $description,
        float  $price,
        ?string $image = null,
        int    $stock  = 0
    ) {
        $sql = "INSERT INTO products (name, description, price, image, stock)
                VALUES (:name, :description, :price, :image, :stock)";
        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            ':name'        => $name,
            ':description' => $description,
            ':price'       => $price,
            ':image'       => $image,
            ':stock'       => $stock
        ]);
    }

    /* -------------------------------------------------
     * 3. CẬP NHẬT
     * -------------------------------------------------*/

    /**
     * Cập nhật toàn bộ thông tin sản phẩm
     */
    public function update(
        int     $id,
        string  $name,
        string  $description,
        float   $price,
        ?string $image,
        int     $stock
    ) {
        $sql = "UPDATE products
                SET name        = :name,
                    description = :description,
                    price       = :price,
                    image       = :image,
                    stock       = :stock
                WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        return $stmt->execute([
            ':id'          => $id,
            ':name'        => $name,
            ':description' => $description,
            ':price'       => $price,
            ':image'       => $image,
            ':stock'       => $stock
        ]);
    }

    /** Chỉ cập nhật tồn kho (stock) – tiện cho nghiệp vụ bán hàng  */
    public function updateStock(int $id, int $stock) {
        $stmt = $this->db->prepare("UPDATE products SET stock = :stock WHERE id = :id");
        return $stmt->execute([':id' => $id, ':stock' => $stock]);
    }

    /* -------------------------------------------------
     * 4. XOÁ
     * -------------------------------------------------*/

    /** Xoá sản phẩm  */
    public function delete(int $id) {
        $stmt = $this->db->prepare("DELETE FROM products WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
