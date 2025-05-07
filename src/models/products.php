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
    

    /* ========== THÊM MỚI ========== */
    public function create(
        string  $name,
        string  $description,
        float   $price,
        ?string $image,
        int     $stock,
        string  $category          // thêm
    ) {
        $sql = "INSERT INTO products
                (name, description, price, image, stock, category)
                VALUES (:name,:description,:price,:image,:stock,:category)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':name'        => $name,
            ':description' => $description,
            ':price'       => $price,
            ':image'       => $image,
            ':stock'       => $stock,
            ':category'    => $category     // bind
        ]);
    }

    /* ========== CẬP NHẬT ========== */
    public function update(
        int     $id,
        string  $name,
        string  $description,
        float   $price,
        ?string $image,
        int     $stock,
        string  $category
    ){
        $sql = "UPDATE products SET
                name=:name, description=:description, price=:price,
                image=:image, stock=:stock, category=:category     -- ➌
                WHERE id=:id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':id'          => $id,
            ':name'        => $name,
            ':description' => $description,
            ':price'       => $price,
            ':image'       => $image,
            ':stock'       => $stock,
            ':category'    => $category
        ]);
    }


    /** Chỉ cập nhật tồn kho (stock) – tiện cho nghiệp vụ bán hàng  */
    public function updateStock(int $id, int $stock) {
        $stmt = $this->db->prepare("UPDATE products SET stock = :stock WHERE id = :id");
        return $stmt->execute([':id' => $id, ':stock' => $stock]);
    }

    //** Lấy sản phẩm theo danh mục  */
    public function getProductsByCategory(string $category) {
        $stmt = $this->db->prepare("
            SELECT * FROM products
            WHERE category = :category
            ORDER BY created_at DESC
        ");
        $stmt->bindValue(':category', $category);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    /** Tìm kiếm nâng cao */
    public function searchAdvanced(string $kw, array $cats, array $prices) {
        $sql    = "SELECT * FROM products WHERE 1";
        $params = [];                           // <‑‑ chỉ dùng vị trí

        /* 1. Từ khoá */
        if ($kw !== '') {
            $sql .= " AND (name LIKE ? OR description LIKE ?)";
            $like = "%{$kw}%";
            $params[] = $like;    // 1
            $params[] = $like;    // 2
        }

        /* 2. Danh mục */
        $cats = array_filter($cats);            // loại bỏ rỗng
        if ($cats) {
            $place = rtrim(str_repeat("?,", count($cats)), ",");
            $sql  .= " AND category IN ($place)";
            $params = array_merge($params, $cats);   // nối thêm
        }

        /* 3. Khoảng giá – có thể nhiều khoảng */
        if ($prices) {
            $conds = [];
            foreach ($prices as $p) {
                [$min,$max] = array_map('intval', explode('-', $p));
                $conds[] = "(price BETWEEN ? AND ?)";
                $params[] = $min;
                $params[] = $max;
            }
            $sql .= " AND (" . implode(" OR ", $conds) . ")";
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    
    /** Lấy sản phẩm theo danh mục với phân trang  */
    public function getProductsByCategoryWithLimit(string $category, int $limit = 5, int $offset = 0) {
        $sql = "
            SELECT * FROM products
            WHERE category = :category
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        ";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);  
    }
    public function countProductsByCategory(string $category) {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as total
            FROM products
            WHERE category = :category
        ");
        $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        $stmt->execute();
        return (int) $stmt->fetch(PDO::FETCH_ASSOC)['total'];
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
