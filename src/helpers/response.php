<?php
function jsonResponse($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}
?>