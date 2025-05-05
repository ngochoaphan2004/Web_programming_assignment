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
    
    // // Thêm sản phẩm mới
    // public function createProduct() {
    //     if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    //         http_response_code(405);
    //         echo json_encode(["success" => false, "message" => "Method not allowed"]);
    //         return;
    //     }

    //     $name = trim($_POST['name'] ?? '');
    //     $description = trim($_POST['description'] ?? '');
    //     $price = floatval($_POST['price'] ?? 0);
    //     $stock = intval($_POST['stock'] ?? 0);
    //     $imagePath = null;

    //     if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    //         $uploadDir = 'uploads/';
    //         if (!is_dir($uploadDir)) {
    //             mkdir($uploadDir, 0777, true);
    //         }

    //         $file = $_FILES['image'];
    //         $fileName = uniqid() . '-' . basename($file['name']);
    //         $targetPath = $uploadDir . $fileName;

    //         if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    //             $imagePath = $targetPath;
    //         }
    //     }

    //     $productModel = new Product();
    //     $result = $productModel->create($name, $description, $price, $imagePath, $stock);

    //     if ($result) {
    //         echo json_encode(["success" => true, "message" => "Product created successfully"]);
    //     } else {
    //         echo json_encode(["success" => false, "message" => "Failed to create product"]);
    //     }
    // }

    // // Cập nhật thông tin sản phẩm
    // public function updateProduct($id) {
    //     if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    //         http_response_code(405);
    //         echo json_encode(["success" => false, "message" => "Method not allowed"]);
    //         return;
    //     }
    
    //     $productModel = new Product();
    //     $product = $productModel->getProductById($id);
    //     if (!$product) {
    //         echo json_encode(["success" => false, "message" => "Product not found"]);
    //         return;
    //     }
    
    //     // Lấy dữ liệu từ form
    //     $name        = $_POST['name']        ?? $product['name'];
    //     $description = $_POST['description'] ?? $product['description'];
    //     $price       = $_POST['price']       ?? $product['price'];
    //     $stock       = $_POST['stock']       ?? $product['stock'];
    //     $imagePath   = $_POST['image_url']   ?? $product['image'];  // lấy link nếu có
    
    //     // Nếu có upload ảnh mới → ưu tiên ảnh file
    //     if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    //         $uploadDir = 'uploads/';
    //         if (!is_dir($uploadDir)) {
    //             mkdir($uploadDir, 0777, true);
    //         }
    
    //         $file = $_FILES['image'];
    //         $fileName = uniqid() . '-' . basename($file['name']);
    //         $targetPath = $uploadDir . $fileName;
    
    //         if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    //             $imagePath = $targetPath;
    //         }
    //     }
    
    //     $success = $productModel->update($id, $name, $description, $price, $imagePath, $stock);
    //     echo json_encode(["success" => $success]);
    // }








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

        /* ---------- UPLOAD ---------- */
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = __DIR__ . '/../public/uploads/';   // đường dẫn THẬT
            $urlDir    = '/src/public/uploads/';        // đường dẫn WEB

            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            $file      = $_FILES['image'];
            $fileName  = uniqid() . '-' . basename($file['name']);
            $target    = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $target)) {
                $imagePath = $urlDir . $fileName;           // lưu vào DB
            }
        }
        /* -------------------------------- */

        $productModel = new Product();
        $ok = $productModel->create($name,$description,$price,$imagePath,$stock);

        echo json_encode(["success"=>$ok,
            "message"=>$ok?"Product created successfully":"Failed to create product"]);
    }

    /* ------------------------------------------------------------------ */
    /*                              UPDATE                                */
    /* ------------------------------------------------------------------ */

    public function updateProduct($id) {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method not allowed"]);
            return;
        }

        $productModel = new Product();
        $product = $productModel->getProductById($id);
        if (!$product) {
            echo json_encode(["success"=>false,"message"=>"Product not found"]); return;
        }

        $name        = $_POST['name']        ?? $product['name'];
        $description = $_POST['description'] ?? $product['description'];
        $price       = $_POST['price']       ?? $product['price'];
        $stock       = $_POST['stock']       ?? $product['stock'];
        $imagePath   = $_POST['image_url']   ?? $product['image'];   // giữ link cũ

        /* ---------- UPLOAD nếu có file mới ---------- */
        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
            $uploadDir = __DIR__ . '/../public/uploads/';
            $urlDir    = '/src/public/uploads/';

            if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

            $file     = $_FILES['image'];
            $fileName = uniqid() . '-' . basename($file['name']);
            $target   = $uploadDir . $fileName;

            if (move_uploaded_file($file['tmp_name'], $target)) {
                $imagePath = $urlDir . $fileName;          // ghi đè link mới
            }
        }
        /* -------------------------------------------- */

        $ok = $productModel->update($id,$name,$description,$price,$imagePath,$stock);
        echo json_encode(["success"=>$ok]);
    }








    

    // Lấy sản phẩm theo danh mục
    public function getProductsByCategory($category) {
        $productModel = new Product();
        $products = $productModel->getProductsByCategory($category);
        echo json_encode(["success" => true, "data" => $products]);
    }
    
    public function search() {
        $kw      = $_GET['kw']   ?? '';
        $cats    = $_GET['cat']  ?? [];               // cat=sneaker&cat=balo (mảng)
        $prices  = $_GET['price']?? [];               // price=0-200000 (mảng)
    
        /* ép về mảng */
        $cats   = is_array($cats)   ? $cats   : [$cats];
        $prices = is_array($prices) ? $prices : [$prices];
    
        $model = new Product();
        $data  = $model->searchAdvanced($kw, $cats, $prices);
    
        echo json_encode(["success"=>true,"data"=>$data]);
    }
    

    // Lấy sản phẩm theo danh mục với phân trang
    public function getProductsByCategoryPaginated($category) {
        $limit  = $_GET['limit']  ?? 5;
        $page   = $_GET['page']   ?? 1;
        $offset = ($page - 1) * $limit;
    
        $productModel = new Product();
        $products = $productModel->getProductsByCategoryWithLimit($category, $limit, $offset);
        echo json_encode(["success" => true, "data" => $products]);
    }
    
    // Lấy toàn bộ sản phẩm – lần này không phân trang
    public function getAllProductsGrouped() {
        $productModel = new Product();
        $categories = ['sneaker','sandal','balo','phukien'];

        $result = [];
        foreach ($categories as $cat) {
            $result[$cat] = $productModel->getProductsByCategory($cat);
        }
        echo json_encode(["success" => true, "data" => $result]);
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
