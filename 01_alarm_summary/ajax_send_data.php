<?php

include "../../rekreace/config/db.php";

$str_json = file_get_contents('php://input');
$arr      = json_decode($str_json, true);

// Connect to a database
//$conn = mysqli_connect('localhost', 'root', '', 'alarmdb');

echo 'Processing...';

for ($i=0; $i<=(Count($arr)-1); $i++)
  {
    $name =     $arr[$i][0];
    $counter =  $arr[$i][1];
    $prio =     $arr[$i][2];
    $file =     $arr[$i][3];
    $first =    $arr[$i][4];
    $latest =   $arr[$i][5];

    $query = "INSERT INTO alarm (name, counter, prio, file, first, latest) VALUES('$name', '$counter', '$prio', '$file', '$first', '$latest')";

    if(mysqli_query($conn, $query)){
      echo 'OK: '.$query.'<br>';
      } else {
        echo 'ERROR: '. mysqli_error($conn);
      }
    }






