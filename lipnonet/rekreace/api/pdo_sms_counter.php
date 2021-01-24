<?php

    include_once '../config/cor.php';
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    header('Content-Type: application/json');

    // get username + password for mySQL query
    //$data = json_decode(file_get_contents("php://input"));
    //
    include_once '../config/Database.php';
    include_once 'models/Post_sms.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate booking post object
    $post = new Post($db);

    // Booking post query
    $result = $post->counter();

    echo json_encode( $result->fetch(PDO::FETCH_ASSOC) );

?>