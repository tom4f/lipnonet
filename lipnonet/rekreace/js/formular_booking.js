"use strict"

// calculate first week (based on first Thuersday in Year) and calculate first Saurday
const firstWeekStart = (week = 0) => {
    let firstSat = 0;
    const year = new Date().getFullYear();
    // Get the firt day of year + get day of week : 0 (Sunday) to 6 (Saturday)
    const firstDay = new Date(year,0).getDay();
    if (firstDay >= 0 && firstDay < 5) {
        firstSat  = new Date( year, 0, 7 * week - firstDay );
    } else {
        firstSat  = new Date( year, 0, 7 * week + 7 - firstDay );
    }
    const getSaturday = {
        date        : firstSat.getDate()  < 10 ? `0${firstSat.getDate()}`      : `${firstSat.getDate()}`,
        month       : firstSat.getMonth() <  9 ? `0${firstSat.getMonth() + 1}` : `${firstSat.getMonth() + 1}`,
        year        : firstSat.getFullYear(),
        firstSat    : firstSat.getTime()
    }
    return getSaturday;
}


// show booking table based on AJAX response 'formResult'
const showTable = (formResult) => {
    // table for booking status
    const bookingTable = document.querySelector('.booking_table');
    const setBackgroundColor = [
        '',
        'style="background-color:rgba(255, 208,   0, 0.9);"',
        'style="background-color:rgba(255,   0,   0, 0.9);"',
        'style="background-color:rgba(202, 202, 202, 0.9);"',
        'style="background-color:rgba(  0, 255,   0, 0.9);"',      
    ]
    let weekModified = 0;
    const createBookingTable = (week = 0) =>{
        // for weeks in current year
        if (week < formResult.length){
            weekModified = week;
        // for weeks in next year
        } else{
            weekModified = week - formResult.length;
        }
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>(${weekModified + 1}) ${firstWeekStart(week  ).date}.${firstWeekStart(week  ).month}-${firstWeekStart(week+1).date}.${firstWeekStart(week+1).month}.${firstWeekStart(week+1).year}</td>
            <td ${setBackgroundColor[formResult[weekModified].g1_status]}>${formResult[weekModified].g1_text}</td>
            <td ${setBackgroundColor[formResult[weekModified].g2_status]}>${formResult[weekModified].g2_text}</td>
            <td ${setBackgroundColor[formResult[weekModified].g3_status]}>${formResult[weekModified].g3_text}</td>
        `;
        bookingTable.appendChild(tr);
    }
    // create booking table from current week till end of the year
    for (let week = actualWeek(); week < actualWeek() + formResult.length; week++){
        createBookingTable(week);
    }
}


// UI handling AJAX response - after submit button clicek
const formResultAlert = (formResult) =>{
    const antispamFailed = `
        <h2>Objednávku se nepodařilo odeslat.</h2>
        <h2>špatný kód</h2>`;
    const mailFailed = `
        <h2>Objednávku se nepodařilo odeslat.</h2>
        <h2>zkuste to později</h2>`;
    const formResultPlace           = document.getElementById('form_result_alert');
    const antispamCodeInputPlace    = document.getElementById('antispam_code_input');
    
    switch (formResult.mailResult){
        case 'ajax_failed':
            formResultPlace.innerHTML = mailFailed;
            formResultPlace.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';  
            break;            
        case 'success':
            // adress from <textarea> divided to array based on new lines
            const adressDecode = formResult.mailResult === 'ajax_failed' ? [''] : formResult.adresa_1.split('\r\n');
            let addressDecodeHtml = '';
            adressDecode.forEach( value => addressDecodeHtml += `<br>${value}` );
            const formConfirmation = `
                <h2>Objednávka byla odeslána.</h2>
                <ul>
                    <li>Jméno : <b>${formResult.jmeno}</b></li>
                    <li>Telefon :${formResult.telefoni_cislo}</li>
                    <li>Termín :${formResult.datum_prijezdu} - ${formResult.datum_odjezdu}</li>
                    <li>Apartmá :${formResult.Garsonka_cislo}</li>
                    <li>Osob :${formResult.pocet_osob}</li>
                    <li>Adresa :${addressDecodeHtml}</li>
                    <li>Potvrdit :${formResult.potvrdit}</li>
                    <li>E-mail :${formResult.emailova_adresa}</li>
                    <li>Info :${formResult.doplnkove_informace}</li>
                </ul>
                <h2>Děkujeme</h2>`;
            formResultPlace.innerHTML = formConfirmation;
            formResultPlace.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
            // generate new antispam value pair
            setAntispam();
            // clear actual <input> value
            antispamCodeInputPlace.value = '';
            break;
        case 'antispam_failed':
            formResultPlace.innerHTML = antispamFailed;
            formResultPlace.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            // generate new antispam value pair
            setAntispam();
            // clear actual <input> value
            antispamCodeInputPlace.value = '';
            // set focus on related input
            antispamCodeInputPlace.focus();
            break;
        case 'failed':
            formResultPlace.innerHTML = mailFailed;
            formResultPlace.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            break;
        default:
            formResultPlace.innerHTML = mailFailed;
            formResultPlace.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';        
    }

    formResultPlace.style.visibility = 'visible';
    // hide form alert after 5 seconds
    setTimeout( () => formResultPlace.style.visibility = 'hidden', 5000 );
}


// send booking request
const sendFormBooking = (e) => {
    // disable page reload-clear after submit
    e.preventDefault();
    // all form data to special object
    const FD = new FormData(form);
    // real object
    const FDobject = {};
    // fill form data ojbect
    FD.forEach( (value, key) => FDobject[key] = value );
    // AJAX
    {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `api/ajax_form_booking.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState == 4 && this.status == 200) {
                const formResult = JSON.parse(this.responseText);
                // show OK green alert box
                formResultAlert(formResult);
            } 
        }
        xhr.onerror = function () {
            const formResultAjaxEror = JSON.parse('{"mailResult" : "ajax_failed"}');
            // show ERROR red alert box
            formResultAlert(formResultAjaxEror);
        }
        xhr.send(JSON.stringify(FDobject));
    }
}


