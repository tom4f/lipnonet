import React from 'react';
import mainZimaImg          from '../images/main_zima.jpg';
import mainImg              from '../images/main.jpg';
import mainLetoImg          from '../images/main_leto.jpg';

const Top = () => {

    return ( 

        <span>
            <div className="header">
                <a className="menu" href="index.php" target="_top">Start</a>        <b>--> </b>
                <a className="menu" href="rekreace.php" target="_top"> Apartmány</a>
                <a className="menu" href="formular.php" target="_top"> Termíny+Objednávka</a>
                <a className="menu" href="ceny.php" target="_top"> Ceny</a>
                <a className="menu" href="kontakt.php" target="_top"> Kontakt</a>
                <a className="menu" href="frymburk.php" target="_top"> O Frymburku</a>
            </div>

            <div className="mainpictures">
                <a href="rekreace.php">
                    <img className="img" src={mainZimaImg} height="100" alt="Ubytování u Kučerů ve Frymburku - zima"/>
                </a>
                <a href="rekreace.php">
                    <img className="img" src={mainImg} height="100" alt="Ubytování u Kučerů ve Frymburku"/>
                </a>
                <a href="rekreace.php">
                    <img className="img" src={mainLetoImg} height="100" alt="Ubytování u Kučerů ve Frymburku - léto"/>
                </a>
            </div>

            <div className="header">
                <b>--> </b>
                <a className="menu" href="webcam_ip_archive.php" target="_top">Webkamera_archív</a>
                <a className="menu" href="aktuality.php" target="_top"> Meteostanice</a>
                <a className="menu" href="kniha.html" target="_top"> Fórum</a>
                <a className="menu" href="fotogalerie.html" target="_top"> Fotogalerie</a>
                <a className="menu" href="profisolar.php" target="_top"> Online_solární_ohřev</a>
                <a className="menu" href="../4f/" target="_top"> Windsurfing</a>
            </div>
        </span>



    );
}
export default Top;