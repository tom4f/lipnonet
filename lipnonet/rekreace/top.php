<!DOCTYPE html>
<html>
<head>
  <?php
      // PHP4 // $script_name=$SCRIPT_NAME;
      $script_name=$_SERVER["SCRIPT_NAME"];
      $script_name2title = Array (
        "/rekreace/index.php" => "Úvodní strana",
        "/rekreace/rekreace.php" => "Dovolená",
        "/rekreace/masaze.php" => "Masáže",
        "/rekreace/fotogalerie.html" => "Foto galerie",
        "/rekreace/frymburk.php" => "Obec, Městys",
        "/rekreace/aktuality.php" => "Meteostanice, počasí",
        "/rekreace/kniha.php" => "Diskusní fórum",
        "/rekreace/email.php" => "Email",
        "/rekreace/formular.php" => "Formulář, objednávka",
        "/rekreace/kontakt.php" => "Cesta k nám",
        "/rekreace/garsonka.php" => "Garsonka, apartmán, pokoj, ceník",
        "/rekreace/lipno.php" => "Jezero, voda, přehrada",
        "/rekreace/masaze.php" => "Masáže, reflexní, lymfa, celulitida, klasická",
        "/rekreace/masaze_reflex.php" => "Masáže, reflexní, lymfa, celulitida, klasická",
        "/rekreace/masaze_lymfa.php" => "Masáže, reflexní, lymfa, celulitida, klasická",
        "/rekreace/masaze_de.php" => "klassische Zellulitis Reflexmassage lymphatische Massage",
        "/rekreace/masaze_reflex_de.php" => "klassische Zellulitis Reflexmassage lymphatische Massage",
        "/rekreace/masaze_lymfa_de.php" => "klassische Zellulitis Reflexmassage lymphatische Massage",
        "/rekreace/vybaveni.php" => "Vybavení",
        "/rekreace/profisolar.php" => "Solární, ohřev, panel, voda, profislolar",
        "/rekreace/ceny.php" => "Ceny",
        "/rekreace/davis.php" => "Meteostanice Davis Vantage Pro 2",
        "/rekreace/webcam_archive.php" => "Výhled na vodu",  
        "/rekreace/webcam_ip_archive.php" => "Výhled na vodu"
        );
      include("../rekreace/db.php");// localhost, reality
  ?>
  <title>LIPNO FRYMBURK rekreace ubytování U Kučerů On-line kamera <?php echo $script_name2title[$script_name]; ?></title> 
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 

  <!-- fotogalery links start -->
  <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
        integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
        crossorigin="anonymous"
    />
  <link rel="stylesheet" href="css/style.css">
  <!-- fotogalery links end -->
  
  <link rel="stylesheet" href="style.css">
  <meta name="Robots" content="index, follow"> 
  <meta http-equiv="cache-control" content="no-cache">
  <meta name="Author" content="Ing. Tomáš Kučera, Tom4F@seznam.cz">
  <meta name="Keywords" content="Lipno, lipensko, Frymburk, jezero, lake, Vltava, šumava, houby, dovolena, rekreace, kamera, meteostanice, Kramolín, brusle, solární, panely, ohřev, vody, Apricus">
  <meta name="description" content="Ubytování na břehu lipenského jezera v malebném městečku Frymburk. Aktuální počasí na Lipně, webkamera, teplota, vítr, srážky. Solární ohřev vody">
</head>

<?php
  // PHP4 // $domain=$_SERVER_VARS['HTTP_HOST'];
  $domain=$_SERVER['HTTP_HOST']; 
  if ($domain == "www.lipnonet.cz")  include "google_analytics_lipnonet_cz.js";
  if ($domain == "www.lipno.net")    include "google_analytics_lipno_net.js";
  if ($domain == "www.frymburk.com") include "google_analytics_frymburk_com.js";
  if ($domain == "www.frymburk.eu")  include "google_analytics_frymburk_eu.js";
?>

<body>

