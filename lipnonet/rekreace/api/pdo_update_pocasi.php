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
  include_once 'models/Post_pocasi.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to update
  $post->datum   = $data->datum;
  $post->key = $data->key;
  $post->value = $data->value;

  // Update post

  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
      // if db connect ok
      if($db){
        // if db operation ok
        if($post->update()) {
            echo json_encode( array('result' => 'pocasi_updated') );
            // create new graphs
            $img_path = "../";
            include "../graph_all.php";
          // if update failed
        } else {
            echo json_encode( array('result' => 'pocasi_not_updated')  );
          }
      } else {
          echo json_encode( array('result' => 'pocasi_not_deleted - db error')  );
        }
    // if login failed
} else {
      echo json_encode( array('result' => 'loginFailed') );
}