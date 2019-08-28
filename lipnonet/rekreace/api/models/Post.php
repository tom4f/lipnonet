<?php 
  class Post {
    // DB stuff
    private $conn;
    private $table = 'fotogalerie';

    // Post Properties
    // public $id;
    // public $date;
    // public $time;
    // public $text;
    // public $autor;
    // public $email;
    // public $typ;
    // public $header;
    // public $votes;
    // public $insertDate;
    // public $insertTime;

    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }



    // [0] Get Posts
    public function read() {
      // Create query
      $query = 'SELECT * FROM ' . $this->table . ' order by insertDate DESC';
      // Prepare statement
      $stmt = $this->conn->prepare($query);
      // Execute query
      $stmt->execute();
      return $stmt;
    }
}