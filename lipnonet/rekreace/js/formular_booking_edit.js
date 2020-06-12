let webToken = 'error';
let fotoGalleryOwner = '_ubytovani';

class UI {

    static display(id, status) {
        document.getElementById(id).style.display = status;
    }

    static addLoginInfo(newText) {
        const header = document.getElementById('user-logged-in');
        const origHeaderText = header.innerText;
        header.innerText = `${origHeaderText} - přihlášen uživatel : ${newText}`;
    }

    // set 'click' event listener for all table <div>
    static setQuerySelector() {
        const clickedDiv = document.querySelectorAll('td');
        clickedDiv.forEach( div => div.addEventListener('click', (e) => UI.editTermin(e) ));
    }

    // get clickedWeek and related appartementNr
    static editTermin(event) {
        const clickedTd = event.target;
        const childsTd = clickedTd.parentNode.children;
        // previous <td>
        let prevTd = clickedTd;
        let apartmentNr = 0;
        // instead 'while'
        for ( let i = childsTd.length - 1; i > 0; i--) {
            if ( prevTd.previousElementSibling ) {
                prevTd = prevTd.previousElementSibling;
                apartmentNr++;
            }
        } 

        // get clicked week from first column, e.g. 27 from (27) 27.06-04.07.2020
        const clickedWeek = +childsTd[0].innerText.split(')')[0].substring(1);
        if ( apartmentNr ) {
            // show form for editing
            UI.edit( clickedWeek - 1, apartmentNr);
            document.getElementById('close-btn').addEventListener('click', () => UI.display('form_edit_alert', 'none'));
        }
    }

    static edit (week, apartmentNr) {
      console.log('status :' + formResult[week][`g${apartmentNr}_text`]);
      const terminEdit = `${firstWeekStart(week  ).date}.${firstWeekStart(week  ).month}-${firstWeekStart(week+1).date}.${firstWeekStart(week+1).month}.${firstWeekStart(week+1).year}`
      // generate <option> and correct 'selected' value
      const statusOption = () => {
          let statusArr = [
              'volno',
              'obsazeno',
              'mimo provoz',
              'částečně obsazeno',
              'zaplaceno' ];
          let options = [];
          for ( let i = 0; i < 5; i++) {
              let selected = +formResult[week][`g${apartmentNr}_status`] === i ? 'selected' : '';  
              options = [ ...options, `<option value="${i}" ${selected}>${statusArr[i]}</option>`]
          }
          return options.join('\n');
      }

      const editForm = `
          <div id="close-btn"><span>x</span></div>
          <h3>
              Upravujete termín (${week + 1})
              <br>
              ${terminEdit}
          </h3>
          <br>
          <form autocomplete="off" id="edit_form_booking" name="edit_form_booking">
              <div class="form_booking edit_booking">
                  <h4>Apartmán č. ${apartmentNr}</h4>
                  <input type="hidden" name="g_week" value="${week + 1}" >
                  <input type="hidden" name="g_number" value="${apartmentNr}" >

                  <div class="input_booking edit_input_booking">
                      <label>Stav :</label><br>
                      <select name="g_status">
                          ${statusOption()}
                      </select>
                  </div>
                  
                  <div class="input_booking edit_input_booking">
                      <label>Text :</label><br>
                      <input type="text" name="g_text" value="${formResult[week][`g${apartmentNr}_text`]}">
                  </div>

                  <div class="submit_booking edit_input_booking">
                      <input type="submit" name="odesli" value="Odeslat">
                  </div>
              </div>
          </form>`;
      // 
      const formResultPlace = document.getElementById('form_edit_alert');
      formResultPlace.innerHTML = editForm;
      formResultPlace.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
      formResultPlace.style.display = 'block';
      // handle submit changes
      const formBooking = document.querySelector('#edit_form_booking');
      formBooking.addEventListener('submit', e => sendEditFormBooking(e));                          
    }
}


const sendEditFormBooking = (e) => {
    // disable page reload-clear after submit
    e.preventDefault();
    // all form data to special object
    const form = document.querySelector('#edit_form_booking');
    const FD = new FormData(form);
    FD.append('fotoGalleryOwner', fotoGalleryOwner);
    FD.append('webToken', webToken);
    // real object
    const FDobject = {};
    // fill form data ojbect
    FD.forEach( (value, key) => FDobject[key] = value );
    // AJAX
    {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `api/pdo_update_booking.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = function(){
            if (this.readyState == 4 && this.status == 200) {
                editResult = JSON.parse(this.responseText);
                // show OK green alert box
                formResultAlert(editResult, 'form_edit_alert');
                // set querySelector for all <td>
                setTimeout( UI.setQuerySelector , 1000 );
            } 
        }
        xhr.onerror = function () {
            const formResultAjaxEror = JSON.parse('{"mailResult" : "ajax_failed"}');
            // show ERROR red alert box
            formResultAlert(formResultAjaxEror);
        }
        xhr.send(JSON.stringify(FDobject));
    }
    UI.display('form_edit_alert', 'none')

}


// get webToken and webAccess from server
const loginGetToken = (event) => {
    event.preventDefault();
    // form id="login"
    let FD = new FormData(login); 
    // or [*1]
    FD.append('fotoGalleryOwner', fotoGalleryOwner);
    // console.log([...FD]); 
    let object = {};
    FD.forEach( (value, key) => object[key] = value );
    // [*1] object['fotoGalleryOwner'] = fotoGalleryOwner;
    // console.log(object); 
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `api/foto_login.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function(){
        if (this.readyState == 4 && this.status == 200) {
            const id = JSON.parse(this.responseText);
            webToken = id[0].webToken;
            // console.log(webToken);
            if ( webToken === 'error' ) {
                loginResp = 'error';
            } else {
                loginResp = 'loginSuccess';
                UI.display('login', 'none');
                UI.setQuerySelector();
                UI.addLoginInfo(object.user);
            }
            const formResultAjaxEror = JSON.parse(`{"mailResult" : "${loginResp}"}`);
            formResultAlert(formResultAjaxEror, 'form_edit_alert');
      }
    }
    xhr.send(JSON.stringify(object));
  }

// login submit
document.getElementById('login').addEventListener('submit', event => loginGetToken(event));

// hide formular
UI.display('form_booking', 'none');

