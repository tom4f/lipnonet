<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: PUT');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  
  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  // logins
  $users = array(
    'Pavel'   => ['192c12b0d4b594b0e02bd9b97b7b9df4', '_pavlik'   ],
    'Lucka'   => ['e1effe4b56633573edc20ace2a73ac72', '_lucka'    ],
    'Bedrich' => ['6b8936614987e4c8118481d050d6df3b', '_ubytovani']
  );

  //echo md5($users['Lucka'][0]);

  // by default no login = error status
  $webTokenCalculated = array('webToken' => 'error');
  // by default no webAccess = error status
  $webAccess = array('webAccess' => 'error');

  // check if user user is inside array $users
  foreach ($users as $index => $value){
    if ( ($data->user == $index) && (md5($data->password) == $value[0]) && ($data->fotoGalleryOwner == $value[1]) ) {
      $date = md5("" . Date('d') . Date('m') . Date('Y'));
      $webTokenCalculated = array('webToken' => md5($date));
      $webAccess = array('webAccess' => $value[1]);
    }
  }
  
  // send json webToken
  $posts_arr = array();
  array_push($posts_arr, $webTokenCalculated);
  array_push($posts_arr, $webAccess);
  echo json_encode($posts_arr);



