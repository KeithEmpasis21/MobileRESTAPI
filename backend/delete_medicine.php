<?php
require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only DELETE or POST requests are allowed']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['id']) || !is_numeric($input['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'A numeric id is required']);
    exit();
}

$conn = getConnection();
$id = intval($input['id']);

$stmt = $conn->prepare("DELETE FROM medicines WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'deleted' => $stmt->affected_rows > 0]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to delete medicine']);
}

$stmt->close();
$conn->close();
