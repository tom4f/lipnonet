<?php 
  class Post {
    // DB stuff
    private $conn;
    private $table = 'forum';

    //Post Properties
    //public $id;
    public $text;
    public $jmeno;
    public $email;
    public $typ;
 
    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }



    // [0] Get Posts
    public function read() {
      // Create query
      $query = 'SELECT * FROM ' . $this->table . ' WHERE typ < 4 order by datum DESC';
      // Prepare statement
      $stmt = $this->conn->prepare($query);
      // Execute query
      $stmt->execute();
      return $stmt;
    }

    // [0] Get last (max) id
    public function readLastId() {
      // Create query
      //$query = 'SELECT MAX(id) AS id FROM ' . $this->table;
      $query = "SHOW TABLE STATUS LIKE '" . $this->table . "'";
      // Prepare statement
      $stmt = $this->conn->prepare($query);
      // Execute query
      $stmt->execute();
      return $stmt;
    }

    // Create Post
    public function create() {
      // Create query
      $query = 'INSERT INTO ' . $this->table . ' SET text = :text, jmeno = :jmeno, email = :email, typ = :typ ';

      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Clean data
      $this->text =   htmlspecialchars(strip_tags($this->text));
      $this->jmeno =  htmlspecialchars(strip_tags($this->jmeno));
      $this->email =  htmlspecialchars(strip_tags($this->email));
      //$this->header = htmlspecialchars(strip_tags($this->header));
      $this->typ =    htmlspecialchars(strip_tags($this->typ));

      // Bind data
      //$stmt->bindParam(':datum',       $this->datum);
      $stmt->bindParam(':text',       $this->text);
      $stmt->bindParam(':jmeno',      $this->jmeno);
      $stmt->bindParam(':email',      $this->email);
      $stmt->bindParam(':typ',        $this->typ);
      //$stmt->bindParam(':header',     $this->header);

      // Execute query if 'text' is not empty to avoid 
      // Cross-Origin Resource Sharing (CORS) second OPTION request
      if (($this->text) != '') {
        if($stmt->execute()) {
          return true;
        }
  }

  // Print error if something goes wrong
  printf("Error: %s.\n", $stmt->error);

  return false;
}



}