<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));

  include_once '../config/Database.php';
  include_once 'models/Post_booking.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to delete
  $post->week = $data->week;

    // if update OK
    if($post->update()) {
        echo json_encode(
        array('message' => 'previous week cleared :-)')
        );
    // if update failed
    } else {
        echo json_encode(
        array('message' => 'previous week not cleared :-(')
        );
    }
