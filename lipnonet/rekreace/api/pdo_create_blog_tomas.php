<?php 
  // Headers
  include_once '../config/cor.php';
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));
  $fotoGalleryOwner = $data->fotoGalleryOwner;

  include_once '../config/Database.php';
  include_once 'models/Post_blog_tomas.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to update

  $post->title     = $data->title;
  $post->title_url = $data->title_url;
  $post->body      = $data->body;
  $post->image     = $data->image;
  $post->date      = $data->date;
  $post->intro     = $data->intro;
  $post->category  = $data->category;

  // Update post

  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
    // if update OK
    if($post->create()) {
      echo json_encode(
        array('message' => 'Blog updated :-)')
      );
    // if update failed
    } else {
      echo json_encode(
        array('message' => 'Blog not updated :-(')
      );
    }
    // if login failed
  } else {
    echo json_encode(
      array('message' => 'Login error :-(')
    );
  }