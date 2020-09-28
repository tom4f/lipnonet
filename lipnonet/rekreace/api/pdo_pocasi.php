<?php 
  // Headers
  include_once '../config/cor.php';
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../config/Database.php';
  include_once 'models/Post_pocasi.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));

  $fotoGalleryOwner = $data->fotoGalleryOwner;
  $webUser = $data->webUser;

  switch ($task) {
    case "update":
        $post->datum = $data->datum;
        $post->key   = $data->key;
        $post->value = $data->value;
      break;
    case "create":
        $post->datum   = $data->datum;
        $post->hladina = $data->hladina;
        $post->odtok = $data->odtok;
        $post->pritok = $data->pritok;
        $post->voda = $data->voda;
        $post->vzduch = $data->vzduch;
        $post->pocasi = $data->pocasi;
      break;
    case "delete":
        $post->datum = $data->datum;
      break;  
  }

  // Update post

  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);


  if( $webToken == $webTokenCalculated && in_array($webUser, $trustedUsers) ) {
      // if db connect ok
      if($db){
        // if db operation ok
        if($post->{$task}()) {
            echo json_encode( array('result' => 'pocasi_'.$task.'_ok') );
            // create new graphs
            $img_path = "../";
            include "../graph_all.php";
          // if update failed
        } else {
            echo json_encode( array('result' => 'pocasi_'.$task.'_not_ok')  );
          }
      } else {
          echo json_encode( array('result' => 'pocasi_'.$task.'_not_ok - db error')  );
        }
    // if login failed
} else {
      echo json_encode( array('result' => 'loginFailed') );
}