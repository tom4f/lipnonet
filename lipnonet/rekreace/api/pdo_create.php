<?php 
  // Headers
  include_once '../config/cor.php';
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
  
    //$fileNumber = $data->name;
    $fileNumber = $data->id;  
    $fileType   = $data->type;
    $dataUrl    = $data->dataUrl;
    $rotate     = $data->rotate;

    $remote_folder="../fotogalerie". $fotoGalleryOwner ."/";

    $filePathOrig = $remote_folder . $fileNumber . "o.jpg";;
    file_put_contents($filePathOrig, base64_decode(explode(',',$dataUrl)[1]));

    $remote_path_small = $remote_folder . $fileNumber . ".jpg";
    $remote_path_big   = $remote_folder . $fileNumber . "b.jpg";

    function img_resize($filePathOrig, $newWidth, $filePathDest, $rotate){
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

      if ( $newWidth < $width ) {
        $newheight = $height / ($width / $newWidth);
        $destination = imagecreatetruecolor($newWidth, $newheight);
        imagecopyresampled($destination, $rotate1, 0, 0, 0, 0, $newWidth, $newheight, $width, $height);
        imagejpeg($destination, $filePathDest, 100);
      } else {
        $destination = imagecreatetruecolor($width, $height);
        imagejpeg($rotate1, $filePathDest, 100);
      }
      imagejpeg($destination, $filePathDest, 100);
      //echo "newWidth: ".$newWidth. "newheight: ".$newheight."width: ".$width."height: ".$height;
    }

    // Reads the EXIF headers from an image file
    $exif = exif_read_data($filePathOrig, 'IFD0');
    // Dumps information about a variable
    $exif_orientation = $exif['Orientation'];
    if ( $rotate === '0' && !empty( $exif_orientation ) ) {
    // rotate based on exif['Orientation'] value
      switch ( $exif_orientation ) {
          case 3: case 4: $rotate = 180; break;
          case 5: case 6: $rotate = 270; break;
          case 7: case 8: $rotate =  90; break;
        }
    }

    img_resize("$filePathOrig", 200,  "$remote_path_small", $rotate);
    img_resize("$filePathOrig", 1000, "$remote_path_big"  , $rotate);
}