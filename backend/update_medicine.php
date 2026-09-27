<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only PUT or POST requests are allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id']) || !is_numeric($input['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A numeric id is required']);
    exit();
}

$conn = getConnection();

$id             = intval($input['id']);
$name           = $input['name'] ?? '';
$generic_name   = $input['generic_name'] ?? null;
$category       = $input['category'] ?? null;
$dosage_form    = $input['dosage_form'] ?? null;
$strength       = $input['strength'] ?? null;
$description    = $input['description'] ?? null;
$manufacturer   = $input['manufacturer'] ?? null;
$price          = $input['price'] ?? 0;
$stock_quantity = $input['stock_quantity'] ?? 0;
$expiry_date    = $input['expiry_date'] ?? null;

$stmt = $conn->prepare(
    "UPDATE medicines SET
        name = ?, generic_name = ?, category = ?, dosage_form = ?, strength = ?,
        description = ?, manufacturer = ?, price = ?, stock_quantity = ?, expiry_date = ?
     WHERE id = ?"
);

$stmt->bind_param(
    'sssssssdisi',
    $name, $generic_name, $category, $dosage_form, $strength,
    $description, $manufacturer, $price, $stock_quantity, $expiry_date, $id
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'updated' => $stmt->affected_rows > 0]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to update medicine']);
}

$stmt->close();
$conn->close();
