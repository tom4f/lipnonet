<?php 
  // Headers
  include_once '../config/cor.php';
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));
  $fotoGalleryOwner = $data->fotoGalleryOwner;

  include_once '../config/Database.php';
  include_once 'models/Post.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to delete
  $post->id = $data->id;

  // Delete post


  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
    // if update OK
    if($post->delete()) {
      echo json_encode(
        array('message' => 'Photo Deleted :-)')
      );
    // if update failed
    } else {
      echo json_encode(
        array('message' => 'Photo Not Deleted :-(')
      );
    }
    // if login failed
  } else {
    echo json_encode(
      array('message' => 'Login error :-(')
    );
  }