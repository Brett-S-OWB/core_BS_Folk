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
        ["Ladepunkt" => "Ladepunkt 1", "Fahrzeug" => "VW ID.3", "Mitarbeiter" => "Anna Schmidt"],
        ["Ladepunkt" => "Ladepunkt 2", "Fahrzeug" => "Audi e-tron", "Mitarbeiter" => "Max Müller"],
        ["Ladepunkt" => "Ladepunkt 3", "Fahrzeug" => "Tesla Model 3", "Mitarbeiter" => "Rita Maier"]
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
