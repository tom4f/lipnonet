<?php

$str_json = file_get_contents('php://input');
$arr      = json_decode($str_json, true);

// Connect to a database
$conn = mysqli_connect('localhost', 'root', '', 'alarmdb');

echo 'Processing...';

for ($i=0; $i<=(Count($arr)-1); $i++)
  {
    $name =     $arr[$i][0];
    $counter =  $arr[$i][1];
    $prio =     $arr[$i][2];
    $file =     $arr[$i][3];

    $query = "INSERT INTO alarmtable (name, counter, prio, file) VALUES('$name', '$counter', '$prio', '$file')";

    if(mysqli_query($conn, $query)){
      echo 'OK: '.$query.'<br>';
      } else {
        echo 'ERROR: '. mysqli_error($conn);
      }
    }






