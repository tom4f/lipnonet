<?php
    
    // to work with COR
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    header('Content-Type: application/json');
    
    // get start + limit for mySQL query
    $data = json_decode(file_get_contents("php://input"));
    //
    if ( isset($data->start) ) $start = $data->start;
        else $start = 0;
    //
    if ( isset($data->limit)) $limit = $data->limit;
        else $limit = 31;

    include_once '../config/Database.php';
    include_once 'models/Post_pocasi.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate booking post object
    $post = new Post($db);

    // Booking pot query
    $result = $post->read($start, $limit);

    // Get row count
    // rowCount() returns the number of rows affected by the last
    // DELETE, INSERT, or UPDATE statement executed by
    // the corresponding PDOStatement object
    $num = $result->rowCount();

    // Check if any posts
    if($num > 0) {
        // Fetch all rows and return the result-set as an associative array
        $all_row = $result->fetchall(PDO::FETCH_ASSOC);

        // Turn to JSON & output
        echo json_encode($all_row);

    } else {
        // No posts
        echo json_encode(
        array('message' => 'No Posts Found')
      );
}

?>