
<?php 

// Get raw posted data - Array from JSON
$data = json_decode(file_get_contents("php://input"));

$bcc = "tom4f@seznam.cz ubytovani@lipnonet.cz 00420602496115@sms.eurotel.cz Bedrich.Kucera@seznam.cz";
//$bcc = "tom4f@seznam.cz";
$to = $data->emailova_adresa;
$subject = "Objednávka ubytování ve Frymburku";
$headers  = "MIME-Version: 1.0" . "\r\n";;
//$headers .= "Content-Type: text/plain; charset==UTF-8" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "Bcc: $bcc\r\n";
$headers .= "From: ubytovani@lipnonet.cz";

$adressHtml = "";
$adress = $data->adresa_1;
// Break a string into an array
$delimitered = explode("\r\n",$adress);
foreach ($delimitered as $line) {
    $adressHtml .= "<br>$line";
}

$text = "
    <html>
        <head>
            <title>Ubytování u Kučerů</title>
        </head>
        <body>
        <h2>Objednávka byla odeslána.</h2>
            <ul>".
                "<li>Jméno : ".$data->jmeno."</li>".
                "<li>Telefon : ".$data->telefoni_cislo."</li>".
                "<li>Termín : ".$data->datum_prijezdu."---".$data->datum_odjezdu."</li>".
                "<li>Apartmá : ".$data->Garsonka_cislo."</li>".
                "<li>Osob : ".$data->pocet_osob."</li>".
                "<li>Adresa : ".$adressHtml."</li>".
                "<li>Potvrdit : ".$data->potvrdit."</li>".
                "<li>E-mail : ".$data->emailova_adresa."</li>".
                "<li>Info : ".$data->doplnkove_informace."</li>".
                "<li>Datum a čas odeslání formuláře : " . Date("d.m.Y H:i:s")."</li>".
            "</ul>
            <h2>Děkujeme</h2>
        </body>
    </html>
";

$dummyData = (object) [
    'antispam_code_orig' => 1,
    'antispam_code'      => 2
];

// if data not exists, e.g. if open ajax_form_booking.php directly, set dummy antispam data
$data ?? $data = $dummyData;

if ($data->antispam_code_orig != $data->antispam_code) 
    $data->mailResult = 'antispam_failed';
    else if (mail($to, $subject, $text, $headers))
    //else if (true)
        $data->mailResult = 'success';
        else $data->mailResult = 'mail_failed';

echo json_encode($data, true);

?>