// load booking status from mySQL
const loadBooking = () => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `api/pdo_read_booking.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const formResult = JSON.parse(xhr.responseText);
                // show one year table baed on JSON data from MYSQL
                showTable(formResult);
                // mySQL week starts from 0, real week starts from 1
                clearOldWeek( formResult[actualWeek() - 1] );
            } 
        }
        xhr.onerror = () => console.log("** An error occurred during the transaction");
        xhr.send();
    }


// create new antispam code
const setAntispam = () => {
    // create new antipam number
    const antispamCode = new Date().getMilliseconds();
    // place for antispam code
    const antispamCodePlace = document.getElementById('antispam_code_label');
    // display antispam question 
    antispamCodePlace.innerText = `Opište kód : ${antispamCode}`;
    // place for hidden antispam code
    const antispamCodeOrigPlace = document.getElementById('antispam_code_orig');
    // set antispam value to hidden input
    antispamCodeOrigPlace.value = antispamCode;
}


// get last booking modification stored in file 'formular_counter.dat'
const getLastBookingUpdate = (fileName) => {
    const lastBookingUpdatePlace = document.getElementById('last_booking_update');
    fetch(fileName)
        .then( (res)  => res.text() )
            .then( (lastBookingUpdate) => {
                lastBookingUpdatePlace.innerText = lastBookingUpdate;
            })
        // to handle errors :
        .catch( (error) => console.log(error) )
  }


// calculate actual week number
const actualWeek = () =>{
    const today = new Date().getTime();
    const first = firstWeekStart(0).firstSat;
    return Math.floor((today - first) / ( 1000 * 60 * 60 * 24 * 7 ));
} 


// values in previous week must be cleared to be empty at the end of booking table
const clearOldWeek = (oldWeekData) =>{
    // array from Object values - without 1st value
    const [, ...arrFromObjCutFirst] = Object.values(oldWeekData);
    let textFromValues = '';
    // add all array values into one word to see if some entry exists
    arrFromObjCutFirst.forEach( value => textFromValues += value  );
    // clear oldest week only if not empty = '000'
    
    if(textFromValues != '000'){
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `api/pdo_clear_booking.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState == 4 && this.status == 200) {
                const formResult = JSON.parse(this.responseText);
                // just internal info about mySQL data clearing response
                console.log(formResult);
            } 
        }
        xhr.onerror = function () {
            console.log("** An error occurred during the transaction");
        }
        xhr.send( JSON.stringify( { 'week' : actualWeek()} ) );
    }

}

// ==================== S T A R T ==========================================================

// start new antispam code
setAntispam();


// load booking table when page loaded
loadBooking();


// get last booking modification stored in file 'formular_counter.dat'
getLastBookingUpdate('formular_counter.dat');


// handle if submit button clicked
const form = document.getElementById('form_booking');
form.addEventListener('submit', e => sendFormBooking(e));