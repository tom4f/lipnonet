"use strict";

//let photoUrlPath = '../../rekreace/fotogalerie/';
let photoUrlPath = '../lipnonet/rekreace/fotogalerie/';

// Class UI - all design 
class UI {

    static loadImgList(EightPhoto) {

        const eightImgsPlace =  document.querySelector('#imgsLocation');
        const eightImgsBlock =  document.querySelector('.imgs');
        const eightImgsAll =    document.querySelectorAll('.eightImgsAll');

        const bigImgPlace =     document.querySelector('#imgLocation');
        const bigImgBlock =     document.querySelector('.main-img');
        const bigImgInfo =      document.querySelector('.photoInfo');

        let bigImgUrl = "";
        
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
      

        

        // create big photo
        const imgsBig = document.querySelectorAll('.currentnew');
        imgsBig.length > 0 ? imgsBig[0].remove() : console.log('<') ;
        const imgBig = document.createElement('img');

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
            <b>${objOneFoto.header}</b> 
            ${objOneFoto.insertDate} 
            ${objOneFoto.autor} 
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
let currentPhotoId = 1
let limit = 8;
let offset = 0;

function loadPicturesfromMySqlUniversal (limit, offset) {
  console.log(`offset: ${offset}`)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `ajax_receive_data_universal.php?limit=${limit}&offset=${offset}`, true);
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
        EightPhoto = JSON.parse(this.responseText);
        UI.loadImgList(EightPhoto);
        UI.slideShow();
      }
    }
    xhr.send();
}

loadPicturesfromMySqlUniversal(limit, offset);
  
function startPresentation() {
  loadPicturesfromMySqlUniversal(1, Math.floor(Math.random() * 100) + 1  )
}

let timer;
let showEightPhoto = 1;
document.querySelector('.play')     .addEventListener('click', () => {
  showEightPhoto = 0;
  timer = setInterval(startPresentation, 5000)
});

document.querySelector('.stop')     .addEventListener('click', () => clearInterval(timer));

document.querySelector('.next8')    .addEventListener('click', () => {
  showEightPhoto = 1;
  loadPicturesfromMySqlUniversal(limit, offset+=limit);
});

document.querySelector('.prev8')    .addEventListener('click', () => {
  showEightPhoto = 1;
  offset > 7 ? loadPicturesfromMySqlUniversal(limit, offset-=limit) : console.log(`offset: ${offset}`);
});

document.querySelector('.nextPhoto').addEventListener('click', () => {
   showEightPhoto = 0;
   loadPicturesfromMySqlUniversal(1, offset+=1);
 });

document.querySelector('.prevPhoto').addEventListener('click', () => {
  showEightPhoto = 0;
  offset > 0 ? loadPicturesfromMySqlUniversal(1, offset-=1) : console.log(`offset: ${offset}`);
});  