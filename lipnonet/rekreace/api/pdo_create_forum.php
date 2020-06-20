<?php 
  // Headers
  include_once '../config/cor.php';
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../config/Database.php';
  include_once 'models/Post_forum.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));

  $post->text =       $data->text;
  $post->jmeno =      $data->jmeno;
  $post->email =      $data->email;
  $post->typ =        $data->typ;

  // Create post
  if($post->create()) {
    echo json_encode(
      array('message' => 'Post Created')
    );
  } else {
    echo json_encode(
      array('message' => 'Post Not Created')
    );
  }