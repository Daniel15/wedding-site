<?php
// Enable CORS for local development
if (strpos($_SERVER['HTTP_HOST'], 'localdev') === 0) {
  header('Access-Control-Allow-Headers: X-Requested-With');
  header('Access-Control-Allow-Origin: http://localhost:3000');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  die();
}

use PHPMailer\PHPMailer\PHPMailer;
require '../vendor/autoload.php';

$config = require('../config.php');

$errors = [];
if (empty($_POST['email'])) {
  $errors[] = 'Enter a contact email address';
}
$email_address = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
if ($email_address === false) {
  $errors[] = 'Enter a valid contact email address';
}
if (empty($_POST['phone'])) {
  $errors[] = 'Enter a contact telephone number';
}
if (empty($_POST['guests'])) {
  $errors[] = 'Add guest details';
} else {
  foreach ($_POST['guests'] as $index => $guest) {
    if (empty($guest['name'])) {
      $errors[] = 'Enter a name for guest #'.($index + 1);
    }
  }
}

if (count($errors) > 0) {
  $response = count($errors) === 1
    ? $errors[0]
    : 'Please fix these errors: <ul><li>'.implode('</li><li>', $errors).'</li></ul>';
  header('Content-Type: application/json');
  echo json_encode([
    'success' => false,
    'response' => $response,
  ]);
  die();
}

// Write RSVP to file
file_put_contents(
  __DIR__.'/../rsvps.txt',
  json_encode($_POST, JSON_PRETTY_PRINT)."\n\n",
  FILE_APPEND | LOCK_EX
);

// Send email
$email_body = <<<EOT
A new RSVP was received!

Email: {$email_address}
Phone: {$_POST['phone']}
Guests:
EOT;
foreach ($_POST['guests'] as $index => $guest) {
  $dietary = empty($guest['dietary']) ? 'None' : $guest['dietary'];
  $email_body .= <<<EOT

 - {$guest['name']}
   Dietary requirements: {$dietary}
EOT;
}

try {
  $email = new PHPMailer(true);
  $email->isSMTP();
  $email->Host = $config['smtp']['host'];
  $email->SMTPAuth = true;
  $email->Username = $config['smtp']['username'];
  $email->Password = $config['smtp']['password'];
  $email->SMTPSecure = 'tls';
  $email->Port = 587;

  $email->setFrom($config['smtp']['username']);
  $email->addAddress('rsvp@alisonanddan.com');
  $email->addReplyTo($email_address, $_POST['guests'][0]['name']);

  $email->Subject = 'RSVP from '.$_POST['guests'][0]['name'].' ('.count($_POST['guests']).' guests)';
  $email->Body = $email_body;

  $email->send();

  echo json_encode([
    'success' => true,
    'response' => 'Thank you for submitting your RSVP 😁',
  ]);
} catch (Exception $e) {
  echo json_encode([
    'success' => false,
    'response' => 'Sorry, there was an error in sending your RSVP: '.$e->getMessage(),
  ]);
}
?>
