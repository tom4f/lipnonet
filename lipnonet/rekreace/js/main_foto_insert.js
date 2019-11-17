"use strict";

let imgJson;
let resp;
let newImgNumber;
let imgNumberPlace = document.getElementById('imgNumber');
console.log(imgNumberPlace);

const formNames = (formName, value) => {
  document.getElementById('formular').elements.namedItem(formName).value = value;
}

// load last db ID - MySQL Auto_increment
const loadNewImgNumber = () => {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', `api/pdo_read_auto_increment.php`, true);
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
      const id = JSON.parse(this.responseText);
      // or Number() instead parseInt
      newImgNumber = parseInt(id[0].Auto_increment);
      console.log(newImgNumber);

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
const sendImgToMySql = (event) => {
  const node = document.createElement("LI");
  event.preventDefault();
  console.log(document.activeElement.name);
  if (document.activeElement.name === 'add') {
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
            loadPicturesfromMySqlStartPage (limit, offset, event);
            loadNewImgNumber();
      } else if(this.status = 404){
        const textnode = document.createTextNode(`chyba`);
        node.appendChild(textnode);
        document.getElementById('showAlert').appendChild(node);
      }
    }
    xhr.send(JSON.stringify(objectWithImg));
  }

  if (document.activeElement.name === 'edit') {
    let FD = new FormData(form); 
    // all form data to object
    let object = {};
    FD.forEach( (value, key) => object[key] = value );
      
    let xhr = new XMLHttpRequest();
    xhr.open('UPDATE', 'api/pdo_update.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    // if img file updated
    let objectWithImg;
    if (resp) objectWithImg = Object.assign(resp, object);
      else objectWithImg = object; 
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
            const textnode = document.createTextNode(`foto č. ${newImgNumber} bylo aktualizováno - ${this.responseText} - OBNOV TUTO STRÁNKU !!!`);
            node.appendChild(textnode);
            document.getElementById('showAlert').appendChild(node);
            // clear formular data for file select
            const file = document.getElementById("afile");
            file.value = file.defaultValue;
            // remove picture
            const selectedPicturePlace = document.getElementById('selectedPicturePlace');
            // if img file updated
             if (selectedPicturePlace.childNodes[0]) selectedPicturePlace.removeChild(selectedPicturePlace.childNodes[0]);
            loadPicturesfromMySqlStartPage (limit, offset, event);
            loadNewImgNumber();
      } else if(this.status = 404){
        const textnode = document.createTextNode(`chyba`);
        node.appendChild(textnode);
        document.getElementById('showAlert').appendChild(node);
      }
    }
    xhr.send(JSON.stringify(objectWithImg));
  }

  if (document.activeElement.name === 'delete') {
    let FD = new FormData(form); 
    // all form data to object
    let object = {};
    FD.forEach( (value, key) => object[key] = value );
      
    let xhr = new XMLHttpRequest();
    xhr.open('DELETE', 'api/pdo_delete.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    const objectWithImg = object;
    //const objectWithImg = Object.assign(resp, object);
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
            const textnode = document.createTextNode(`foto č. ${newImgNumber} bylo smazáno - ${this.responseText} - OBNOV TUTO STRÁNKU !!!`);
            node.appendChild(textnode);
            document.getElementById('showAlert').appendChild(node);
            // clear formular data for file select
            const file = document.getElementById("afile");
            file.value = file.defaultValue;
            // remove picture
            // const selectedPicturePlace = document.getElementById('selectedPicturePlace');
            // selectedPicturePlace.removeChild(selectedPicturePlace.childNodes[0]);
            loadPicturesfromMySqlStartPage (limit, offset, event);
            loadNewImgNumber();
      } else if(this.status = 404){
        const textnode = document.createTextNode(`chyba`);
        node.appendChild(textnode);
        document.getElementById('showAlert').appendChild(node);
      }
    }
    xhr.send(JSON.stringify(objectWithImg));
  }



}





// START
loadNewImgNumber();

const afileId = document.querySelector('#afile');
afileId.addEventListener('change', (event) => jsonImg(event), false);

let form = document.getElementById('formular');
form.addEventListener('submit', event => sendImgToMySql(event));

const today = new Date().toISOString().slice(0,10);
let currentDate = document.getElementById('date');
currentDate.value = currentDate.placeholder = today;