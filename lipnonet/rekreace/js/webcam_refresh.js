"use strict"

// load POCASI meteo data from mySQL
const loadPocasi = (davisResult) => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `api/pdo_read_pocasi.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const pocasiResult = JSON.parse(xhr.responseText);
            // show one year table baed on JSON data from MYSQL
            meteoTable(davisResult[0], pocasiResult[0], lastMeteoData.split('|'));
        } 
    }
    xhr.onerror = () => console.log("** An error occurred during the transaction");
    xhr.send();
}


// load DAVIS meteo data from mySQL
const loadDavis = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `api/pdo_read_davis.php`, true);
  //xhr.open('POST', `https://www.frymburk.com/rekreace/api/pdo_read_davis.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const davisResult = JSON.parse(xhr.responseText);
            // show one year table baed on JSON data from MYSQL
            loadPocasi(davisResult);
        } 
    }
    xhr.onerror = () => console.log("** An error occurred during the transaction");
    xhr.send();
}

// generate fresh meteo <td>
const meteoTable = (
    {
        date,
        temp_mean,
        temp_high,
        temp_high_time,
        temp_low,
        temp_low_time,
        heat_deg_days,
        cool_deg_days,
        rain,
        wind_speed_avg,
        wind_speed_high,
        wind_speed_high_time,
        dir,
        wind3,
        wind6,
        wind9,
        wind12,
        bar_min,
        bar_avg,
        bar_max,
        huminidy_min,
        huminidy_avg,
        huminidy_max,
        air_density_min,
        air_density_avg,
        air_density_max,
        rain_rate_max
    },
    {
        id,
        datum,
        cas,
        hladina,
        pritok,
        odtok,
        vzduch,
        voda,
        pocasi
    }
    ) =>{
            const happyMeteoPlace = document.querySelector('.happyMeteo');
            happyMeteoPlace.innerHTML = `
                <fieldset>
                    <legend>Vítr</legend>
                        <section>    
                            <header>
                                >3 m/s 
                                <p>>6 m/s  
                                <p>>9 m/s
                                <p>avg
                                <p>max
                            </header>
                            <article>
                                ${wind3} min
                                <p>${wind6} min
                                <p>${wind9} min 
                                <p>${wind_speed_avg} m/s
                                <p>${wind_speed_high} m/s
                            </article>
                        </section>
                </fieldset>
                <fieldset>
                    <legend>Teplota</legend>
                    <section>
                        <header>
                            min
                            <p>avg
                            <p>max
                        </header>
                        <article>
                            ${temp_low} &deg;C
                            <p>${temp_mean} &deg;C
                            <p>${temp_high} &deg;C
                        </article>
                    </section>
                </fieldset>
                <fieldset>
                    <legend>Tlak</legend>
                    <section>
                        <header>
                            min
                            <p>avg
                            <p>max
                        </header>
                        <article>
                            ${bar_min} hPa
                            <p>${bar_avg} hPa
                            <p>${bar_max} hPa
                        </article>
                    </section>
                </fieldset>
                <fieldset>
                    <legend>Rel. vlhkost</legend>
                    <section>
                        <header>
                            min
                            <p>avg
                            <p>max
                        </header>
                        <article>
                            ${huminidy_min} %
                            <p>${huminidy_avg} %
                            <p>${huminidy_max} %
                        </article>
                    </section>
                </fieldset>
                <fieldset>
                    <legend>Srážky</legend>
                    <section>
                        <header>
                            celk
                            <p>max
                        </header>
                        <article>
                            ${rain} mm
                            <p>${rain_rate_max} mm/h
                        </article>
                    </section>
                </fieldset>
                <fieldset>
                    <legend>Voda na Lipně</legend>
                    <section>
                        <header>
                            teplota
                            <p>přítok
                            <p>odtok
                            <p>hladina
                        </header>
                        <article>
                            ${voda} &deg;C
                            <p>${pritok} m3
                            <p>${odtok} m3
                            <p>${hladina} m n.m.
                        </article>
                    </section>
                </fieldset>
        `;
}

const showMeteoBox = ([, date, time, temp, huminidy, presure, wind, dir, rainDummy, dewPoint, windChill]) =>{
    // get last meteo data stored in file 'davis/lipnonet_meteo.txt'
    const meteoDataPlace = document.querySelector('.meteo_box');
    // start css effect
    meteoDataPlace.classList.add('meteo_box_transition_out');
    // end css effect after 2s                    
    setTimeout( () =>  { 
        meteoDataPlace.classList.remove('meteo_box_transition_out');
        meteoDataPlace.innerHTML = `
            <fieldset class="meteo_value">
                <legend>${ ('0' + date).slice(-8).slice(0,6) }</legend>
                ${time}
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Teplota</legend>
                ${temp}&deg;C
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Vlhkost</legend>
                ${huminidy}%
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Tlak</legend>
                ${presure}hPa
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Vítr</legend>
                ${wind}m/s
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Směr</legend>
                ${dir}&deg;
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Ros. bod</legend>
                ${dewPoint}&deg;C
            </fieldset>
            <fieldset class="meteo_value">
                <legend>Pocit.tep.</legend>
                ${windChill}&deg;C
            </fieldset>`;  
    } , 2000);
}

let prevMeteoData = '';
let lastMeteoData = '';
const getLastMeteoData = () => {
  fetch('../davis/lipnonet_meteo.txt')
      .then( (res)  => res.text() )
          .then( (lastMData) => {
                // show meteo data only if file 'davis/lipnonet_meteo.txt' changed
                lastMeteoData = lastMData;
                if (lastMeteoData != prevMeteoData){
                    // update prevMeteoData
                    prevMeteoData = lastMeteoData; 
                    // create array from 'davis/lipnonet_meteo.txt'
                    showMeteoBox(lastMeteoData.split('|'));
                    //
                    loadDavis();
                }
          })
      // to handle errors :
      .catch( (error) => console.log(error) )
}

getLastMeteoData();
// load 'davis/lipnonet_meteo.txt' every 60s
setInterval( () => getLastMeteoData(), 60000);
// or equivalent
// setInterval(getLastMeteoData, 10000);



// = webCam update =============================================================//
// let newImage = document.createElement('img'). 
let newImage = new Image();
newImage.src = "../kamera/archive/ip_kamera.jpg";

const updateImage = () => {
    if( newImage.complete ) {
        // generate new dummy number
        const count = new Date().getTime();
        document.getElementById("kamera_refresh").src = newImage.src;
        newImage = new Image();
        // show new img with dummy filename extension
        newImage.src = "../kamera/archive/ip_kamera.jpg?id=" + count;
        // save fresh webCam img to file ip_kamera.jpg
        document.getElementById("foto_refresh").src="get_ip_kamera.php";
    }
}

// webCam update every 5s
setInterval(updateImage, 5000);