<?php 
// Create Connection
$conn = mysqli_connect('localhost', 'root', '', 'alarmdb');

// $search = !empty($_GET["search"]) ? $_GET["search"] : null;
   $search = isset($_GET['search']) ? $_GET['search'] : 'tomasek';

$queryFilter = "%".$search."%";
$query = "SELECT name, counter, prio, file FROM alarmtable WHERE name LIKE '$queryFilter'";

// Get Result
$result = mysqli_query($conn, $query);

// Fetch Data as array
$users = mysqli_fetch_all($result, MYSQLI_NUM);

// convert to JSON, true=array type
echo json_encode($users, true);