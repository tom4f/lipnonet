<?php 
// Create Connection
$conn = mysqli_connect('localhost', 'root', '', 'alarmdb');

$request = isset($_GET['request']) ? $_GET['request'] : 0;

switch ($request){
    case 'select_all':
       $query = 'SELECT name, counter, prio, file FROM alarmtable';
       break;
    case 'count_all':
        $query = 'SELECT COUNT(id) FROM alarmtable';
        break;
    case 'sum_count':
        $query = 'SELECT SUM(counter) FROM alarmtable';
        break;
    case 'DISTINCT_alarm':
        $query = 'SELECT DISTINCT name FROM alarmtable ORDER BY name ASC';
        break;
        default:  $query = '';
  }

// Get Result
$result = mysqli_query($conn, $query);

// Fetch Data as array
$users = mysqli_fetch_all($result, MYSQLI_NUM);

// convert to JSON, true=array type
echo json_encode($users, true);