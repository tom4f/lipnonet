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
  include_once 'models/Post_booking_edit.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Set ID to update
  $post->g_week   = $data->g_week;
  $post->g_number = $data->g_number;
  $post->g_status = $data->g_status;
  $post->g_text   = $data->g_text;


  // Update post

  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
    // if update OK
    if($post->update()) {
      echo json_encode(
        array('mailResult' => 'termin_changed')
      );
      // update last update date
      $fp = FOpen("../formular_counter.dat", "w+");
      $LastChange=StrFTime("%d.%m.%Y");
      FPutS($fp, $LastChange);
      FClose($fp);
    // if update failed
    } else {
      echo json_encode(
        array('mailResult' => 'mail_failed')
      );
    }
    // if login failed
  } else {
    echo json_encode(
      array('mailResult' => 'loginFailed')
    );
  }