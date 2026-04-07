<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// read JSON body
$input = json_decode(file_get_contents("php://input"), true);

// fallback for GET (optional, useful for browser testing)
if (!is_array($input)) {
    $input = $_GET;
}

$username = $input["username"] ?? "";
$password = $input["password"] ?? "";

// fake auth
if ($username === "demo" && $password === "demo") {
    echo json_encode([
    "connected" => true,
    "contract_active" => true,
    "last_sync" => date("c"),
    "assignments" => [
        ["chargePoint" => "Ladepunkt 1", "vehicle" => "VW ID.3", "employee" => "Anna Schmidt"],
        ["chargePoint" => "Ladepunkt 2", "vehicle" => "Audi e-tron", "employee" => "Max Müller"],
        ["chargePoint" => "Ladepunkt 3", "vehicle" => "Tesla Model 3", "employee" => "Rita Maier"]
    ],
    "error" => null
]);
} else {
    echo json_encode([
        "connected" => false,
        "contract_active" => false,
        "last_sync" => null,
        "error" => "Authentifizierung fehlgeschlagen"
    ]);
}
