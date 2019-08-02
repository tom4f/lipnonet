"use strict";

// Class UI - all design 
class UI {

    static loadImgList(EightPhoto) {

        const eightImgsPlace =  document.querySelector('#imgsLocation');
        const eightImgsBlock =  document.querySelector('.imgs');
        const imgsDiv =         document.querySelectorAll('.imgsDiv');

        const bigImgPlace =     document.querySelector('#imgLocation');
        const bigImgBlock =     document.querySelector('.main-img');
        const photoInfo =       document.querySelector('.photoInfo');

        let bigImgUrl = "";
        
        // remove 8 small photo
        if (imgsDiv.length > 7)  imgsDiv.forEach(img => img.remove());
        
        // create 8 small photo 
        EightPhoto
            .forEach(onePhoto => {
                const div = document.createElement('div');
                div.style.backgroundImage = "url('../lipnonet/rekreace/fotogalerie/" + onePhoto.id + ".jpg')";
                div.style.backgroundSize = "cover";
                div.style.width = "auto";
                div.style.height = "100px";
                div.innerHTML = onePhoto.id;
                div.classList.add('imgsDiv');
                if (bigImgUrl == "") bigImgUrl = `../lipnonet/rekreace/fotogalerie/${onePhoto.id}b.jpg`;
                eightImgsBlock.insertBefore(div, eightImgsPlace);
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
        const objOneFoto = EightPhoto[0];
        currentPhotoId = imgBig.src.substring(47, 50);
        photoInfo.innerHTML = `
            ${currentPhotoId} - 
            <b>${objOneFoto.header}</b> -
            ${objOneFoto.insertDate} -
            ${objOneFoto.autor}<br>
            ${objOneFoto.text}
            `;
    }



    static imgClick(event) {
      const imgsDiv =   document.querySelectorAll('.imgs div');
      const photoInfo = document.querySelector('.photoInfo');
      const current =   document.querySelector('.currentnew');
      const opacity = 0.4;
      
      // reset opacity for all imgs
      imgsDiv.forEach(div => (div.style.opacity = 1));

      // change current img to src of clicked image
      const divUrl = event.target.style.backgroundImage
            .replace(/url\("/g, "")
              .replace(/.jpg"\)/g, "b.jpg");
      current.src = divUrl;

      // + add photo description
      currentPhotoId = divUrl
          .replace(/..\/lipnonet\/rekreace\/fotogalerie\//g, "")
            .replace(/b.jpg/g, "");
      const objOneFoto = EightPhoto.find(onePhotoObject => onePhotoObject.id === currentPhotoId);
        photoInfo.innerHTML = `
          ${currentPhotoId} - 
          <b>${objOneFoto.header}</b> -
          ${objOneFoto.insertDate} -
          ${objOneFoto.autor}<br>
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
        const imgsDiv =   document.querySelectorAll('.imgsDiv');
        imgsDiv.forEach(img => img.addEventListener('click', (event) => UI.imgClick(event) ));
    }


}







let EightPhoto = [];
let currentPhotoId = 1
let limit = 8;
let offset = 0;

function loadPicturesfromMySqlUniversal (limit, offset) {
    var xhr = new XMLHttpRequest();
   // xhr.open('GET', `ajax_receive_data_universal.php?request=${selected}`, true);
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
  console.log('Presentation started');
  console.log(timer);
  loadPicturesfromMySqlUniversal(1, Math.floor(Math.random() * 100) + 1  )
}

let timer;
document.querySelector('.play') .addEventListener('click', () => timer = setInterval(startPresentation, 5000));
document.querySelector('.stop') .addEventListener('click', () => clearInterval(timer));

document.querySelector('.next8').addEventListener('click', () => loadPicturesfromMySqlUniversal(limit, offset+=8));
document.querySelector('.prev8').addEventListener('click', () => loadPicturesfromMySqlUniversal(limit, offset-=8));  