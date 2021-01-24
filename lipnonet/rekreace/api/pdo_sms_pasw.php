<?php

    include_once '../config/cor.php';
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    header('Content-Type: application/json');

    // get username + email for mySQL query
    $data = json_decode(file_get_contents("php://input"));
    //
    if ( isset($data->identification) ) $identification = $data->identification;
        else $identification = '';

    include_once '../config/Database.php';
    include_once 'models/Post_sms.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate booking post object
    $post = new Post($db);

    $post->identification = $identification;

    // Booking post query
    $result = $post->pasw();

    // Get row count
    // rowCount() returns the number of rows affected by the last
    // DELETE, INSERT, or UPDATE statement executed by
    // the corresponding PDOStatement object
    $num = $result->rowCount();

    // Check if any posts
    if($num > 0) {
        // Fetch all rows and return the result-set as an associative array
        $all_row = $result->fetch(PDO::FETCH_ASSOC);

        // Turn to JSON & output
        //echo json_encode($all_row);
        echo json_encode( array(
            'sms_pasw' => 'password_sent',
            'email' => $all_row['email'])
        );

        $text_old = "
            <html>
                <head>
                    <title>LIPNO - Posílání informací o počasí na mobil / email</title>
                </head>
                <body>
                <h2>Zpráva ze stránky <a href='https://www.frymburk.com/4f/enter.php'>https://www.frymburk.com/4f/enter.php</a></h2>
                    <ul>".
                        "<li>E-mail : ".$all_row['email']."</li>".
                        "<li>Heslo : ".$all_row['password']."</li>".
                        "<li>Datum a čas : " . Date("d.m.Y H:i:s")."</li>".
                    "</ul>
                    <h2>LIPNOnet tým</h2>
                </body>
            </html>
        ";

        $text = "Heslo=".$all_row['password']
        .", E-mail=".$all_row['email']
        .", LIPNOnet.cz";

        //$headers  = "MIME-Version: 1.0" . "\r\n";;
        //$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        //$headers .= "From: ubytovani@lipnonet.cz";

        $headers = "From: 4f@lipno.net\n";

        mail($all_row['email'], "MeteoAlert Heslo", $text , $headers);

    } else {
        // No posts
        echo json_encode( array('sms_pasw' => 'error') );
}

?>