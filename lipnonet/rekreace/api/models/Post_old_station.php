<?php
    class Post {
        // protected : the property or method can be accessed within the class and by classes derived from that class

        // private : the property or method can ONLY be accessed within the class
        private $conn;
        private $table = 'wind';

        // public : the property or method can be accessed from everywhere. This is default
        // public $week;

        
        // Inheritance in OOP = When a class derives from another class.

        // Constructor with DB
        // The __construct() function creates a new SimpleXMLElement object
        public function __construct($db) {
            $this->conn = $db;
        }

        // [0] Get Posts
        public function read($start = 0, $limit = 31, $orderBy = 'date', $sort = 'DESC'){
            // Create query
            $query = "SELECT * FROM " . $this->table . " WHERE date <= '2012-08-22' order by " . $orderBy . " " . $sort . " LIMIT " . $start . ',' . $limit;
        //  $query = "SELECT * FROM wind WHERE date >= '2014-01-01' AND date <= '2015-01-01'";

            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency
            $stmt = $this->conn->prepare($query);
            // Execute query
            $stmt->execute();
            return $stmt;
        }

    }
?>