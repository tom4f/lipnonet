"use strict";

class UI {

  static removeAllDispEntries() {
    const allDispEntries = document.querySelectorAll('.kniha_one_entry');
    allDispEntries.forEach( oneItem => oneItem.remove());
  } 

  static showOneEntry(oneItem, place) {
    const knihaPlace = document.querySelector(place);
    const divOneEntry = document.createElement('div');
    divOneEntry.classList.add('kniha_one_entry');
    const date = oneItem.datum ? oneItem.datum.slice(0,10) : new Date().toISOString().slice(0,10);
    const typText = [
      'Fórum',
      'Inzerce',
      'Seznamka',
      'K obsahu stránek',
      'noname1',
      'noname2',
    ];
    
    const nameEmail = oneItem.email ? `<a href="mailto:${oneItem.email}">${oneItem.jmeno}</a>` : oneItem.jmeno;

    divOneEntry.innerHTML = (`
      <div class="kniha_datum">   ${typText[oneItem.typ]} - ${date}</div>  
      <div class="kniha_jmeno"><b>${nameEmail}</b></div>
      <div class="kniha_text" >   ${oneItem.text}</div>
      `);
    knihaPlace.appendChild(divOneEntry);
  }

  static showForum(begin, end, arrayName) {
    let onePageForum = arrayName.slice(begin, end + 1);
    // remove forum
    UI.removeAllDispEntries();
    onePageForum.forEach( (oneItem) => {
      UI.showOneEntry(oneItem, '.kniha_main');
    });
    console.log(`showForum: arrayName.length=${arrayName.length}, begin=${begin}, end=${end}`);
  }

  static showPagination(inputArray, location) {
    const paginateSize = 10;
    const placePagination = document.querySelector(location);
    const lastPage = inputArray.length;
    let buttonPageList = '';
    
    buttonPageList +=  `<button value="paginaPrev" class="paginaPrev"> <-- </button>`;
    for( let i = next; i < lastPage / postsPerPage; i++ ){
        if( i < next + paginateSize ){
            buttonPageList +=  `<button class="pagina">${i}</button>`;
        }
    }
    buttonPageList +=  `<button value="paginaNext" class="paginaNext"> --> </button>`;
    placePagination.innerHTML = buttonPageList;

    const pageButtonClick = (event) => {
      const buttonText = event.target.textContent || event.target.innerText;
      // Convert different object values to their numbers
      begin = (1 + postsPerPage) * Number(buttonText);
      end = begin + postsPerPage;
      console.log(`PAGE click: buttonText=${buttonText}, begin=${begin}, end=${end}`);
      UI.showForum(begin, end, inputArray);
    }

    const paginaButtonClick = (next, event) => {
      //const buttonText = event.target.textContent || event.target.innerText;
      const buttonText = event.target.value;
      console.log(`NEXT/PREV: begin=${begin}, end=${end}, next= ${next} - buttonText= ${buttonText}`);
      UI.showPagination(inputArray, '.kniha_pagination');
    }

    // add event listener for all page buttons
    const pageButtonListener = document.querySelectorAll('.pagina');
    pageButtonListener.forEach( one => one.addEventListener('click', (event) => pageButtonClick(event) ));
  
    const pageButtonNext = document.querySelector('.paginaNext');
    if (next < (lastPage / (postsPerPage + 1)) - paginateSize ) pageButtonNext.addEventListener('click', (event) => paginaButtonClick(next+=paginateSize, event) );
      else console.log(`${next} < ${(lastPage / end) - paginateSize}`);

    const pageButtonPrev = document.querySelector('.paginaPrev');
    if (next > paginateSize - 1) pageButtonPrev.addEventListener('click', (event) => paginaButtonClick(next-=paginateSize, event) );
  }
}

class UIform {
  // show alert
  static showAlert(text, color) {
    const node = document.createElement("LI");
    const textnode = document.createTextNode(text);
    node.appendChild(textnode);
    node.style.backgroundColor = color;
    const ul = document.querySelector('#showAlert');
    ul.appendChild(node);
    // Vanish(remove) DOM with class name 'alert' after 3 second
    setTimeout( 
        () => ul.removeChild(ul.childNodes[0]) ,
        5000            
    );
  }

