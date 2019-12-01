"use strict";

let webToken = 'error';
let imgJson;
let resp;
let newImgNumber;
let imgNumberPlace = document.getElementById('imgNumber');
console.log(imgNumberPlace);

const showForm = document.getElementById('divformular');
showForm.style.display='none';

// load last db ID - MySQL Auto_increment
const loadNewImgNumber = () => {
  let xhr = new XMLHttpRequest();
  //xhr.open('GET', `api/pdo_read_auto_increment${fotoGalleryOwner}.php`, true);
  xhr.open('POST', `api/pdo_read_auto_increment.php`, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
      const id = JSON.parse(this.responseText);
      // or Number() instead parseInt
      newImgNumber = parseInt(id[0].Auto_increment);
      console.log(newImgNumber);
    }
  }
  xhr.send(JSON.stringify({ 'fotoGalleryOwner' : fotoGalleryOwner}));
}

// send IMG via formData to server and in reponse get IMG in JSON
const jsonImg = (event) => {
  loadNewImgNumber();

  var file = event.target.files[0];
  //var file = afileId.files[0];
  const fd = new FormData();
  fd.append("afile", file, newImgNumber);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `api/handle_file_upload.php`, true);
  
  const xhrTasks = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      imgJson = xhr.response;
      resp = JSON.parse(imgJson);
      console.log('Server got:', resp);
      let image = document.createElement('img');
      image.src = resp.dataUrl;
      image.className = 'tomas';
      //const selectedPicturePlace = document.getElementById('selectedPicturePlace');
      //const selectedPicture = document.querySelector('.tomas');
      //if (selectedPicture) {
            //selectedPicturePlace.removeChild(selectedPicturePlace.childNodes[0]);
      //} else {
            //selectedPicturePlace.appendChild(image);
      const bigImgBlock =   document.querySelector('.main-img');
      bigImgBlock.style.backgroundImage = "url('" + image.src + "')";
        //    }
    }
  }

  xhr.onload = xhrTasks;
  xhr.send(fd);
}


const loginToken = (event) => {
  event.preventDefault();
  let FD = new FormData(login); 
  let object = {};
  //let formPassword = FD.get('password');
  //FD.set('password' , formPassword + '' + formPassword );
  FD.forEach( (value, key) => object[key] = value );
  object['fotoGalleryOwner'] = fotoGalleryOwner;
  console.log([...FD]); 
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `api/foto_login.php`, true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
      const id = JSON.parse(this.responseText);
      // or Number() instead parseInt
      webToken = id[0].webToken;
      console.log(webToken);
      showForm.style.display = webToken!='error' ? 'block' : 'none';
      const showLogin = document.getElementById('logindiv');
      showLogin.style.display='none';
    }
  }
  xhr.send(JSON.stringify(object));
}


// Send all formular data together with img as JSON
const sendImgToMySql = (event) => {
  event.preventDefault();
  console.log(document.activeElement.name);

  const ajax = (action, path) => {
    let FD = new FormData(form); 

    // all form data to object
    let object = {};
    FD.forEach( (value, key) => object[key] = value );
    console.log(object); 
    let xhr = new XMLHttpRequest();
    xhr.open(action, `api/pdo_${path}.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    // if img file updated
    let objectWithImg;
    if (resp) objectWithImg = Object.assign(resp, object);
      else objectWithImg = object; 
      
      objectWithImg['fotoGalleryOwner'] = fotoGalleryOwner;
      objectWithImg['webToken'] = webToken;
      
      xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
            const result = (JSON.parse(this.responseText)).message;
            const textnode = document.createTextNode(`${action} : ${result}`);
            const node = document.createElement("LI");
            node.appendChild(textnode);
            document.getElementById('showAlert').appendChild(node);
            setTimeout( 
              () => document.getElementById('showAlert').removeChild(node) ,
              10000            
              );
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
  
    if (document.activeElement.name === 'add') {
      ajax('POST', 'create');
    }

    if (document.activeElement.name === 'edit') {
      ajax('UPDATE', 'update');
    }

    if (document.activeElement.name === 'delete') {
      ajax('DELETE', 'delete');
    }

}

// START
loadNewImgNumber();

const afileId = document.querySelector('#afile');
afileId.addEventListener('change', event => jsonImg(event));

const form = document.getElementById('formular');
form.addEventListener('submit', event => sendImgToMySql(event));


const login = document.getElementById('login');
login.addEventListener('submit', event => loginToken(event));

const today = new Date().toISOString().slice(0,10);
let currentDate = document.getElementById('date');
currentDate.value = currentDate.placeholder = today;