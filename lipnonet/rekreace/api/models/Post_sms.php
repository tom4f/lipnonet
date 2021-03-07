<?php
    class Post {
        // protected : the property or method can be accessed within the class and by classes derived from that class

        // private : the property or method can ONLY be accessed within the class
        private $conn;
        private $table = 'sms';

        //Post Properties
        public $id;
        public $name;
        public $email;
        public $sms;
        public $username;
        public $password;
        public $days;
        public $todayRainLimit;
        public $todayRainSent;

        public $identification;

        // public : the property or method can be accessed from everywhere. This is default
        // public $week;

        
        // Inheritance in OOP = When a class derives from another class.

        // Constructor with DB
        // The __construct() function creates a new SimpleXMLElement object
        public function __construct($db) {
            $this->conn = $db;
        }

        // [0] Get Posts
        public function read(){
            // Create query
            $query = "SELECT * 
                      FROM $this->table 
                      WHERE
                        (username = :username OR email = :username)
                      AND password = :password";

            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency

            // Clean data
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->password = htmlspecialchars(strip_tags($this->password));
            
            try {
                $stmt = $this->conn->prepare($query);

                // Bind data
                $stmt->bindParam(':username', $this->username);
                $stmt->bindParam(':password', $this->password);


                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                echo '<pre>';
                echo $query;
                echo '</pre>';
                echo $Exception->getMessage();
                die;
            }
            return $stmt;
        }

        // [0] Get Posts
        public function pasw(){
            // Create query
            $query = "SELECT username, email, password
                      FROM $this->table
                      WHERE (username = :identification OR email = :identification)";

            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency
            // Clean data
            $this->identification = htmlspecialchars(strip_tags($this->identification));

            try {
                $stmt = $this->conn->prepare($query);

                // Bind data
                $stmt->bindParam(':identification', $this->identification);
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                echo '<pre>';
                echo $query;
                echo '</pre>';
                echo $Exception->getMessage();
                die;
            }

            return $stmt;
        }


        // Update Post
        public function update() {
            // Create query
            $query = "UPDATE $this->table
                        SET
                            name = :name,
                            email = :email,
                            sms = :sms,
                            username = :username,
                            password = :password,
                            days = :days,
                            todayRainLimit = :todayRainLimit,
                            todayRainSent = :todayRainSent,
                            lastUpdate = now()
                        WHERE id = :id";
          
            // Prepare statement
            $stmt = $this->conn->prepare($query);
          
            // Clean data
            $this->name     = htmlspecialchars(strip_tags($this->name));
            $this->email    = htmlspecialchars(strip_tags($this->email));
            $this->sms      = htmlspecialchars(strip_tags($this->sms));

            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->password = htmlspecialchars(strip_tags($this->password));
            $this->days     = htmlspecialchars(strip_tags($this->days));
            $this->todayRainLimit     = htmlspecialchars(strip_tags($this->todayRainLimit));
            $this->todayRainSent     = htmlspecialchars(strip_tags($this->todayRainSent));

            $this->id       = htmlspecialchars(strip_tags($this->id));
          
            // Bind data
            $stmt->bindParam(':name',     $this->name);
            $stmt->bindParam(':email',    $this->email);
            $stmt->bindParam(':sms',      $this->sms);
            $stmt->bindParam(':username', $this->username);
            $stmt->bindParam(':password', $this->password);
            $stmt->bindParam(':days',     $this->days);    
            $stmt->bindParam(':todayRainLimit',     $this->todayRainLimit);    
            $stmt->bindParam(':todayRainSent',      $this->todayRainSent);    


            $stmt->bindParam(':id',       $this->id);
          
            // Execute query
            if($stmt->execute()) {
              return true;
            }
          
            // Print error if something goes wrong
            printf("Error: %s.\n", $stmt->error);
          
            return false;
          } 

        // New user
        public function new() {
            // Create query
            $randPasw = mt_rand(10000,100000);
            $query = "INSERT INTO $this->table
                        SET
                        email = :email,
                        sms = 15,
                        username = :username,
                        password = $randPasw,
                        days = 0";
            
            // Prepare statement
            $stmt = $this->conn->prepare($query);
            
            // Clean data
            $this->username = htmlspecialchars(strip_tags($this->username));
            $this->email    = htmlspecialchars(strip_tags($this->email));
            
            // Bind data
            $stmt->bindParam(':email',    $this->email);
            $stmt->bindParam(':username', $this->username);
            
            // Execute query
            if($stmt->execute()) {
                return $randPasw;
            }
            
            // Print error if something goes wrong
            printf("Error: %s.\n", $stmt->error);
            
            return false;
        } 

        public function testusername(){
            // Create query
            $query = "SELECT * 
                        FROM $this->table 
                        WHERE username = :username";

            // Clean data
            $this->username = htmlspecialchars(strip_tags($this->username));
            
            try {
                $stmt = $this->conn->prepare($query);

                // Bind data
                $stmt->bindParam(':username', $this->username);
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                echo '<pre>';
                echo $query;
                echo '</pre>';
                echo $Exception->getMessage();
                die;
            }
            return $stmt;
        }

        public function testemail(){
            // Create query
            $query = "SELECT * 
                        FROM $this->table 
                        WHERE email = :email";


            // Clean data
            $this->email = htmlspecialchars(strip_tags($this->email));
            
            try {
                $stmt = $this->conn->prepare($query);

                // Bind data
                $stmt->bindParam(':email', $this->email);
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                echo '<pre>';
                echo $query;
                echo '</pre>';
                echo $Exception->getMessage();
                die;
            }
            return $stmt;
        }

        public function counter(){
            // Create query
            $query = "SELECT COUNT(*) AS count FROM sms";

           
            try {
                $stmt = $this->conn->prepare($query);
                $stmt->execute();
            }
            catch( PDOException $Exception ) {
                echo '<pre>';
                echo $query;
                echo '</pre>';
                echo $Exception->getMessage();
                die;
            }
            return $stmt;
        }

    }
?>