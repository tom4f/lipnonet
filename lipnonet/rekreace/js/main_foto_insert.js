"use strict";

let imgJson;
let resp;
let newImgNumber;


// load last db ID
const loadNewImgNumber = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `api/pdo_read_auto_increment.php`, true);
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
      const id = JSON.parse(this.responseText);
      newImgNumber = parseInt(id[0].Auto_increment);
      console.log(newImgNumber);
      const imgNumberPlace = document.getElementById('imgNumber');
      imgNumberPlace.innerHTML = `Vkládáte foto č. ${newImgNumber}`;
    }
  }
  xhr.send();
}

// send IMG via formData to server and in reponse get IMG in JSON
const jsonImg = (event) => {
  loadNewImgNumber();

  var file = event.target.files[0];
  //var file = afileId.files[0];
  const fd = new FormData();
  fd.append("afile", file, newImgNumber);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'api/handle_file_upload.php', true);
  
  const xhrTasks = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      imgJson = xhr.response;
      resp = JSON.parse(imgJson);
      console.log('Server got:', resp);
      let image = document.createElement('img');
      image.src = resp.dataUrl;
      image.className = 'tomas';
      const selectedPicturePlace = document.getElementById('selectedPicturePlace');
      const selectedPicture = document.querySelector('.tomas');
      if (selectedPicture) {
            selectedPicturePlace.removeChild(selectedPicturePlace.childNodes[0]);
      } else 
            selectedPicturePlace.appendChild(image);
    }
  }

  xhr.onload = xhrTasks;
  xhr.send(fd);
}

// Send all formular data together with img as JSON
const sendImgToMySql = (e) => {
  const node = document.createElement("LI");
  e.preventDefault();
  let FD = new FormData(form); 
  // all form data to object
  let object = {};
  FD.forEach( (value, key) => object[key] = value );
    
  let xhr = new XMLHttpRequest();
  xhr.open('POST', 'api/pdo_create.php', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  const objectWithImg = Object.assign(resp, object);
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
          const textnode = document.createTextNode(`foto č. ${newImgNumber} bylo nahráno - ${this.responseText} - OBNOV TUTO STRÁNKU !!!`);
          node.appendChild(textnode);
          document.getElementById('showAlert').appendChild(node);
          // clear formular data for file select
          const file = document.getElementById("afile");
          file.value = file.defaultValue;
          // remove picture
          const selectedPicturePlace = document.getElementById('selectedPicturePlace');
          selectedPicturePlace.removeChild(selectedPicturePlace.childNodes[0]);
    } else if(this.status = 404){
      const textnode = document.createTextNode(`chyba`);
      node.appendChild(textnode);
      document.getElementById('showAlert').appendChild(node);
    }
  }
  xhr.send(JSON.stringify(objectWithImg));
}





// START
loadNewImgNumber();

const afileId = document.querySelector('#afile');
afileId.addEventListener('change', (event) => jsonImg(event), false);

let form = document.getElementById('formular');
form.addEventListener('submit', sendImgToMySql);

const today = new Date().toISOString().slice(0,10);
let currentDate = document.getElementById('date');
currentDate.value = currentDate.placeholder = today;