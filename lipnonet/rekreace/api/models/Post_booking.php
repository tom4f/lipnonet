<?php
    class Post {
        // protected : the property or method can be accessed within the class and by classes derived from that class

        // private : the property or method can ONLY be accessed within the class
        private $conn;
        private $table = 'obsazenost';

        // public : the property or method can be accessed from everywhere. This is default
        public $week;
        public $g1_status;
        public $g1_text;
        public $g2_status;
        public $g2_text;
        public $g3_status;
        public $g3_text;
        
        // Inheritance in OOP = When a class derives from another class.

        // Constructor with DB
        // The __construct() function creates a new SimpleXMLElement object
        public function __construct($db) {
            $this->conn = $db;
        }

        // [0] Get Posts
        public function read(){
            // Create query
            $query = 'SELECT * FROM ' . $this->table . ' order by week';
            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency
            $stmt = $this->conn->prepare($query);
            // Execute query
            $stmt->execute();
            return $stmt;
        }

        // Update Post
        public function update() {
            // use global variable inside class - owner Pavlik, Lucka, ''

            // week to be deleted
            $delweek = $this->week - 1;

            // Create query
            $query = "UPDATE " . $this->table  . "
                        SET
                        g1_status=0, g1_text='',
                        g2_status=0, g2_text='',
                        g3_status=0, g3_text=''
                        WHERE week=$delweek";
        
            // Prepare statement
            $stmt = $this->conn->prepare($query);
        
            // Execute query
            if($stmt->execute()) {
            return true;
            }
        
            // Print error if something goes wrong
            printf("Error: %s.\n", $stmt->error);
        
            return false;
        } 
    }
?>