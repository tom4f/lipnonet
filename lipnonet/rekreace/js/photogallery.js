
"use strict";

// Class UI - all design 
class UI {

    static loadImgBig(bigImgUrl) {
      const bigImgInfo  =   document.querySelector('.photoInfo');
      const bigImgBlock =   document.querySelector('.main-img');


      
      // if index.php page than change css height from '100vh' to smaler
      const image = new Image();
      image.src = bigImgUrl;
      // add event handler 'onload' - execute function after img loaded
      image.onload = () => {
        const height  =  image.height * bigImgBlock.clientWidth /  image.width + 'px';
        if(isMainPage === 1 ) {
          bigImgBlock.style.height = height;
        } else {
            bigImgBlock.style.height = showEightPhoto ? `calc(100vh - 77px)` : '100vh'
        }
      }

      // create big background photo
      bigImgBlock.style.backgroundImage = "url('" + bigImgUrl + "')";

      // + add photo description
      const currentPhotoId = bigImgUrl
        .split(`fotogalerie${fotoGalleryOwner}/`)[1]
          .replace(/b.jpg/g,'');

      const objOneFoto = eightPhoto.find(onePhotoObject => onePhotoObject.id === currentPhotoId);

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

      eightPhoto = filteredPhoto.slice(offset, offset + limit);

      const photoUrlPath   = `fotogalerie${fotoGalleryOwner}/`;
      const eightImgsPlace =  document.querySelector('#imgsLocation');
      const eightImgsBlock =  document.querySelector('.imgs');
      const eightImgsAll   =  document.querySelectorAll('.eightImgsAll');

      let bigImgUrl = "";
      
      // hide 8 photos for some clicks
        if (
            event.target.classList == 'fas fa-arrow-right'  || event.target.classList == 'fas fa-arrow-left' ||
            event.target.classList == 'nextPhoto'           || event.target.classList == 'prevPhoto' ||
            event.target.classList == 'nextPhotoBig'        || event.target.classList == 'prevPhotoBig' ||           
            event.target.classList == 'fas fa-play-circle'  || event.target.classList == 'play'
            ) {
          showEightPhoto = false;
        } else {
          showEightPhoto = true;
        }


        // remove 8 small photo
        // if (eightImgsAll.length > 7)  eightImgsAll.forEach(img => img.remove());
        eightImgsAll.forEach(img => img.remove());
        
        // create 8 small photo 
        eightPhoto
          .forEach(onePhoto => {
              const div = document.createElement('div');
              div.style.backgroundImage = "url('" + photoUrlPath + onePhoto.id + ".jpg')";
              div.classList.add('eightImgsAll');
              div.innerHTML = onePhoto.id;
              if (bigImgUrl == "") bigImgUrl = `${photoUrlPath}${onePhoto.id}b.jpg`;
              if (showEightPhoto === true) {eightImgsBlock.insertBefore(div, eightImgsPlace);}
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


    static textOn() {
      const bigImgInfo  =   document.querySelector('.photoInfo');
      document.querySelector('.textOn').style.display = "none";
      document.querySelector('.textOff').style.display = "block";
      bigImgInfo.style.display = "block";
    }
    
    static textOff() {
      const bigImgInfo  =   document.querySelector('.photoInfo');
      document.querySelector('.textOn').style.display = "block";
      document.querySelector('.textOff').style.display = "none";
      bigImgInfo.style.display = "none";
  }
    static loadPicturesfromallPhoto(limit, offset, event){
      // show 8 small imgs
      UI.loadImgList(limit, offset, event);
      // add eventListeners for new 8 imgs
      UI.slideShow();
    }

}
// end of UI clas


// geearchCriteria from url
const urlValue = window.location.search.split('?searchCriteria=')[1];
// unescape = remove ASCI characters like space %20
urlValue ? searchCriteria = unescape( urlValue || 'WHERE typ < 10' ).replace(/'/g, "") : null;

const isMainPage = typeof fotoGalleryMainPage === 'undefined' ? 0 : fotoGalleryMainPage;

const loadPicturesfromMySqlStartPage = (limit, offset, event) => {
    var xhr = new XMLHttpRequest();
    //xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read.php`, true);
    xhr.open('POST', `api/pdo_read.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function(){
      if (this.readyState == 4 && this.status == 200) {
        filteredPhoto = allPhoto = JSON.parse(this.responseText);
        UI.loadPicturesfromallPhoto(limit, offset, event);
      }
    }
    xhr.send(JSON.stringify({
      'fotoGalleryOwner' : fotoGalleryOwner,
      'searchCriteria' : searchCriteria
    }));
}

const startPresentation = (event) => {
  offset = 0;
  const Presentation = () => {
    const randomNumber = Math.floor(Math.random() * filteredPhoto.length);
    UI.loadPicturesfromallPhoto(1, randomNumber, event);
  }
  timer = setInterval(Presentation, 5000);
  document.querySelector('.play').style.display = "none";
  document.querySelector('.stop').style.display = "block";
}

const stopPresentation = (event) => {
  clearInterval(timer);
  document.querySelector('.play').style.display = "block";
  document.querySelector('.stop').style.display = "none";
}



const createCategoryList = () =>{

  const allPhotoSum = allPhoto.length;

  // calculate number of photos per category
  const reducer = (sumPerCat, oneEntry) => {
    if (oneEntry.typ in sumPerCat) {
        sumPerCat[oneEntry.typ]++;
    } else {
        sumPerCat[oneEntry.typ] = 1;
    }
    return sumPerCat
  }

  const summary = { 
    99999 : allPhotoSum,
    ...allPhoto.reduce(reducer, {})
  }

  dynamicSelect = {
    header : '',
    article : ''
  };

  // using `for...of` loop
  // for (const element of array1) {
  for (const [key, value] of Object.entries(summary) ) {
    dynamicSelect.header  += `<p class="oneCategory" id="${key}">${categoryName[key]}</p>`;
    dynamicSelect.article += `<p class="oneCategory" id="${key}">${value}</p>`;
  }
}

const showCategory = (event) => {

  createCategoryList();

  const categoryList = document.querySelector('.categoryList');
  
  categoryList.style.display = 'block';
  categoryList.innerHTML = `
      <fieldset>
          <legend>Kategorie / počet fotek</legend>
              <section>    
                  <header>
                    ${dynamicSelect.header}
                  </header>
                  <article>
                    ${dynamicSelect.article}
                  </article>
              </section>
      </fieldset>
  `;

  const allCategory = document.querySelectorAll('.oneCategory');

  allCategory.forEach( value => value.addEventListener('click', () => {
    filteredPhoto = value.id === '99999'
      ? allPhoto
      : allPhoto.filter( one => one.typ === value.id );
    UI.loadPicturesfromallPhoto(limit, offset, event);
  }))

  categoryList.addEventListener('mouseleave', () => categoryList.style.display = 'none');
}




let eightPhoto = [];
let allPhoto = [];
let filteredPhoto = [];
let limit = 8;
let offset = 0;
let timer;
let showEightPhoto = true;
let dynamicSelect = {};

document.querySelector('.textOn').style.display = "none";
document.querySelector('.stop')  .style.display = "none";


// main JS script started when DOM loaded
document                            .addEventListener('DOMContentLoaded',  (event) => loadPicturesfromMySqlStartPage (limit, offset, event));
//
document.querySelector('.stop')     .addEventListener('click', (event) => stopPresentation(event));
document.querySelector('.play')     .addEventListener('click', (event) => startPresentation(event));
//
document.querySelector('.next8')    .addEventListener('click', (event) => UI.loadPicturesfromallPhoto(limit, offset+=limit, event));
document.querySelector('.prev8')    .addEventListener('click', (event) => offset > 7 ? UI.loadPicturesfromallPhoto(limit, offset-=limit, event) : console.log(`offset: ${offset}`));
//
document.querySelector('.nextPhoto').addEventListener('click', (event) => UI.loadPicturesfromallPhoto(1, offset+=1, event));
document.querySelector('.prevPhoto').addEventListener('click', (event) => offset > 0 ? UI.loadPicturesfromallPhoto(1, offset-=1, event) : console.log(`offset: ${offset}`));  
//
document.querySelector('.nextPhotoBig').addEventListener('click', (event) => UI.loadPicturesfromallPhoto(1, offset+=1, event));
document.querySelector('.prevPhotoBig').addEventListener('click', (event) => offset > 0 ? UI.loadPicturesfromallPhoto(1, offset-=1, event) : console.log(`offset: ${offset}`));  
//
document.querySelector('.textOn')   .addEventListener('click', () => UI.textOn());
document.querySelector('.textOff')  .addEventListener('click', () => UI.textOff());
//
document.querySelector('.category') .addEventListener('mouseover', (event) => showCategory(event));

// button PLAY dummy click from JavaScript - start slideShow at start
//let autoEvent = new CustomEvent('click');
//autoEventButton.dispatchEvent(autoEvent);