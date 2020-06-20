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
  $post->hladina = $data->hladina;
  $post->odtok = $data->odtok;
  $post->pritok = $data->pritok;
  $post->voda = $data->voda;
  $post->vzduch = $data->vzduch;
  $post->pocasi = $data->pocasi;


  // Update post

  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
      // if db connect ok
      if($db){
          // if db operation ok
          if($post->create()) {
              echo json_encode( array('result' => 'pocasi_added') );
              // update last update date
              $fp = FOpen("../formular_counter.dat", "w+");
              $LastChange=StrFTime("%d.%m.%Y");
              FPutS($fp, $LastChange);
              FClose($fp);
            } else {
                echo json_encode( array('result' => 'pocasi_not_added')  );
              }
      } else {
        echo json_encode( array('result' => 'pocasi_not_deleted - db error')  );
      }
// if login failed
} else {
      echo json_encode( array('result' => 'loginFailed') );
  }