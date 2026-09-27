<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST requests are allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['name']) || trim($input['name']) === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A medicine name is required']);
    exit();
}

$conn = getConnection();

$stmt = $conn->prepare(
    "INSERT INTO medicines
        (name, generic_name, category, dosage_form, strength, description, manufacturer, price, stock_quantity, expiry_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$name           = $input['name'];
$generic_name   = $input['generic_name'] ?? null;
$category       = $input['category'] ?? null;
$dosage_form    = $input['dosage_form'] ?? null;
$strength       = $input['strength'] ?? null;
$description    = $input['description'] ?? null;
$manufacturer   = $input['manufacturer'] ?? null;
$price          = $input['price'] ?? 0;
$stock_quantity = $input['stock_quantity'] ?? 0;
$expiry_date    = $input['expiry_date'] ?? null;

$stmt->bind_param(
    'sssssssdis',
    $name, $generic_name, $category, $dosage_form, $strength,
    $description, $manufacturer, $price, $stock_quantity, $expiry_date
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to add medicine']);
}

$stmt->close();
$conn->close();
