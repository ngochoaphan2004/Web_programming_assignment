<?php
require_once '../models/products.php';

class ProductController {
    // Lấy tất cả sản phẩm
    public function getAllProducts() {
        $productModel = new Product();
        $products = $productModel->getAllProducts();
        echo json_encode(["success" => true, "data" => $products], JSON_PRETTY_PRINT);
    }

    // Lấy chi tiết 1 sản phẩm theo id
    public function getProductById($id) {
        $productModel = new Product();
        $product = $productModel->getProductById($id);
        if ($product) {
            echo json_encode(["success" => true, "data" => $product]);
        } else {
            echo json_encode(["success" => false, "message" => "Product not found"]);
        }
    }
    
    public function getPopularProducts() {
        $productModel = new Product();
        $products = $productModel->getPopularProducts(5);
        echo json_encode(["success" => true, "data" => $products]);
    }
    
    public function getNewestProducts() {
        $productModel = new Product();
        $products = $productModel->getNewestProducts(5);
        echo json_encode(["success" => true, "data" => $products]);
    }
    
    // Thêm sản phẩm mới
    public function createProduct() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            return;
        }

        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $stock = intval($_POST['stock'] ?? 0);
        $imagePath = null;

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $file = $_FILES['image'];
            $fileName = uniqid() . '-' . basename($file['name']);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $imagePath = $targetPath;
            }
        }

        $productModel = new Product();
        $result = $productModel->create($name, $description, $price, $imagePath, $stock);

        if ($result) {
            echo json_encode(["success" => true, "message" => "Product created successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to create product"]);
        }
    }

    // Cập nhật thông tin sản phẩm
    public function updateProduct($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            return;
        }

        $name = trim($_POST['name'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $stock = intval($_POST['stock'] ?? 0);
        $imagePath = $_POST['old_image'] ?? null;

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = 'uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $file = $_FILES['image'];
            $fileName = uniqid() . '-' . basename($file['name']);
            $targetPath = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                $imagePath = $targetPath;
            }
        }

        $productModel = new Product();
        $result = $productModel->update($id, $name, $description, $price, $imagePath, $stock);

        if ($result) {
            echo json_encode(["success" => true, "message" => "Product updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update product"]);
        }
    }

    // Xoá sản phẩm
    public function deleteProduct($id) {
        $productModel = new Product();
        $result = $productModel->delete($id);

        if ($result) {
            echo json_encode(["success" => true, "message" => "Product deleted successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete product"]);
        }
    }
}
?>
