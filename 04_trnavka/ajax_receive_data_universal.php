<?php 
// Create Connection
$connPHP7=mysqli_connect ('localhost', 'root', '', 'frymburkcom');
if(!$connPHP7) die("Can't connect to MySQL server!");
mysqli_query($connPHP7, "SET NAMES utf8");


$limit =  isset($_GET['limit'])  ? $_GET['limit']  : "";
$offset = isset($_GET['offset']) ? $_GET['offset'] : "";

$query = 'SELECT * FROM fotogalerie order by insertDate DESC LIMIT '.$limit.' OFFSET '.$offset;

// Get Result
//$result = mysqli_query($conn, $query);

if($result = mysqli_query($connPHP7, $query)){
} else {
  echo 'ERROR: '. mysqli_error($conn);
}

// Fetch Data as array
//$users = mysqli_fetch_all($result, MYSQLI_BOTH);
$users = mysqli_fetch_all($result, MYSQLI_ASSOC);
//$users = mysqli_fetch_array($result, MYSQLI_NUM);
//$users = mysqli_fetch_assoc($result);

// convert to JSON, true=array type
echo json_encode($users, true);