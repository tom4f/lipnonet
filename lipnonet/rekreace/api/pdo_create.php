<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../config/Database.php';
  include_once 'models/Post.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate blog post object
  $post = new Post($db);

  // Get raw posted data - Array from JSON
  $data = json_decode(file_get_contents("php://input"));

  $post->date =       $data->date;
  $post->text =       $data->text;
  $post->autor =      $data->autor;
  $post->email =      $data->email;
  $post->typ =        $data->typ;
  $post->header =     $data->header;

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

  
  $fileNumber =   $data->name;
  $fileType =   $data->type;
  $dataUrl =    $data->dataUrl;

  $rotate =    $data->rotate;

  $remote_folder="../fotogalerie/";

  $filePathOrig = $remote_folder . $fileNumber . "o.jpg";;
  file_put_contents($filePathOrig, base64_decode(explode(',',$dataUrl)[1]));

	$remote_path = $remote_folder . $fileNumber . ".jpg";
	$remote_path1 =$remote_folder . $fileNumber . "b.jpg";

	function img_resize($filePathOrig, $newwidth, $filePathDest, $rotate){
    $source = imagecreatefromjpeg($filePathOrig);
    // Rotate
    if ($rotate > 0) {
        $rotate = imagerotate($source, $rotate, 0);
        list($height, $width) = getimagesize($filePathOrig);
     } else {
        $rotate = $source; 
        list($width, $height) = getimagesize($filePathOrig);
      }

		$newheight = $height / ($width / $newwidth);
		$destination = imagecreatetruecolor($newwidth, $newheight);
		imagecopyresampled($destination, $rotate, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
		imagejpeg($destination, $filePathDest, 100);
	}

	img_resize("$filePathOrig", 100,  "$remote_path",  $rotate);
	img_resize("$filePathOrig", 1000, "$remote_path1", $rotate);