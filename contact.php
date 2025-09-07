<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// If JSON decode fails, try regular POST data
if ($input === null) {
    $input = $_POST;
}

// Validate required fields
$required_fields = ['name', 'email', 'subject', 'message'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $errors[] = ucfirst($field) . ' is required';
    }
}

// Validate email format
if (!empty($input['email']) && !filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Validation errors: ' . implode(', ', $errors)
    ]);
    exit;
}

// Sanitize input data
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars(trim($input['subject']));
$message = htmlspecialchars(trim($input['message']));

// Prepare email content
$to = 'jenishdhaduk99@gmail.com'; // Replace with actual email
$email_subject = 'Portfolio Contact: ' . $subject;
$email_body = "
New contact form submission from your portfolio website:

Name: $name
Email: $email
Subject: $subject

Message:
$message

---
Sent from: " . $_SERVER['HTTP_HOST'] . "
IP Address: " . $_SERVER['REMOTE_ADDR'] . "
User Agent: " . $_SERVER['HTTP_USER_AGENT'] . "
Date: " . date('Y-m-d H:i:s');

$headers = [
    'From: noreply@' . $_SERVER['HTTP_HOST'],
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// // Try to send email
// $mail_sent = false;
// try {
//     $mail_sent = mail($to, $email_subject, $email_body, implode("\r\n", $headers));
// } catch (Exception $e) {
//     error_log('Mail sending failed: ' . $e->getMessage());
// }

$mail_sent = false;
$mail = new PHPMailer(true);
try {
    // SMTP settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'dhadukjd1999@gmail.com';        // 🔁 your Gmail
    $mail->Password = 'wbdd xqan wiup enqs';           // 🔁 NOT Gmail password
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // Sender and recipient
    $mail->setFrom($email, $name);
    $mail->addAddress('jenishdhaduk99@gmail.com'); // 🔁 where you want to receive the mail

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission";
    $mail->Body    = "Name: $name<br>Email: $email<br>Message: $message";

    $mail->send();
    $mail_sent = true;
} catch (Exception $e) {
    error_log('Mail sending failed: ' . $mail->ErrorInfo);
}

// Save to file as backup (optional)
$log_data = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'],
    'user_agent' => $_SERVER['HTTP_USER_AGENT']
];

// Create messages directory if it doesn't exist
$messages_dir = 'messages';
if (!is_dir($messages_dir)) {
    mkdir($messages_dir, 0755, true);
}

// Save message to file
$log_file = $messages_dir . '/contact_' . date('Y-m-d') . '.json';
$existing_data = [];

if (file_exists($log_file)) {
    $existing_content = file_get_contents($log_file);
    $existing_data = json_decode($existing_content, true) ?: [];
}

$existing_data[] = $log_data;
file_put_contents($log_file, json_encode($existing_data, JSON_PRETTY_PRINT));

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Thank you for your message! I will get back to you soon.',
    'mail_sent' => $mail_sent
]);
?>