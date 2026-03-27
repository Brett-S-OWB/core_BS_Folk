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
        ["device" => "Ladepunkt 1", "assigned_to" => "Wohnung 2.1"],
        ["device" => "Ladepunkt 2", "assigned_to" => "Max Müller"],
        ["device" => "Wärmepumpe", "assigned_to" => "Allgemeinstrom"]
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
