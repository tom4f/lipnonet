<?php 
  class Post {
    // DB stuff
    private $conn;
    private $table = 'fotogalerie';

    //Post Properties
    public $id;
    public $date;
    public $text;
    public $autor;
    public $email;
    public $typ;
    public $header;
    public $votes;

 
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


    // Create Post
    public function create() {
      // Create query
      $query = 'INSERT INTO ' . $this->table . ' SET date = :date, text = :text, autor = :autor, email = :email, typ = :typ, header = :header';

      // Prepare statement
      $stmt = $this->conn->prepare($query);

      // Clean data
      $this->text =   htmlspecialchars(strip_tags($this->text));
      $this->autor =  htmlspecialchars(strip_tags($this->autor));
      $this->email =  htmlspecialchars(strip_tags($this->email));
      $this->header = htmlspecialchars(strip_tags($this->header));
      $this->typ =    htmlspecialchars(strip_tags($this->typ));

      // Bind data
      $stmt->bindParam(':date',       $this->date);
      $stmt->bindParam(':text',       $this->text);
      $stmt->bindParam(':autor',      $this->autor);
      $stmt->bindParam(':email',      $this->email);
      $stmt->bindParam(':typ',        $this->typ);
      $stmt->bindParam(':header',     $this->header);

      // Execute query
      if($stmt->execute()) {
        return true;
  }

  // Print error if something goes wrong
  printf("Error: %s.\n", $stmt->error);

  return false;
}



}