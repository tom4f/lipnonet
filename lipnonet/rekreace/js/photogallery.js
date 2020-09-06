"use strict";

// get searchCriteria from url
const urlValue = window.location.search.split('?searchCriteria=')[1];
// unescape = remove ASCI characters like space %20
urlValue ? searchCriteria = unescape( urlValue || 'WHERE typ < 10' ).replace(/'/g, "") : null;

// Class UI - all design 
class UI {

    static loadImgBig(bigImgUrl) {


      const bigImgBlock =   document.querySelector('.main-img');
      
      // if index.php page than change css height from '100vh' to smaler
      const image = new Image();
      image.src = bigImgUrl;
      // add event handler 'onload' - execute function after img loaded
      image.onload = () => {
        const height  =  image.height * bigImgBlock.clientWidth /  image.width + 'px';
        //bigImgInfo.style.bottom = '0px';  
        if(isMainPage === 1 ) {
          bigImgBlock.style.height = height;
          } else {
            //bigImgInfo.style.top = `${height}px`;
            console.log(height);
          }
      }

      // create big background photo
      bigImgBlock.style.backgroundImage = "url('" + bigImgUrl + "')";

      // + add photo description
      const currentPhotoId = bigImgUrl
        .split(`fotogalerie${fotoGalleryOwner}/`)[1]
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
  
      // fix font size for index.php
      if (isMainPage === 1) {  
        bigImgInfo.style.fontSize = "1rem";
      }
      if (isMainPage === 2) {
      const formNames = (formName, value) => {
        document.getElementById('formular').elements.namedItem(formName).value = value;
      }
        formNames('id',     objOneFoto.id);
        formNames('header', objOneFoto.header);
        formNames('typ',    objOneFoto.typ);
        formNames('date',   objOneFoto.date);
        formNames('text',   objOneFoto.text);
        formNames('autor',  objOneFoto.autor);
        formNames('header', objOneFoto.header);
        formNames('email',  objOneFoto.email);
        imgNumberPlace.innerHTML = `Upravujete foto č. ${objOneFoto.id}, nebo vkládáte nové foto`;
      }


      // add fade in class
      bigImgBlock.classList.add('fade-in');

      // remove fade in class after 0.5s
      setTimeout(() => bigImgBlock.classList.remove('fade-in'), 500);

    }


    static loadImgList(limit, offset, event) {

      EightPhoto = AllPhoto.slice(offset, offset + limit);
      console.log(`offset = ${offset}, limit = ${limit}`);

      if (event !=0) console.log(`event.target.classList: ${event.target.classList}`);

        const photoUrlPath   = `fotogalerie${fotoGalleryOwner}/`;
        const eightImgsPlace =  document.querySelector('#imgsLocation');
        const eightImgsBlock =  document.querySelector('.imgs');
        const eightImgsAll   =  document.querySelectorAll('.eightImgsAll');

        let bigImgUrl = "";
        
        // hide 8 photos for some clicks
        if (event !=0) {
          if (
              event.target.classList == 'fas fa-arrow-right'  || event.target.classList == 'fas fa-arrow-left' ||
              event.target.classList == 'nextPhoto'           || event.target.classList == 'prevPhoto' ||
              event.target.classList == 'nextPhotoBig'        || event.target.classList == 'prevPhotoBig' ||           
              event.target.classList == 'fas fa-play-circle'  || event.target.classList == 'play'
              ) {
            showEightPhoto = 0;
          } else {
            showEightPhoto = 1;
          }
        } 

        // remove 8 small photo
        // if (eightImgsAll.length > 7)  eightImgsAll.forEach(img => img.remove());
        eightImgsAll.forEach(img => img.remove());
        
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



const isMainPage = typeof fotoGalleryMainPage === 'undefined' ? 0 : fotoGalleryMainPage;
console.log('isMainPage : ' + isMainPage);


let EightPhoto = [];
let AllPhoto = [];
let limit = 8;
let offset = 0;
let timer;
let showEightPhoto = 1;
let infoText = 1;
const bigImgInfo  =   document.querySelector('.photoInfo');
document.querySelector('.textOn').style.display = "none";



const loadPicturesfromAllPhoto = (limit, offset, event) => {
    // show 8 small imgs
    UI.loadImgList(limit, offset, event);
    // add eventListeners for new 8 imgs
    UI.slideShow();
}

const loadPicturesfromMySqlStartPage = (limit, offset, event) => {
    var xhr = new XMLHttpRequest();
    //xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read.php`, true);
    xhr.open('POST', `api/pdo_read.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
        AllPhoto = JSON.parse(this.responseText);
        loadPicturesfromAllPhoto(limit, offset, event);
      }
    }
    xhr.send(JSON.stringify({
      'fotoGalleryOwner' : fotoGalleryOwner,
      'searchCriteria' : searchCriteria
    }));
}

const startPresentation = (event) => {
  console.log('autoEvent')
  const Presentation = () => loadPicturesfromAllPhoto(1, (Math.floor(Math.random() * AllPhoto.length) + 1), event);
  timer = setInterval(Presentation, 5000);
  document.querySelector('.play').style.display = "none";
  document.querySelector('.stop').style.display = "block";
}

const stopPresentation = (event) => {
  clearInterval(timer);
  document.querySelector('.play').style.display = "block";
  document.querySelector('.stop').style.display = "none";
  console.log(infoText);
}

const textOn = (event) => {
  infoText = 1;
  document.querySelector('.textOn').style.display = "none";
  document.querySelector('.textOff').style.display = "block";
  console.log(infoText);
  bigImgInfo.style.display = "block";
}

const textOff = (event) => {
  infoText = -1;
  document.querySelector('.textOn').style.display = "block";
  document.querySelector('.textOff').style.display = "none";
  console.log(infoText);
  bigImgInfo.style.display = "none";
}

const showCategory = (event) => {
  console.log('category !');
  const categoryListPlace = document.querySelector('.categoryList');
  categoryListPlace.style.display = 'block'

  const categoryList = document.querySelector('.categoryList');
  categoryList.innerHTML = `
      <fieldset>
          <legend>Vyber kategorii</legend>
              <section>    
                  <header>
                    <p class="oneCategory" id="0">Ubytování</p>
                    <p class="oneCategory" id="1">Lipenská přehrada</p>
                    <p class="oneCategory" id="2">Příroda</p>
                    <p class="oneCategory" id="3">Obce</p>
                    <p class="oneCategory" id="4">Historie</p>
                    <p class="oneCategory" id="5">Sport</p>
                    <p class="oneCategory" id="6">Ostatní</p>
                    <p class="oneCategory" id="10">Kaliště</p>
                  </header>
                  <article>
                      <p></p>
                      <p></p>
                      <p></p>
                      <p></p>
                      <p></p>
                      <p></p>
                      <p></p>
                      <p></p>
                  </article>
              </section>
      </fieldset>
  `;

  const allCategory = document.querySelectorAll('.oneCategory');
  allCategory.forEach( value => value.addEventListener('click', () => {
    console.log(value.id);
    searchCriteria = `WHERE typ = ${+value.id}`;
    loadPicturesfromMySqlStartPage (limit, offset, event);
  }  ) )

  categoryListPlace.addEventListener('mouseleave', () => categoryListPlace.style.display = 'none');


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
//
document.querySelector('.nextPhotoBig').addEventListener('click', (event) => loadPicturesfromAllPhoto(1, offset+=1, event));
document.querySelector('.prevPhotoBig').addEventListener('click', (event) => offset > 0 ? loadPicturesfromAllPhoto(1, offset-=1, event) : console.log(`offset: ${offset}`));  
//
document.querySelector('.textOn')   .addEventListener('click', (event) => textOn(event));
document.querySelector('.textOff')  .addEventListener('click', (event) => textOff(event));
//
document.querySelector('.category') .addEventListener('mouseover', (event) => showCategory(event));


// button PLAY dummy click from JavaScript - start slideShow at start
//let autoEvent = new CustomEvent('click');
//autoEventButton.dispatchEvent(autoEvent);