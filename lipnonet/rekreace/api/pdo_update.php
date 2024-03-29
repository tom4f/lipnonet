<?php declare(strict_types=1);
  // Headers
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../config/cor.php';
  include_once '../config/Database.php';
  include_once 'models/Post.php';

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));
  $fotoGalleryOwner = $data->fotoGalleryOwner;

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to update
  $post->id     = $data->id;
  $post->date   = $data->date;
  $post->text   = $data->text;
  $post->autor  = $data->autor;
  $post->email  = $data->email;
  $post->typ    = $data->typ;
  $post->header = $data->header;

  // Update post

  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
    // if update OK
    if($post->update()) {
      echo json_encode(
        array('message' => 'Photo Updated :-)')
      );
    // if update failed
    } else {
      echo json_encode(
        array('message' => 'Post Not Updated :-(')
      );
    }
    // if login failed
  } else {
    echo json_encode(
      array('message' => 'Login error :-(')
    );
  }

include_once './Image_resize.php';

Image_resize( 'small',  200, $fotoGalleryOwner, $data );
Image_resize( 'big'  , 1000, $fotoGalleryOwner, $data );