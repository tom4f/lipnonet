<?php 
// Create Connection
$conn = mysqli_connect('localhost', 'root', '', 'alarmdb');

$query = 'SELECT name, counter, prio, file FROM alarmtable';

// Get Result
$result = mysqli_query($conn, $query);

// Fetch Data
$users = mysqli_fetch_all($result, MYSQLI_NUM);

//echo json_encode($users, true);
echo $users;