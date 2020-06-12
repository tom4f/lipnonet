<?php 
  class Post {
    // DB stuff
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
 
    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

// Update Post
public function update() {
  // use global variable inside class - owner Pavlik, Lucka, ''
  global $fotoGalleryOwner;

  // Create query
  $query = 'UPDATE ' . $this->table . ' SET ' . $this->key . '="' . $this->value .'" WHERE datum="' . $this->datum . '"' ;
  //printf($query);

  // Prepare statement
  $stmt = $this->conn->prepare($query);

  // Clean data
  // $this->text =   htmlspecialchars(strip_tags($this->text));
  // $this->autor =  htmlspecialchars(strip_tags($this->autor));
  // $this->email =  htmlspecialchars(strip_tags($this->email));


  // Bind data
  //$stmt->bindParam(':g_status',    $this->g_status);
  //$stmt->bindParam(':g_text',      $this->g_text);
  //$stmt->bindParam(':g_week',      $this->g_week);

  // Execute query
  if($stmt->execute()) {
    return true;
  }

  // Print error if something goes wrong
  printf("Error: %s.\n", $stmt->error);

  return false;
} 


    // Create Post
    public function create() {
      // use global variable inside class - owner Pavlik, Lucka, ''
      global $fotoGalleryOwner;
      // Create query
      $query = 'INSERT INTO ' . $this->table . $fotoGalleryOwner . '
                  SET date = :date, text = :text, autor = :autor, email = :email, typ = :typ, header = :header';

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