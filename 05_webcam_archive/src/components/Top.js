import React from 'react';
import mainImg              from '../images/main.jpg';
import GoogleAd             from './GoogleAd';

const Top = () => {

    return ( 

        <span>
            <div className="header">
                <a className="menu" href="index.php" target="_top">Start</a> | 
                <a className="menu" href="rekreace.php" target="_top"> Apartmány</a> | 
                <a className="menu" href="formular.php" target="_top"> Objednávka</a> | 
                <a className="menu" href="ceny.php" target="_top"> Ceny</a> | 
                <a className="menu" href="kontakt.php" target="_top"> Kontakt</a> | 
                <a className="menu" href="frymburk.php" target="_top"> O Frymburku</a>
            </div>

            <div className="mainpictures">
                <a href="rekreace.php"><img className="img" src={mainImg} alt="Ubytování u Kučerů ve Frymburku - zima" /></a>
            </div>

            <div className="header">
                <a className="menu" href="webcam_ip_archive.html" target="_top">Kamera</a> | 
                <a className="menu" href="aktuality.php" target="_top"> Meteostanice</a> | 
                <a className="menu" href="kniha.html" target="_top"> Fórum</a> | 
                <a className="menu" href="fotogalerie.html" target="_top"> Fotogalerie</a> | 
                <a className="menu" href="profisolar.php" target="_top"> Solární ohřev</a> | 
                <a className="menu" href="../4f/" target="_top"> Windsurfing</a>
            </div>
            <GoogleAd />
        </span>



    );
}
export default Top;