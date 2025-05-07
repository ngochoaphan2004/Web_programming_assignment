<?php
function handleAvatarUpload($file) {
    $uploadDir = __DIR__ . '/../public/uploads/';
    $urlDir    = '/src/public/uploads/';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . '-' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    $allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!in_array($file['type'], $allowedTypes)) {
        return ['success' => false, 'message' => 'Chỉ cho phép ảnh PNG, JPG'];
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        return ['success' => false, 'message' => 'File quá lớn, tối đa 5MB'];
    }

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $imagePath = $urlDir . $fileName;  

        return ['success' => true, 'path' => $imagePath];
    } else {
        return ['success' => false, 'message' => 'Lỗi khi lưu file'];
    }
}
?>