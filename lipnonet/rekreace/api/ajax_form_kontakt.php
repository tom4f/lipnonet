
<?php 

// Get raw posted data - Array from JSON
$data = json_decode(file_get_contents("php://input"));

$bcc = "tom4f@seznam.cz ubytovani@lipnonet.cz 00420602496115@sms.eurotel.cz Bedrich.Kucera@seznam.cz";
//$bcc = "tom4f@seznam.cz";
$to = $data->emailova_adresa;
$subject = "Zpráva ze stránky www.lipnonet.cz";
$headers  = "MIME-Version: 1.0" . "\r\n";;
//$headers .= "Content-Type: text/plain; charset==UTF-8" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "Bcc: $bcc\r\n";
$headers .= "From: ubytovani@lipnonet.cz";

$textHtml = "";
$text = $data->text;
// Break a string into an array
$delimitered = explode("\r\n",$text);
foreach ($delimitered as $line) {
    $textHtml .= "<br>$line";
}

$text = "
    <html>
        <head>
            <title>Ubytování u Kučerů</title>
        </head>
        <body>
        <h2>Zpráva ze stránky www.lipnonet.cz byla odeslána.</h2>
            <ul>".
                "<li>E-mail : ".$data->emailova_adresa."</li>".
                "<li>Info : ".$textHtml."</li>".
                "<li>Datum a čas odeslání formuláře : " . Date("d.m.Y H:i:s")."</li>".
            "</ul>
            <h2>Děkujeme</h2>
        </body>
    </html>
";

if ($data->antispam_code_orig != $data->antispam_code) 
    $data->mailResult = 'antispam_failed';
    else if (mail($to, $subject, $text, $headers))
    //else if ( true )
        $data->mailResult = 'success';
        else $data->mailResult = 'mail_failed';

echo json_encode($data, true);

?>