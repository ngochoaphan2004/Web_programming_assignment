<?php
class Router {
    private static $routes = [];

    public static function add($method, $uri, $callback) {
        self::$routes[] = ["method" => strtoupper($method), "uri" => trim($uri, '/'), "callback" => $callback];
    }

    public static function dispatch() {
        $requestMethod = $_SERVER['REQUEST_METHOD'];
        $requestUri = trim($_SERVER['REQUEST_URI'], '/');

        foreach (self::$routes as $route) {
            if ($route['uri'] === $requestUri && $route['method'] === $requestMethod) {
                call_user_func($route['callback']);
                return;
            }
        }

        // 404 Not Found
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Route không tồn tại"]);
    }
}
