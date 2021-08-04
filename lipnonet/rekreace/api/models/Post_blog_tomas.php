<?php
    class Post {
        // protected : the property or method can be accessed within the class and by classes derived from that class

        // private : the property or method can ONLY be accessed within the class
        private $conn;
        private $table = 'blog_tomas';

        //Post Properties
        public $id;
        public $title;
        public $title_url;
        public $body;
        public $image;
        public $date;
        public $intro;
        public $category;

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

            $where = $this->title_url
                        ? "WHERE title_url = '" . $this->title_url . "'"
                        : '';

            $query = "SELECT * 
                      FROM $this->table
                      $where
                      ORDER by date DESC";

            // Prepare statement
            // A prepared statement is a feature used to execute the same (or similar)
            // SQL statements repeatedly with high efficiency
           
            $this->title_url    = htmlspecialchars(strip_tags($this->title_url));
          
            // Bind data
            //$stmt->bindParam(':title_url', $this->title_url);

            try {
                $stmt = $this->conn->prepare($query);

                // Bind data

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
                            title = :title,
                            title_url = :title_url,
                            body = :body,
                            image = :image,
                            date = :date,
                            category = :category,
                            intro = :intro
                        WHERE id = :id";
          
            // Prepare statement
            $stmt = $this->conn->prepare($query);
          
            // Clean data
            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->title_url = htmlspecialchars(strip_tags($this->title_url));
            $this->body  = htmlspecialchars(strip_tags($this->body));
            $this->image = htmlspecialchars(strip_tags($this->image));
            $this->id    = htmlspecialchars(strip_tags($this->id));
            $this->date    = htmlspecialchars(strip_tags($this->date));
          
            // Bind data
            $stmt->bindParam(':title', $this->title);
            $stmt->bindParam(':title_url', $this->title_url);
            $stmt->bindParam(':body',  $this->body);
            $stmt->bindParam(':image', $this->image);
            $stmt->bindParam(':id',    $this->id);
            $stmt->bindParam(':date',    $this->date);
            $stmt->bindParam(':intro',    $this->intro);
            $stmt->bindParam(':category',    $this->category);


            // Execute query
            if($stmt->execute()) {
              return true;
            }
          
            // Print error if something goes wrong
            printf("Error: %s.\n", $stmt->error);
          
            return false;
          } 



                  // Update Post
        public function create() {
            // Create query
            $query = "INSERT INTO $this->table
                        SET
                            title = :title,
                            title_url = :title_url,
                            body = :body,
                            image = :image,
                            date = :date,
                            category = :category,
                            intro = :intro";
          
            // Prepare statement
            $stmt = $this->conn->prepare($query);
          
            // Clean data
            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->title_url = htmlspecialchars(strip_tags($this->title_url));
            $this->body  = htmlspecialchars(strip_tags($this->body));
            $this->image = htmlspecialchars(strip_tags($this->image));
            $this->date    = htmlspecialchars(strip_tags($this->date));
          
            // Bind data
            $stmt->bindParam(':title', $this->title);
            $stmt->bindParam(':title_url', $this->title_url);
            $stmt->bindParam(':body',  $this->body);
            $stmt->bindParam(':image', $this->image);
            $stmt->bindParam(':date',    $this->date);
            $stmt->bindParam(':intro',    $this->intro);
            $stmt->bindParam(':category',    $this->category);


            // Execute query
            if($stmt->execute()) {
              return true;
            }
          
            // Print error if something goes wrong
            printf("Error: %s.\n", $stmt->error);
          
            return false;
          } 


          // delete
          public function delete() {
            // Create query
            $query = "DELETE FROM $this->table
                        WHERE id = :id";
          
            // Prepare statement
            $stmt = $this->conn->prepare($query);
          
            // Clean data
            $this->id = htmlspecialchars(strip_tags($this->id));
          
            // Bind data
            $stmt->bindParam(':id', $this->id);

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