"use strict";

// Class UI - all design 
class UI {

    static loadImgBig(bigImgUrl) {

      const bigImgInfo =    document.querySelector('.photoInfo');
      const bigImgBlock =   document.querySelector('.main-img');
      
      // create big background photo
      bigImgBlock.style.backgroundImage = "url('" + bigImgUrl + "')";

      // + add photo description
      const currentPhotoId = bigImgUrl
        .split('fotogalerie/')[1]
          .replace(/b.jpg/g,'');

      const objOneFoto = EightPhoto.find(onePhotoObject => onePhotoObject.id === currentPhotoId);

      bigImgInfo.innerHTML = `
          <b>${objOneFoto.id}</b>
          ${objOneFoto.insertDate.slice(0,10)}    
          <b>${objOneFoto.header}</b> 
          Autor: ${objOneFoto.autor} 
          <br>
          ${objOneFoto.text}
          `;

      // add fade in class
      bigImgBlock.classList.add('fade-in');

      // remove fade in class after 0.5s
      setTimeout(() => bigImgBlock.classList.remove('fade-in'), 500);
    }


    static loadImgList(limit, offset, event) {

      EightPhoto = AllPhoto.slice(offset, offset + limit);
      console.log(`offset = ${offset}, limit = ${limit}`);

      if (event !=0) console.log(`event.target.classList: ${event.target.classList}`);

        const photoUrlPath   = 'fotogalerie/';
        const eightImgsPlace =  document.querySelector('#imgsLocation');
        const eightImgsBlock =  document.querySelector('.imgs');
        const eightImgsAll   =  document.querySelectorAll('.eightImgsAll');

        let bigImgUrl = "";
        
        // hide 8 photos for some clicks
        if (event !=0) {
          if (
              event.target.classList == 'fas fa-arrow-right'  || event.target.classList == 'fas fa-arrow-left' ||
              event.target.classList == 'nextPhoto'           || event.target.classList == 'prevPhoto' ||      
              event.target.classList == 'fas fa-play-circle'  || event.target.classList == 'play'
              ) {
            showEightPhoto = 0;
          } else {
            showEightPhoto = 1;
          }
        } 

        // remove 8 small photo
        if (eightImgsAll.length > 7)  eightImgsAll.forEach(img => img.remove());
        
        // create 8 small photo 
        EightPhoto
          .forEach(onePhoto => {
              const div = document.createElement('div');
              div.style.backgroundImage = "url('" + photoUrlPath + onePhoto.id + ".jpg')";
              div.classList.add('eightImgsAll');
              div.innerHTML = onePhoto.id;
              if (bigImgUrl == "") bigImgUrl = `${photoUrlPath}${onePhoto.id}b.jpg`;
              if (showEightPhoto == 1) {eightImgsBlock.insertBefore(div, eightImgsPlace);}
            })
    
      // load big img
      UI.loadImgBig(bigImgUrl);
    }

    static imgClick(event) {
      const eightImgsAll =  document.querySelectorAll('.imgs div');
      const opacity = 0.4;
      
      // reset opacity for all imgs
      eightImgsAll.forEach(div => (div.style.opacity = 1));

      // change current img to src of clicked image
      const bigImgUrl = event.target.style.backgroundImage
            .replace(/url\("/g, "")
              .replace(/.jpg"\)/g, "b.jpg");

      // change opacity
      event.target.style.opacity = opacity;;

              // load big img
      UI.loadImgBig(bigImgUrl);
    }


    static slideShow() {
        const eightImgsAll =   document.querySelectorAll('.eightImgsAll');
        eightImgsAll.forEach(img => img.addEventListener('click', (event) => UI.imgClick(event) ));
    }
}
// end of UI class



let EightPhoto = [];
let AllPhoto = [];
let limit = 8;
let offset = 0;
let timer;
let showEightPhoto = 1;

const loadPicturesfromAllPhoto = (limit, offset, event) => {
    UI.loadImgList(limit, offset, event);
    UI.slideShow();
}

const loadPicturesfromMySqlStartPage = (limit, offset, event) => {
    var xhr = new XMLHttpRequest();
  //xhr.open('GET', `api/ajax_receive_data_universal.php`, true);
    xhr.open('GET', `api/pdo_read.php`, true);
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
        AllPhoto = JSON.parse(this.responseText);
        loadPicturesfromAllPhoto(limit, offset, event);
      }
    }
    xhr.send();
}

const startPresentation = (event) => {
  const Presentation = () => loadPicturesfromAllPhoto(1, (Math.floor(Math.random() * AllPhoto.length) + 1), event);
  timer = setInterval(Presentation, 5000);
  document.querySelector('.play').style.display = "none";
  document.querySelector('.stop').style.display = "block";
}

const stopPresentation = (event) => {
  clearInterval(timer);
  document.querySelector('.play').style.display = "block";
  document.querySelector('.stop').style.display = "none";
}

// main JS script started when DOM loaded
document                            .addEventListener('DOMContentLoaded',  (event) => loadPicturesfromMySqlStartPage (limit, offset, event));

document.querySelector('.stop')     .style.display = "none";
document.querySelector('.play')     .addEventListener('click', (event) => startPresentation(event));
document.querySelector('.stop')     .addEventListener('click', (event) => stopPresentation(event));
document.querySelector('.next8')    .addEventListener('click', (event) => loadPicturesfromAllPhoto(limit, offset+=limit, event));
document.querySelector('.prev8')    .addEventListener('click', (event) => offset > 7 ? loadPicturesfromAllPhoto(limit, offset-=limit, event) : console.log(`offset: ${offset}`));
document.querySelector('.nextPhoto').addEventListener('click', (event) => loadPicturesfromAllPhoto(1, offset+=1, event));
document.querySelector('.prevPhoto').addEventListener('click', (event) => offset > 0 ? loadPicturesfromAllPhoto(1, offset-=1, event) : console.log(`offset: ${offset}`));  

