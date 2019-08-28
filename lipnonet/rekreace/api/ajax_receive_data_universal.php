<?php 
// Create Connection
include "../config/db.php";

if(!$connPHP7) die("Can't connect to MySQL server!");
mysqli_query($connPHP7, "SET NAMES utf8");

$query = 'SELECT * FROM fotogalerie order by insertDate DESC';

if($result = mysqli_query($connPHP7, $query)){
} else {
  echo 'ERROR: '. mysqli_error($conn);
}

// Fetch Data as array
$users = mysqli_fetch_all($result, MYSQLI_ASSOC);

// convert to JSON, true=array type
echo json_encode($users, true);

?>