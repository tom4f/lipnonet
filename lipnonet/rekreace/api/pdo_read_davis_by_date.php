<?php
    
    // to work with COR
    include_once '../config/cor.php';
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    header('Content-Type: application/json');
    
    // get start + limit + orderBy for mySQL query
    $data = json_decode(file_get_contents("php://input"));
    //
    if ( isset($data->start) ) $start = $data->start;
        else $start = '2019-01-01';
    //
    if ( isset($data->end)) $end = $data->end;
        else $end = '2019-12-31';

    if ( isset($data->orderBy)) $orderBy = $data->orderBy;
        else $orderBy = 'date';

    if ( isset($data->sort)) $sort = $data->sort;
        else $sort = 'DESC';

    include_once '../config/Database.php';
    include_once 'models/Post_davis.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate booking post object
    $post = new Post($db);

    // Booking pot query
    $result = $post->readByDate($start, $end, $orderBy, $sort);

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