"use strict";

// Class UI - all design 
class UI {

    static loadImgList(EightPhoto) {

        const eightImgsPlace =  document.querySelector('#imgsLocation');
        const eightImgsBlock =  document.querySelector('.imgs');
        const imgs =            document.querySelectorAll('.imgs img');

        const bigImgPlace =     document.querySelector('#imgLocation');
        const bigImgBlock =     document.querySelector('.main-img');
        const photoInfo =       document.querySelector('.photoInfo');

        let bigImgUrl = "";
        
        imgs.forEach(img => img.remove());
        
        // EightPhoto
        //     .forEach(onePhoto => {
        //         const img = document.createElement('img');
        //         img.src =   `../lipnonet/rekreace/fotogalerie/${onePhoto.id}.jpg`;
        //         if (bigImgUrl == "") bigImgUrl = `../lipnonet/rekreace/fotogalerie/${onePhoto.id}b.jpg`;
        //         eightImgsBlock.insertBefore(img, eightImgsPlace);
        //     })

        EightPhoto
            .forEach(onePhoto => {
                const div = document.createElement('div');
                div.style.backgroundImage = "url('../lipnonet/rekreace/fotogalerie/" + onePhoto.id + ".jpg')";
                div.style.backgroundSize = "cover";
                div.style.width = "auto";
                div.style.height = "100px";
                div.innerHTML = "Hello";
                div.classList.add('tomasDiv');
                if (bigImgUrl == "") bigImgUrl = `../lipnonet/rekreace/fotogalerie/${onePhoto.id}b.jpg`;
                
                eightImgsBlock.insertBefore(div, eightImgsPlace);
              })

            document.querySelectorAll('.tomasDiv').forEach( (dummyDiv) => console.log(dummyDiv.style.backgroundImage));


            const imgsBig = document.querySelectorAll('.currentnew');
            imgsBig.length > 0 ? imgsBig[0].remove() : console.log('<') ;
            const imgBig = document.createElement('img');
            //current.src = imgBigUrl;
            imgBig.src = bigImgUrl;
            imgBig.classList.add('currentnew');
            bigImgBlock.insertBefore(imgBig, bigImgPlace);

            const objOneFoto = EightPhoto[0];
            currentPhotoId = imgBig.src.substring(47, 50);
            photoInfo.innerHTML = `
            <b>Id</b> :     ${currentPhotoId} - 
            <b>Nazev</b> :  ${objOneFoto.header} - 
            <b>Popis</b> :  ${objOneFoto.text} - 
            <b>Datum</b> :  ${objOneFoto.insertDate} -
            <b>Autor</b> :  ${objOneFoto.autor}
            `;
    }



    static imgClick(event) {
      const imgs =      document.querySelectorAll('.imgs img');
      const photoInfo = document.querySelector('.photoInfo');
      const current =   document.querySelector('.currentnew');
      const opacity = 0.4;
        // reset opacity for all imgs

      imgs.forEach(img => ( console.log(img.style.opacity)));
      imgs.forEach(img => (img.style.opacity = 1));
        // change current img to src of clicked image
      
      console.log('after');
      imgs.forEach(img => ( console.log(img.style.opacity)));

        //current.src = event.target.src.replace(/.jpg/g, "b.jpg");

        const divUrl = event.target
          .style.backgroundImage
            .replace(/url\("/g, "")
              .replace(/.jpg"\)/g, "b.jpg");

         current.src = divUrl;
////url("../lipnonet/rekreace/fotogalerie/577.jpg")

        // + add photo description
        // currentPhotoId = event.target.src.substring(47, 50);
        currentPhotoId = divUrl
          .replace(/..\/lipnonet\/rekreace\/fotogalerie\//g, "")
            .replace(/b.jpg/g, "");


        const objOneFoto = EightPhoto.find(onePhotoObject => onePhotoObject.id === currentPhotoId);
        photoInfo.innerHTML = `
          <b>Id</b> :     ${currentPhotoId} - 
          <b>Nazev</b> :  ${objOneFoto.header} - 
          <b>Popis</b> :  ${objOneFoto.text} - 
          <b>Datum</b> :  ${objOneFoto.insertDate} -
          <b>Autor</b> :  ${objOneFoto.autor}
          `;
        // add fade in class
        current.classList.add('fade-in');
        // remove fade in class after 0.5s
        setTimeout(() => current.classList.remove('fade-in'), 500);
        // change opacity
        event.target.style.opacity = opacity;
    }



    static slideShow() {
        const imgs =      document.querySelectorAll('.imgs img');
        const imgsDiv =   document.querySelectorAll('.tomasDiv');
        const opacity = 0.4;
        // set first image opacity
        //imgs[0].style.opacity = opacity;
        imgs.forEach(img => img.addEventListener('click', (event) => UI.imgClick(event) ));

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

document.querySelector('.next8').addEventListener('click', () => loadPicturesfromMySqlUniversal(limit, offset+=8));
document.querySelector('.prev8').addEventListener('click', () => loadPicturesfromMySqlUniversal(limit, offset-=8));

  
function myFunction() {
  console.log('Timer');
  loadPicturesfromMySqlUniversal(1, Math.floor(Math.random() * 100) + 1  )
}

function stopPresentation(){
  console.log('stop');
  clearInterval(timer)
}

let timer;

document.querySelector('.play').addEventListener('click', () =>  setInterval( timer = setInterval( myFunction, 5000)  , 5000) );

document.querySelector('.stop').addEventListener('click', () =>  stopPresentation() );


  


  