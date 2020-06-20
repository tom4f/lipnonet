<?php
    // Headers
    include_once '../config/cor.php';
    header('Content-Type: application/json');

    include_once '../config/Database.php';
    include_once 'models/Post_booking.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate booking post object
    $post = new Post($db);

    // Booking pot query
    $result = $post->read();

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