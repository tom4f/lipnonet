<?php declare(strict_types=1);

// if image in update request ($dataUrl present) => upload file

function Image_resize( $size, $newWidth, $fotoGalleryOwner, $data ) {

  if (isset($data->dataUrl)) {
    
      $fileNumber = $data->id;  
      //$fileType   = $data->type;
      $dataUrl    = $data->dataUrl;
      $rotate     = (int)$data->rotate;

      $path = "../fotogalerie" . $fotoGalleryOwner . "/" . $fileNumber;
      $ORIG_IMG_PATH = $path . "o.jpg";
      $big   = $path . "b.jpg";
      $small = $path .  ".jpg";

      $filePathDest = $size == 'small' ? $small : $big;

      file_put_contents($ORIG_IMG_PATH, base64_decode(explode(',',$dataUrl)[1]));

        $imgOrig = imagecreatefromjpeg($ORIG_IMG_PATH);
        // Rotate
        if( $rotate == 90 || $rotate == 270 ) {
          list($height, $width) = getimagesize($ORIG_IMG_PATH);
        } else {
          list($width, $height) = getimagesize($ORIG_IMG_PATH);  
        }

        $rotatedImg = $rotate > 0 ? imagerotate($imgOrig, $rotate, 0) : $imgOrig;

        if ( $newWidth < $width ) {
          $newheight = (int) ( $height / ($width / $newWidth) );
          $destination = imagecreatetruecolor($newWidth, $newheight);
          imagecopyresampled($destination, $rotatedImg, 0, 0, 0, 0, $newWidth, $newheight, $width, $height);
          imagejpeg($destination, $filePathDest, 100);
        } else {
          if ( $rotate > 0 ) {
            imagejpeg($rotatedImg, $filePathDest, 100);
          } else {
            file_put_contents( $filePathDest, base64_decode(explode(',',$dataUrl)[1]));
          }
        }

      // Reads the EXIF headers from an image file
      $exif = exif_read_data($ORIG_IMG_PATH, 'IFD0');
      // Dumps information about a variable
      $exif_orientation = $exif['Orientation'];
      if ( $rotate === '0' && !empty( $exif_orientation ) ) {
      // rotate based on exif['Orientation'] value
        switch ( $exif_orientation ) {
            case 3: case 4: $rotate = 180; break;
            case 5: case 6: $rotate = 270; break;
            case 7: case 8: $rotate =  90; break;
          }
      }
  }
}