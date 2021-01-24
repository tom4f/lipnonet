<?php

    include_once '../config/cor.php';
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');
    header('Content-Type: application/json');

    // get username + email for mySQL query
    $data = json_decode(file_get_contents("php://input"));
    //
    if ( isset($data->username) ) $username = $data->username;
        else $username = '';

    if ( isset($data->email) ) $email = $data->email;
        else $email = '';

    include_once '../config/Database.php';
    include_once 'models/Post_sms.php';

    // Instantiate DB & connect
    $database = new Database();
    $db = $database->connect();

    // Instantiate booking post object
    $post = new Post($db);

    $post->username = $username;
    $post->email    = $email;

    $testusername = $post->testusername();
    $testemail    = $post->testemail();

    $numusername = $testusername->rowCount();
    $numemail    = $testemail->rowCount();

    if($numusername > 0) {
        echo json_encode( array( 'sms_new' => 'user_exists') );
    } elseif ($numemail > 0) {
        echo json_encode( array( 'sms_new' => 'email_exists') );
    } else {

    // Booking post query
    if($passw = $post->new()) {
        echo json_encode(
          array(
              'sms_new' => 'user_added',
              'username'=> $username,
              'email'   => $email,
              'password'=> $passw
            )
        );


        $text1 = "
            <html>
                <head>
                    <title>LIPNO - Posílání informací o počasí na mobil / email</title>
                </head>
                <body>
                <h2>Zpráva ze stránky <a href='https://www.frymburk.com/4f/enter.php'>https://www.frymburk.com/4f/enter.php</a></h2>
                    <ul>".
                        "<li>Username : ".$username."</li>".    
                        "<li>E-mail : ".$email."</li>".
                        "<li>Password : ".$passw."</li>".
                        "<li>Datum a čas : " . Date("d.m.Y H:i:s")."</li>".
                    "</ul>
                    <h2>LIPNOnet tým</h2>
                </body>
            </html>
        ";

        $text = ", Password : ".$passw
        .", Username: ".$username
        .", E-mail=".$email
        .", LIPNOnet.cz";

        //$headers  = "MIME-Version: 1.0" . "\r\n";;
        //$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        //$headers .= "From: ubytovani@lipnonet.cz";

        $headers = "From: 4f@lipno.net\n";
        
        mail($email, "MeteoAlert Registrace", $text , $headers);

      // if update failed
      } else {
        echo json_encode(
          array('sms_new' => 'User Not Added :-(')
        );
      }
    }

?>