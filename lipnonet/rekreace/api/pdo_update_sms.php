<?php 
  // Headers
  include_once '../config/cor.php';
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
  header('Content-Type: application/json');
  
  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));

  include_once '../config/Database.php';
  include_once 'models/Post_sms.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to update
  $post->id   = $data->id;
  $post->name = $data->name;
  $post->email = $data->email;
  $post->sms = $data->sms;
  $post->username = $data->username;
  $post->password = $data->password;
  $post->days = $data->days;


  // Update post

    if($post->update()) {
      echo json_encode(
        array('smsResult' => 'value_changed')
      );
    // if update failed
    } else {
      echo json_encode(
        array('smsResult' => 'value_change_failed')
      );
    }
