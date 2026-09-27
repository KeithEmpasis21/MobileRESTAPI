<?php
// Database connection settings
define('DB_HOST', '10.123.0.243');
define('DB_NAME', 'wesemp_medicine');
define('DB_USER', 'wesemp_medicine');
define('DB_PASS', 'INSERT_PASSWORD');

function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }

    $conn->set_charset('utf8mb4');
    return $conn;
}

// Common headers for every API response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests from the React Native app
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
