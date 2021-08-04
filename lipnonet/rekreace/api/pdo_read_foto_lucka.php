<?php 
  // Headers
  include_once '../config/cor.php';
  header('Access-Control-Allow-Methods: GET');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
  header('Content-Type: application/json');

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  include_once '../config/Database.php';
  include_once 'models/Post.php';

  // Instantiate DB & connect
  $database = new Database();
  $db = $database->connect();

  // Instantiate fotogalery post object
  $post = new Post($db);

  // Fotogalery post query
  $result = $post->read_lucka();
  // Get row count
  
  
  
  
  
  $num = $result->rowCount();

    // Check if any posts
    if($num > 0) {
        // Fetch all rows and return the result-set as an associative array
        $all_row = $result->fetchall(PDO::FETCH_ASSOC);

        // Turn to JSON & output
        echo json_encode($all_row);

    } else {
    // No Posts
    echo json_encode(
      array('message' => 'No Posts Found')
    );
  }

?>