  // filtered forum
  static filteredForum() {
    const filteredForum = event.target.value == 999999 ? allForum : allForum.filter( one => one.typ == event.target.value );
    begin = 0;
    end = begin + postsPerPage;
    UI.showForum(begin, end, filteredForum);
    UI.showPagination(filteredForum, '.kniha_pagination');

}

  static showFormular() {
    kniha_formular.style.display = "block";
    console.log('hidden');
    UIform.antiSpam();
  }

  static hideFormular() {
    // hide / show formular
    const kniha_formular = document.getElementById('kniha_formular');
    kniha_formular.style.display = "none";

  }

  static antiSpam() {
    // antispam for formular
    // miliSeconds = new Date().getMilliseconds();
    let antiSpamInput = document.getElementById('antispam');
    antiSpamInput.placeholder = miliSeconds;
  }

}



// start kniha.php
let allForum = [];
let filteredForum = [];
let begin = 0;
let postsPerPage = 9;
let end = begin + postsPerPage;
let next = 0;
let miliSeconds = new Date().getMilliseconds();;

const loadForumfromMySqlStartPage = () => {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `api/pdo_read_forum.php`, true);
  xhr.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        allForum = JSON.parse(this.responseText);
        UI.showForum(begin, end, allForum);
        UI.showPagination(allForum, '.kniha_pagination');

      }
  }
  xhr.send();
  //xhr.send(JSON.stringify({ 'sqlQuery' : 'read'}));
}

const loadForumfromMySqlStartPageTen = () => {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', `api/pdo_read_forum.php`, true);
  xhr.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        allForum = JSON.parse(this.responseText);
        UI.showForum(begin, end, allForum);
        UI.showPagination(allForum, '.kniha_pagination');

        setTimeout(loadForumfromMySqlStartPage, 5000);
      }
  }
  //xhr.send();
  xhr.send(JSON.stringify({'start' : 0, 'limit' : 5}));
}

UIform.hideFormular();
loadForumfromMySqlStartPageTen();
// END start kniha.php





// live search
const searchForumLocaly = searchText => {
  const matchList = document.querySelector('#kniha-list-filtered');
  UI.removeAllDispEntries();
  let filteredForum = allForum.filter( alarm => {
    const regex = new RegExp(`${searchText}`, 'gi');
    // const regex = new RegExp(`^${searchText}`, 'gi');
    return alarm.text.match(regex) || alarm.jmeno.match(regex);
  });
  // clear search table if no searchText entered or searchText does not match 
  if( searchText.length === 0 ) {
      UI.showForum(begin, end, allForum);
      UI.showPagination(allForum, '.kniha_pagination');
  } else if (filteredForum.length === 0 ) {
      filteredForum = [];
      matchList.innerHTML = '';
    } else { 
        begin = 0;
        end = begin + postsPerPage;
        UI.showForum(begin, end, filteredForum);
        UI.showPagination(filteredForum, '.kniha_pagination');
      }
}



// Send all formular data together with img as JSON
const sendForumToMySql = (e) => {
  console.log('submit');
  e.preventDefault();
  let FD = new FormData(formular); 
  // all form data to object
  let object = {};
  FD.forEach( (value, key) => object[key] = value );
  if (Number(object.antispam) === miliSeconds) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/pdo_create_forum.php', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    //const objectWithImg = Object.assign(resp, object);
    xhr.onload = function(){
    if (this.readyState == 4 && this.status == 200) {
            UIform.showAlert('Záznam byl přidán !', 'green')
            UI.showOneEntry(object, '.kniha_new_entry');
            // reset all fields in form
            UIform.hideFormular();
            const form = document.getElementById('formular');
            form.reset();
            kniha_formular.style.display = "none";
    } else if(this.status = 404){
        UIform.showAlert('404 : Záznam nebyl přidán !', 'red');
      }
    }
    xhr.send(JSON.stringify(object));

  } else {
      UIform.showAlert('Antispam : Záznam nebyl přidán !', 'red');
  }
  console.log(`object.antispam = ${object.antispam}, miliSeconds = ${miliSeconds}`);
}


document.querySelector('#formular').  addEventListener('submit',    sendForumToMySql );
document.querySelector('#livesearch').addEventListener('input',     () => searchForumLocaly(livesearch.value));
document.querySelector('#submit').    addEventListener('mouseover', () => UIform.showFormular());
document.querySelector('#typfilter'). addEventListener('change',    () => UIform.filteredForum());