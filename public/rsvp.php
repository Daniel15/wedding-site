<?php
// Enable CORS for local development
if (strpos($_SERVER['HTTP_HOST'], 'localdev') === 0) {
  header('Access-Control-Allow-Headers: X-Requested-With');
  header('Access-Control-Allow-Origin: http://localhost:3000');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  die();
}

$errors = [];
if (empty($_POST['email'])) {
  $errors[] = 'Enter a contact email address';
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
$email = <<<EOT
A new RSVP was received!

Email: {$_POST['email']}
Phone: {$_POST['phone']}
Guests:
EOT;
foreach ($_POST['guests'] as $index => $guest) {
  $dietary = empty($guest['dietary']) ? 'None' : $guest['dietary'];
  $email .= <<<EOT

 - {$guest['name']}
   Dietary requirements: {$dietary}
EOT;
}

mail(
  'rsvp@alisonanddan.com',
  'RSVP from '.$_POST['guests'][0]['name'].' ('.count($_POST['guests']).' guests)',
  $email
);

echo json_encode([
  'success' => true,
  'response' => 'Thank you for submitting your RSVP 😁',
]);
?>
