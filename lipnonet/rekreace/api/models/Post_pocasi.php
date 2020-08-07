<?php
    class Post {
        // protected : the property or method can be accessed within the class and by classes derived from that class

        // private : the property or method can ONLY be accessed within the class
        private $conn;
        private $table = 'pocasi';

        //Post Properties
        public $datum;
        public $hladina;
        public $odtok;
        public $pritok;
        public $voda;
        public $vzduch;
        public $pocasi;

        public $key;
        public $value;

        // public : the property or method can be accessed from everywhere. This is default
        
        // Inheritance in OOP = When a class derives from another class.

        // Constructor with DB
        // The __construct() function creates a new SimpleXMLElement object
        public function __construct($db) {
            $this->conn = $db;
        }

        // [0] Get Posts
        public function read($start = 0, $limit = 31, $orderBy = 'datum', $sort = 'DESC'){
            // Create query
            $query = "SELECT * FROM $this->table order by $orderBy $sort LIMIT $start,$limit";

            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency
            $stmt = $this->conn->prepare($query);
            // Execute query
            // $stmt->execute();
            // return $stmt;
 
            try {
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                return(false);
            }
            return($stmt);
        }

        // Read Pocasi by Date
        public function readByDate($start = '2019-01-01', $end = '2019-12-31', $orderBy = 'datum', $sort = 'DESC'){
            // Create query
            $query = "SELECT * FROM $this->table WHERE datum >= '$start' AND datum <= '$end' order by $orderBy $sort";

            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency
            $stmt = $this->conn->prepare($query);
            // Execute query
            // $stmt->execute();
            // return $stmt;
    
            try {
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                return(false);
            }
            return($stmt);
        }


        // Update Post
        public function update() {
            // Create query
            //$query = 'UPDATE ' . $this->table . ' SET ' . $this->key . '="' . $this->value .'" WHERE datum="' . $this->datum . '"' ;
            $query = "UPDATE $this->table SET $this->key = :value  WHERE datum = :datum" ;

            // Prepare statement
            $stmt = $this->conn->prepare($query);
        
            // Clean data
            $this->datum = htmlspecialchars(strip_tags($this->datum));
            //$this->key   = htmlspecialchars(strip_tags($this->key));
            $this->value = htmlspecialchars(strip_tags($this->value));

            // Bind data
            $stmt->bindParam(':datum', $this->datum);
            //$stmt->bindParam(':key'  , $this->key);
            $stmt->bindParam(':value', $this->value);

            // Execute query
            try {
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                //$message = $Exception->getMessage();
                //$code = (int)$Exception->getCode();
                //printf($message);
                return(false);
            }
            return(true);
        } 
        

        // Create Post
        public function create() {
            // use global variable inside class - owner Pavlik, Lucka, ''
            // global $fotoGalleryOwner;
            // Create query
            $query = "INSERT INTO $this->table 
                        SET
                            datum   = :datum,
                            hladina = :hladina,
                            odtok   = :odtok,
                            pritok  = :pritok,
                            voda    = :voda,
                            vzduch  = :vzduch,
                            pocasi  = :pocasi";

            // Prepare statement
            $stmt = $this->conn->prepare($query);
    
            // Clean data
            $this->datum   = htmlspecialchars(strip_tags($this->datum));
            $this->hladina = htmlspecialchars(strip_tags($this->hladina));
            $this->odtok   = htmlspecialchars(strip_tags($this->odtok));
            $this->pritok  = htmlspecialchars(strip_tags($this->pritok));
            $this->voda    = htmlspecialchars(strip_tags($this->voda));
            $this->vzduch  = htmlspecialchars(strip_tags($this->vzduch));
            $this->pocasi  = htmlspecialchars(strip_tags($this->pocasi));
    
            // Bind data
            $stmt->bindParam(':datum',      $this->datum);
            $stmt->bindParam(':hladina',    $this->hladina);
            $stmt->bindParam(':odtok',      $this->odtok);
            $stmt->bindParam(':pritok',     $this->pritok);
            $stmt->bindParam(':voda',       $this->voda);
            $stmt->bindParam(':vzduch',     $this->vzduch);
            $stmt->bindParam(':pocasi',     $this->pocasi);
    
        try {
            $stmt->execute();
        }
        catch( PDOException $Exception ) {
            $message = $Exception->getMessage();
            $code = (int)$Exception->getCode();
            //printf($message);
            //printf($code);
            return(false);
        }
        return(true);
    }

        // Delete Post
        public function delete() {
            // Create query
            $query = "DELETE FROM $this->table WHERE datum = :datum";
            // Prepare statement
            $stmt = $this->conn->prepare($query);
            // Clean data
            $this->datum = htmlspecialchars(strip_tags($this->datum));
            // Bind data
            $stmt->bindParam(':datum', $this->datum);

            try {
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                return(false);
            }
            return(true);
        } 

    }
?>