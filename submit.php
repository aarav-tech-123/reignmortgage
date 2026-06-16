<?php
declare(strict_types=1);

// === CONFIG: update these values ===
$dbHost = 'localhost';
$dbName = 'u868210921_reignmortgage';
$dbUser = 'u868210921_reignmortgage';
$dbPass = 'Reignmortgage@1234';
// ================================

header('Content-Type: text/html; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Location: contact.html?error=invalid_method');
  exit;
}

function post_value(string $key): string {
  return isset($_POST[$key]) ? trim((string)$_POST[$key]) : '';
}

$firstName = post_value('first_name');
$lastName  = post_value('last_name');
$email     = post_value('email');
$phone     = post_value('phone');
$message   = post_value('message');

$errors = [];
if ($firstName === '') $errors[] = 'first_name';
if ($lastName === '')  $errors[] = 'last_name';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';
if ($phone === '') $errors[] = 'phone';
if ($message === '') $errors[] = 'message';

if (!empty($errors)) {
  header('Location: contact.html?error=validation');
  exit;
}

try {
  $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
  $pdo = new PDO($dsn, $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);

  $stmt = $pdo->prepare(
    'INSERT INTO contact_submissions (first_name, last_name, email, phone, message)
     VALUES (:first_name, :last_name, :email, :phone, :message)'
  );

  $stmt->execute([
    ':first_name' => $firstName,
    ':last_name'  => $lastName,
    ':email'      => $email,
    ':phone'      => $phone,
    ':message'    => $message,
  ]);

  header('Location: contact.html?success=1');
  exit;
} catch (Throwable $e) {
  // Avoid exposing DB details; send generic error flag.
  header('Location: contact.html?error=server');
  exit;
}

