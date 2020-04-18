<?php 

include "../../rekreace/config/db.php";

// Create Connection
// $conn = mysqli_connect('localhost', 'root', '', 'alarmdb');

$request = isset($_GET['request']) ? $_GET['request'] : 0;
$search  = isset($_GET['search' ]) ? $_GET['search' ] : 'tomasek';

switch ($request){
    case 'select_all':
       $query = 'SELECT name, counter, prio, file, first, latest FROM alarm';
       break;
    case 'search':
        $queryFilter = "%".$search."%";
        $query = "SELECT name, counter, prio, file,  first, latest FROM alarm
            WHERE name   LIKE '$queryFilter'
               OR file   LIKE '$queryFilter'
               OR first  LIKE '$queryFilter'
               OR latest LIKE '$queryFilter'
            ";
        break;
    case 'count_all':
        $query = 'SELECT COUNT(id) FROM alarm';
        break;
    case 'sum_count':
        $query = 'SELECT SUM(counter) FROM alarm';
        break;
    case 'DISTINCT_alarm':
        $query = 'SELECT DISTINCT name FROM alarm ORDER BY name ASC';
        break;
        default:  $query = '';
  }

// Get Result
$result = mysqli_query($conn, $query);

// Fetch Data as array
$users = mysqli_fetch_all($result, MYSQLI_NUM);

// convert to JSON, true=array type
echo json_encode($users, true);