"use strict"


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

// UI handling AJAX response - after submit button clicek
const formResultAlert = (formResult) =>{
    const antispamFailed = `
        <h2>Zprávu se nepodařilo odeslat.</h2>
        <h2>špatný kód</h2>
    `;
    const mailFailed = `
        <h2>Zprávu se nepodařilo odeslat.</h2>
        <h2>zkuste to později</h2>
    `;
    const formResultPlace = document.getElementById('form_result_alert');
    const antispamCodeInputPlace = document.getElementById('antispam_code_input');
    switch (formResult.mailResult){
        case 'ajax_failed':
            formResultPlace.innerHTML = mailFailed;
            formResultPlace.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';  
            break;            
        case 'success':
            // adress from <textarea> divided to array based on new lines
            const adressDecode = formResult.mailResult === 'ajax_failed' ? [''] : formResult.text.split('\r\n');
            let textDecodeHtml = '';
            adressDecode.forEach( value => textDecodeHtml += `<br>${value}` );
            const formConfirmation = `
                <h2>Zpráva byla odeslána.</h2>
                <ul>
                    <li>E-mail :${formResult.emailova_adresa}</li>
                    <li>Text :${textDecodeHtml}</li>
                </ul>
                <h2>Děkujeme</h2>
            `;
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
    const alertTimer = () => formResultPlace.style.visibility = 'hidden';
    setTimeout(alertTimer, 5000);
}

const sendEmail = (e) =>{
    e.preventDefault();
    // copy all '#form_kontakt' fields to 'FD'
    const FD = new FormData(form);
    const FDobject = {};
    FD.forEach( ( value, index ) => FDobject[ index ] = value );

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `api/ajax_form_kontakt.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function(){
        if (this.readyState == 4 && this.status == 200) {
            const formResult = JSON.parse(this.responseText);
            console.log(formResult);
            formResultAlert(formResult);
        } 
    }
    xhr.onerror = function () {
        const formResultAjaxEror = JSON.parse('{"mailResult" : "ajax_failed"}');
        console.log(formResultAjaxEror);
        formResultAlert(formResultAjaxEror);
    }
    xhr.send(JSON.stringify(FDobject));
}


// start new antispam code
setAntispam();

// if submit clicked :-)
const form = document.querySelector('#form_kontakt');
form.addEventListener('submit', e => sendEmail(e));