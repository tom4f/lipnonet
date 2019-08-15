"use strict";

// set img url for localhost / remote web
const thisPageUrl  = window.location.href;
const photoUrlPath = thisPageUrl.includes('localhost') ? '../lipnonet/rekreace/fotogalerie/' : '../../rekreace/fotogalerie/';

// Class UI - all design 
class UI {

    static loadImgList(EightPhoto, event) {

      if (event !=0) console.log(`event.target.classList: ${event.target.classList}`);
      

        const eightImgsPlace =  document.querySelector('#imgsLocation');
        const eightImgsBlock =  document.querySelector('.imgs');
        const eightImgsAll =    document.querySelectorAll('.eightImgsAll');

        const bigImgPlace =     document.querySelector('#imgLocation');
        const bigImgBlock =     document.querySelector('.main-img');
        const bigImgInfo =      document.querySelector('.photoInfo');

        let bigImgUrl = "";
        
        // remove 8 small photo
        
        if (event !=0) {
          if (
              event.target.classList == 'fas fa-arrow-right' || 
              event.target.classList == 'fas fa-arrow-left' ||
              event.target.classList == 'nextPhoto' || 
              event.target.classList == 'prevPhoto'              
              ) {
            showEightPhoto = 0;
          } else {
            showEightPhoto = 1;
          }

        } 
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
      
        // create big photo
        const imgsBig = document.querySelectorAll('.currentnew');
        imgsBig.length > 0 ? imgsBig[0].remove() : console.log('<') ;
        const imgBig = document.createElement('img');
        
        // create big photo - via div

        //bigImgBlock.style.backgroundImage = "url('" + bigImgUrl + "')";

        // -- end


        imgBig.src = bigImgUrl;
        imgBig.classList.add('currentnew');
        bigImgBlock.insertBefore(imgBig, bigImgPlace);

        // add fade in class
        imgBig.classList.add('fade-in');
        // remove fade in class after 0.5s
        setTimeout(() => imgBig.classList.remove('fade-in'), 500);

        // create text for big photo

        currentPhotoId = imgBig.src
          .split('rekreace/fotogalerie/')[1]
            .replace(/b.jpg/g,'');
        
        const objOneFoto = EightPhoto[0];
        bigImgInfo.innerHTML = `
            <b>${objOneFoto.id}</b>
            ${objOneFoto.insertDate}    
            <b>${objOneFoto.header}</b> 
            Autor: ${objOneFoto.autor} 
            <br>
            ${objOneFoto.text}
            `;
    }

    static imgClick(event) {
      const eightImgsAll =   document.querySelectorAll('.imgs div');
      const bigImgInfo = document.querySelector('.photoInfo');

      const current =   document.querySelector('.currentnew');
      const opacity = 0.4;
      
      // reset opacity for all imgs
      eightImgsAll.forEach(div => (div.style.opacity = 1));

      // change current img to src of clicked image
      const divUrl = event.target.style.backgroundImage
            .replace(/url\("/g, "")
              .replace(/.jpg"\)/g, "b.jpg");
      current.src = divUrl;

      // + add photo description
            currentPhotoId = divUrl
            .split('rekreace/fotogalerie/')[1]
              .replace(/b.jpg/g,'');

      const objOneFoto = EightPhoto.find(onePhotoObject => onePhotoObject.id === currentPhotoId);

      bigImgInfo.innerHTML = `
        <b>${objOneFoto.header}</b> 
        ${objOneFoto.insertDate} 
        ${objOneFoto.autor} 
        ${objOneFoto.text}
        `;

      // add fade in class
      current.classList.add('fade-in');
      // remove fade in class after 0.5s
      setTimeout(() => current.classList.remove('fade-in'), 500);

      // change opacity
      event.target.style.opacity = opacity;;
    }



    static slideShow() {
        const eightImgsAll =   document.querySelectorAll('.eightImgsAll');
        eightImgsAll.forEach(img => img.addEventListener('click', (event) => UI.imgClick(event) ));
    }


}







let EightPhoto = [];
let AllPhoto = [];
let currentPhotoId;
let limit = 8;
let offset = 0;
let timer;
let showEightPhoto = 1;
//let event = 0;

const loadPicturesfromAllPhoto = (limit, offset, event) => {
  if(typeof event.target.classList === 'undefined') console.log('muj vysledek = undefine = start page');
    else console.log(event.target.classList);

    EightPhoto = AllPhoto.slice(offset,offset + limit);
    UI.loadImgList(EightPhoto, event);
    UI.slideShow();
    console.log(`offset = ${offset}, limit = ${limit}`);
}

const loadPicturesfromMySqlStartPage = (limit, offset, event) => {
  if(typeof event.target.classList === 'undefined') console.log('muj vysledek = undefine = start page');
    else console.log(event.target.classList);

  event = event;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `ajax_receive_data_universal.php?limit=${limit}&offset=${offset}`, true);
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
        AllPhoto = JSON.parse(this.responseText);
        EightPhoto = AllPhoto.slice(0,8);
        console.log(EightPhoto);
        UI.loadImgList(EightPhoto, event);
        UI.slideShow();
        console.log(`offset = ${offset}, limit = ${limit}`);
      }
    }
    xhr.send();
}

const startPresentation = (event) => {
  const Presentation = () => loadPicturesfromAllPhoto(1, (Math.floor(Math.random() * AllPhoto.length) + 1), event);
  timer = setInterval(Presentation, 5000);
}

document                            .addEventListener('DOMContentLoaded',  (event) => loadPicturesfromMySqlStartPage (0, 0, event));
document.querySelector('.play')     .addEventListener('click', (event) => startPresentation(event));
document.querySelector('.stop')     .addEventListener('click', ()      => clearInterval(timer));
document.querySelector('.next8')    .addEventListener('click', (event) => loadPicturesfromAllPhoto(limit, offset+=limit, event));
document.querySelector('.prev8')    .addEventListener('click', (event) => offset > 7 ? loadPicturesfromAllPhoto(limit, offset-=limit, event) : console.log(`offset: ${offset}`));
document.querySelector('.nextPhoto').addEventListener('click', (event) => loadPicturesfromAllPhoto(1, offset+=1, event));
document.querySelector('.prevPhoto').addEventListener('click', (event) => offset > 0 ? loadPicturesfromAllPhoto(1, offset-=1, event) : console.log(`offset: ${offset}`));  