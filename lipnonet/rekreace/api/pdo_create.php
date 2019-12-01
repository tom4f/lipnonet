<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
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

  $post->date =       $data->date;
  $post->text =       $data->text;
  $post->autor =      $data->autor;
  $post->email =      $data->email;
  $post->typ =        $data->typ;
  $post->header =     $data->header;


  $date = md5("" . Date('d') . Date('m') . Date('Y'));
  $webTokenCalculated = "".md5($date);
  $webToken = "".($data->webToken);

  if($webToken == $webTokenCalculated) {
    // if update OK
    if($post->create()) {
      echo json_encode(
        array('message' => 'Photo Added :-)')
      );
    // if update failed
    } else {
      echo json_encode(
        array('message' => 'Photo Not Added :-(')
      );
    }
    // if login failed
  } else {
    echo json_encode(
      array('message' => 'Login error :-(')
    );
  }


// if image in update request ($dataUrl present) => upload file
if (isset($data->dataUrl)) {
  
    $fileNumber =   $data->name;
    $fileType =   $data->type;
    $dataUrl =    $data->dataUrl;

    $rotate =    $data->rotate;

    $remote_folder="../fotogalerie". $fotoGalleryOwner ."/";

    $filePathOrig = $remote_folder . $fileNumber . "o.jpg";;
    file_put_contents($filePathOrig, base64_decode(explode(',',$dataUrl)[1]));

    $remote_path = $remote_folder . $fileNumber . ".jpg";
    $remote_path1 =$remote_folder . $fileNumber . "b.jpg";

    function img_resize($filePathOrig, $newwidth, $filePathDest, $rotate){
      $source = imagecreatefromjpeg($filePathOrig);
      // Rotate
      if ($rotate > 0) {
        $rotate1 = imagerotate($source, $rotate, 0);
        if ($rotate == 180)
          list($width, $height) = getimagesize($filePathOrig);  
        else
          list($height, $width) = getimagesize($filePathOrig);
      }
      else {
        $rotate1 = $source;
        list($width, $height) = getimagesize($filePathOrig);  
      }

      $newheight = $height / ($width / $newwidth);
      $destination = imagecreatetruecolor($newwidth, $newheight);
      imagecopyresampled($destination, $rotate1, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
      imagejpeg($destination, $filePathDest, 100);
      //echo "newwidth: ".$newwidth. "newheight: ".$newheight."width: ".$width."height: ".$height;
    }

    img_resize("$filePathOrig", 100,  "$remote_path",  $rotate);
    img_resize("$filePathOrig", 1000, "$remote_path1", $rotate);
  
}