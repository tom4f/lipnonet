<?php 
  class Post {
    // DB stuff
    private $conn;
    private $table = 'obsazenost';

    //Post Properties
    public $g_week;
    public $g_number;
    public $g_status;
    public $g_text;


 
    // Constructor with DB
    public function __construct($db) {
      $this->conn = $db;
    }

// Update Post
public function update() {
  // use global variable inside class - owner Pavlik, Lucka, ''
  global $fotoGalleryOwner;

  // Create query
  $query = 'UPDATE ' . $this->table . ' SET g' . $this->g_number . '_status="' . $this->g_status . '", g' . $this->g_number . '_text="' . $this->g_text . '" WHERE week="' . (-1 + $this->g_week) . '"';
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


}