<div class="container">
  <div class="header">
        <?php
          if ($script_name!="/rekreace/index.php") echo "<a class=\"menu\" href=\"index.php\" target=\"_top\">Start</a>";
            else echo "<a class=\"menu\" href=\"index.php\" target=\"_top\"><font color=\"yellow\">Start</font></a>";
        ?>
        <b>--> </b>
        <?php
          if ($script_name!="/rekreace/rekreace.php") echo " <a class=\"menu\" href=\"rekreace.php\" target=\"_top\">Apartmány</a>";
            else echo " <a class=\"menu\" href=\"rekreace.php\" target=\"_top\"><font color=\"yellow\">Apartmány</font></a>";
          if ($script_name!="/rekreace/formular.php") echo " <a class=\"menu\" href=\"formular.php\" target=\"_top\">Termíny+Objednávka</a>";
            else echo " <a class=\"menu\" href=\"formular.php\" target=\"_top\"><font color=\"yellow\">Termíny+Objednávka</font></a>";
          if ($script_name!="/rekreace/ceny.php") echo " <a class=\"menu\" href=\"ceny.php\" target=\"_top\">Ceny</a>";
            else echo " <a class=\"menu\" href=\"ceny.php\" target=\"_top\"><font color=\"yellow\">Ceny</font></a>";
          if ($script_name!="/rekreace/kontakt.php") echo " <a class=\"menu\" href=\"kontakt.php\" target=\"_top\">Kontakt</a>";
            else echo " <a class=\"menu\" href=\"kontakt.php\" target=\"_top\"><font color=\"yellow\">Kontakt</font></a>";
          if ($script_name!="/rekreace/frymburk.php") echo " <a class=\"menu\" href=\"frymburk.php\" target=\"_top\">O Frymburku</a>";
            else echo " <a class=\"menu\" href=\"frymburk.php\" target=\"_top\"><font color=\"yellow\">O Frymburku</font></a>";
        ?>
  </div>

  <div class="mainpictures"><a href="rekreace.php"><img class="img" src="images/main_zima.jpg" HEIGHT="100" alt="Ubytování u Kučerů ve Frymburku - zima"></a><a href="rekreace.php"><img class="img" src="images/main.jpg" height="100" alt="Ubytování u Kučerů ve Frymburku"></a><a href="rekreace.php"><img class="img" src="images/main_leto.jpg" WEIGHT=100 alt="Ubytování u Kučerů ve Frymburku - léto"></a></div>

  <div class="header">
      <b>--> </b>
  <?php
    if ($script_name!="/rekreace/webcam_ip_archive.php") echo " <a class=\"menu\" href=\"webcam_ip_archive.php\" target=\"_top\">Webkamera_archív</a>";
      else echo " <a class=\"menu\" href=\"webcam_ip_archive.php\" target=\"_top\"><font color=\"yellow\">Webkamera_archív</font></a>";
    if ($script_name!="/rekreace/aktuality.php") echo " <a class=\"menu\" href=\"aktuality.php\" target=\"_top\">Meteostanice</a>";
      else echo " <a class=\"menu\" href=\"aktuality.php\" target=\"_top\"><font color=\"yellow\">Meteostanice</font></a>";
    if ($script_name!="/rekreace/kniha.html") echo " <a class=\"menu\" href=\"kniha.html\" target=\"_top\">Fórum</a>";
      else echo " <a class=\"menu\" href=\"kniha.html\" target=\"_top\"><font color=\"yellow\">Fórum</font></a>";
    if ($script_name!="/rekreace/fotogalerie.html") echo " <a class=\"menu\" href=\"fotogalerie.html\" target=\"_top\">Fotogalerie</a>";
      else echo " <a class=\"menu\" href=\"fotogalerie.html\" target=\"_top\"><font color=\"yellow\">Fotogalerie</font></a>";
    if ($script_name!="/rekreace/profisolar.php") echo " <a class=\"menu\" href=\"profisolar.php\" target=\"_top\">Online_solární_ohřev</a>";
      else echo " <a class=\"menu\" href=\"profisolar.php\" target=\"_top\"><font color=\"yellow\">Online_solární_ohřev</font></a>";
  ?>
    <a class="menu" href="../4f/" target="_top">Windsurfing</a>
  </div>

  <script type="text/javascript">
  // <!--
  // google_ad_client = "pub-6892058759603615";
  // /* Reklama_1 */
  // google_ad_slot = "6550229081";
  // google_ad_width = 728;
  // google_ad_height = 90;
  // //-->
  </script>

  <!--<script type="text/javascript" src="http://pagead2.googlesyndication.com/pagead/show_ads.js"></script> -->

  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  <!-- Reklama_1 -->
  <ins class="adsbygoogle"
      style="display:inline-block;width:728px;height:90px"
      data-ad-client="ca-pub-6892058759603615"
      data-ad-slot="6550229081"></ins>
  <script>
      (adsbygoogle = window.adsbygoogle || []).push({});
  </script>