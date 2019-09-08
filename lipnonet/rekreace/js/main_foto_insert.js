
"use strict";

let imgJson;
let resp;
let id;
let newImgNumber;

// load last db ID

const loadNewImgNumber = () => {
  var xhr = new XMLHttpRequest();
//xhr.open('GET', `api/ajax_receive_data_universal.php`, true);
  xhr.open('GET', `api/pdo_read_auto_increment.php`, true);
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
      id = JSON.parse(this.responseText);
      newImgNumber = parseInt(id[0].Auto_increment);
      console.log(newImgNumber);
    }
  }
  xhr.send();
}

loadNewImgNumber();

// send IMG via formData to server and in reponse get IMG in JSON
const jsonImg = (event) => {
 
  var file = event.target.files[0];
  //var file = afileId.files[0];
  var fd = new FormData();
  fd.append("afile", file, newImgNumber);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'api/handle_file_upload.php', true);
  
  const xhrTasks = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      imgJson = xhr.response;
      resp = JSON.parse(imgJson);
      console.log('Server got:', resp);
      var image = document.createElement('img');
      image.src = resp.dataUrl;
      image.className = 'tomas';
      const selectedPicturePlace = document.getElementById('selectedPicturePlace');
      const selectedPicture = document.querySelector('.tomas');
      if (selectedPicture) {
            selectedPicturePlace.removeChild(selectedPicturePlace.childNodes[0]);
      }
      selectedPicturePlace.appendChild(image);
    };
  };

  xhr.onload = xhrTasks;
  xhr.send(fd);
}

const afileId = document.querySelector('#afile');

afileId.addEventListener('change', (event) => jsonImg(event), false);


// All formular data

const sendAlarmsToMySql = (e) => {
  e.preventDefault();
  let FD = new FormData(form); 
  let object = {};
  FD.forEach( (value, key) => object[key] = value );
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'api/pdo_create.php', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  const objectWithImg = Object.assign(resp, object);
  xhr.send(JSON.stringify(objectWithImg));
}

let form = document.getElementById('formular');
form.addEventListener('submit', sendAlarmsToMySql);

let currentDate = document.getElementById('date');
currentDate.value = new Date().toISOString().slice(0,10);;