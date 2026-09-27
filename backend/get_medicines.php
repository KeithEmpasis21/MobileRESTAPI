<?php
require_once 'db_config.php';

$conn = getConnection();

// Optional search: /get_medicines.php?search=paracetamol
if (isset($_GET['search']) && trim($_GET['search']) !== '') {
    $search = '%' . $_GET['search'] . '%';
    $stmt = $conn->prepare(
        "SELECT * FROM medicines WHERE name LIKE ? OR generic_name LIKE ? OR category LIKE ? ORDER BY name ASC"
    );
    $stmt->bind_param('sss', $search, $search, $search);
} else {
    $stmt = $conn->prepare("SELECT * FROM medicines ORDER BY name ASC");
}

$stmt->execute();
$result = $stmt->get_result();

$medicines = [];
while ($row = $result->fetch_assoc()) {
    $medicines[] = $row;
}

echo json_encode(['success' => true, 'data' => $medicines]);

$stmt->close();
$conn->close();
