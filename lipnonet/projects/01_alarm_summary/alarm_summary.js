// http://youmightnotneedjquery.com//

"use strict";

let searchCond = {
  search_name   : true,
  search_source : true,
  search_first  : true,
  search_latest : true,
  searchText : ''
}


let alarmSummaryForAllFiles = [];
let sortOrder = 1;
// show details after on-mouse-over place
let alarmDetailTd;

const startAlarmSummary = (e, source ) => {
  // Prevent actual submit
  //e.preventDefault();
  alarmSummaryForAllFiles = [];
  UI.showEmptyAlarmSummary();
  
  if ( source === 'dragDropInput' ) {
      const reader = new FileReader();
      reader.readAsDataURL( document.getElementById('input').files[0] );
      reader.onload = () => {
          document.getElementById('drop-src').src = reader.result;
          // same :
          // document.getElementById('drop-src').src = event.target.result;
      }
  }

  if ( source === 'dragDrop' ) {
      e.preventDefault;
      document.getElementById('drop-src').src = URL.createObjectURL( e.dataTransfer.items[0].getAsFile() );
  }


  // file upload
  if ( source === 'newupload' ) {

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //const newFiles = document.querySelector('input[type=file]');
        const newFiles = document.querySelector('#newupload');
        const filesLength = newFiles.files.length;

        for (let i=0; i < filesLength ; i++) {
            const { lastModified, name, size } = newFiles.files[i];
            const newLastModified = new Date(lastModified);
            const fileDate = `
                ${ newLastModified.getDate()}.
                ${ newLastModified.getMonth() + 1}.
                ${ newLastModified.getFullYear()}
            `
            // As FileReader inherits from EventTarget, all those events can also be listened for by using the addEventListener method.
            let reader = new FileReader();
            reader.readAsText(newFiles.files[i]);

            // const textFile = /text.*/;
            // if (newFiles.files[i].type.match(textFile)) {
           
            // This event is triggered each time the reading operation is successfully completed.
            reader.onload      = () => {
                console.log(`${ new Date().getMilliseconds() } onload,   readyState : ${reader.readyState}` );

                const alarmText = reader.result;
                // same :
                // const alarmText = event.target.result;
                showAlarmTable(alarmText, name, size, fileDate);
            }

            reader.onloadstart = () => console.log(`${ new Date().getMilliseconds() } onloadstart, readyState : ${reader.readyState}` );
            reader.onprogress  = () => console.log(`${ new Date().getMilliseconds() } onprogress,  readyState : ${reader.readyState}` );
            // This event is triggered each time the reading operation is completed (either in success or failure)
            reader.onloadend   = () => console.log(`${ new Date().getMilliseconds() } onloadend,   readyState : ${reader.readyState}` );
        }
    }
  }

  // load demo files
  if ( source === 'demo' ) {
      
      const getTextFromOneFile = (fileName) => {
          fetch(`test/${fileName}`)
            .then( (res)  => res.text() )
            .then( (alarmText) => {
                showAlarmTable(alarmText, fileName, 0, '--.--.----');
            })
          // to handle errors :
          .catch( (error) => console.log(error) );
      }

      const demoFiles = [
        'MGW_GR_C_2020-03-16_09-46-03_Config.log',
        'MGW_GR_C_2020-03-16_09-47-57_Config.log',
        'MGW_GR_D_2020-03-16_09-46-11_Config.log',
        'MGW_GR_D_2020-03-16_09-48-03_Config.log',
        'MGW_WR_C_2020-03-16_09-45-51_Config.log',
        'MGW_WR_C_2020-03-16_09-47-44_Config.log',
        'MGW_WR_D_2020-03-16_09-45-57_Config.log',
        'MGW_WR_D_2020-03-16_09-47-50_Config.log',
        'MGW_WR_Test_2020-03-16_09-46-18_Config.log',
        'MGW_WR_Test_2020-03-16_09-48-08_Config.log',
        'MSS_GR_B_2020-03-16_09-34-43.txt',
        'MSS_GR_B_2020-03-16_09-39-45.txt',
        'MSS_GR_C_2020-03-16_09-36-24.txt',
        'MSS_GR_C_2020-03-16_09-39-50.txt',
        'MSS_WR_B_2020-03-16_09-31-24.txt',
        'MSS_WR_B_2020-03-16_09-39-32.txt',
        'MSS_WR_C_2020-03-16_09-33-06.txt',
        'MSS_WR_C_2020-03-16_09-39-38.txt',
        'MSS_WR_D_Ref_2020-03-16_09-30-44.txt',
        'MSS_WR_D_Ref_2020-03-16_09-39-26.txt',
      ];

      for (let i=0; i < demoFiles.length ; i++) {
          getTextFromOneFile( demoFiles[i] );
      }
  }
  
  // work around - how to wait if table is rendered
  UI.updEventListener();
}

const showAlarmTable = (alarmText, fileName,  fileSize, fileDate) => {
  UI.addHtmlHeaderForSummary(fileName, fileSize, fileDate);
    let AlarmSummaryForOneFile = createAlarmSummaryForOneFile (alarmText, fileName);
    alarmSummaryForAllFiles = alarmSummaryForAllFiles.concat(AlarmSummaryForOneFile);
    AlarmSummaryForOneFile
      .forEach( dummyArrayEntry => { 
        UI.addHtmlAlarmToSummary(dummyArrayEntry);
    });
}




// alarm summary for one fileName
const createAlarmSummaryForOneFile = (alarmText, fileName) => {
    
    // whole text file divided separate Alarms = array
    const parseRule = [
        [/     ....-..-.. ..:..:..[.]../g,        /(?=     ....-..-.. ..:..:..[.]..)/g, 4, 71, 2, 1, 0, 11, 'IPA MGW',        0],
        [/....-..-..  ..:..:..[.]../g,            /(?=....-..-..  ..:..:..[.]..)/g,    11, 82, 2, 1, 0, 11, 'DX200 MSS',      2],
        [/Specific problem         : /g,          /Specific problem         : /g,       0, 67, 0, 3, 0, 11, 'ATCA MGW',       5],
        [/NO ALARMS WITH GIVEN PARAMETERS/g,      '',                                   0, 67, 0, 3, 0, 11, 'n/a',            0],
        [/No events matched the given criteria/g, /00]/g,                               0, 37, 1, 1, 0, 11, 'empty ATCA MGW', 0]
    ];

    // let alarmText = fs.readFileSync(path.join(__dirname, '/test', fileName), 'utf8');
    
    let alarms = '';

    let alarmStart;
    let alarmStop;
    let alarmPosition;
    let prioPosition;
    let prioStart;
    let prioStop;
    let elementType;
    let cutLastLine;

    parseRule.forEach(rule => {
      const [ alarmDetect, alarmBlock ] = rule;
      if (alarmText.search(alarmDetect) > 0) {
        // all alarms in array
        alarms = alarmText.split(alarmBlock);
        [ ,,
          alarmStart,
          alarmStop,
          alarmPosition,
          prioPosition,
          prioStart,
          prioStop,
          elementType,
          cutLastLine
        ] = rule;      
      }
    });

    // remove first element - this is not alarm
    alarms.shift();

    let alarmWithCount  = [];
    let alarmSummary    = [];

    // single alarm from all alarms array
    alarms.forEach(alarm => {
        let onePriority;      
        // one alarm lines into array
        let fullAlarmArray = alarm.split('\r\n');
        // remove last not needed lines form each alarm
        fullAlarmArray.splice(fullAlarmArray.length - cutLastLine, cutLastLine);
        // generate one shorter alarm text
        const fullAlarmText = fullAlarmArray.join('\r\n');
        // get alarm name text
        const oneAlarm = fullAlarmArray[alarmPosition]
          .substring(alarmStart, alarmStop)
          .trim();

        if (elementType === 'ATCA MGW') {
            onePriority = alarm
            .split('Severity                 : ')[1]
            .substring(prioStart, prioStop)
            .trim();
        } else {
            onePriority = fullAlarmArray[prioPosition]
            .substring(prioStart, prioStop)
            .trim();
        }

        if( alarmSummary.some( dummyAlarm => dummyAlarm === oneAlarm ) ) {
          // if alarm name already stored
          const actualIndex = alarmSummary.indexOf(oneAlarm);
          ++alarmWithCount[actualIndex][1];
          alarmWithCount  [actualIndex][5] = fullAlarmText;
          if (elementType === 'ATCA MGW') alarmWithCount[actualIndex][2] = onePriority;
          }
          else {
            // if alarm name not stored
            alarmSummary  .push(oneAlarm);
            alarmWithCount.push( [ oneAlarm, 1, onePriority, fileName, fullAlarmText, '' ] );
          }
      })

    return alarmWithCount.sort( (a, b) => (a[1] < b[1] ? 1 : -1)  );
    }



    const setSearchCond = (cond) =>{
      // change search conditions
      searchCond[cond.target.value] = cond.target.checked;
      // re-start search based on new search condition - only if search string is present
      if (searchCond.searchText != '')
          searchAlarmsLocaly(searchCond.searchText);
      //console.log(searchCond);
    }



    const matchList = document.querySelector('#alarm-list-filtered');
    
    const searchAlarmsLocaly = searchText => {
        searchCond.searchText = searchText;
        UI.clearAlarmSummary();
        let matches = alarmSummaryForAllFiles.filter( alarm => {
            const regex = new RegExp(`${searchText}`, 'gi');
            // const regex = new RegExp(`^${searchText}`, 'gi');
            const [ name, , , source, first, latest ] = alarm;
            console.log(searchCond);
            return (
              (searchCond.search_name    ? name.match(regex)   : false) ||
              (searchCond.search_source  ? source.match(regex) : false) ||
              (searchCond.search_first   ? first.match(regex)  : false) ||
              (searchCond.search_latest  ? latest.match(regex) : false)
            );
        });
        // clear search table if no searchText entered or searchText does not match 
        if( searchText.length === 0 || matches.length === 0 ) {
            matches = [];
            matchList.innerHTML = '';
        }

        UI.outputHtmlSearch(matches);
        // work around - how to wait if table is rendered
        UI.updEventListener();
    }

    
    const searchAlarmsFromDb = textInDB => {
        loadAlarmsfromMySql('search', textInDB);
        searchAlarmsLocaly(textInDB);
    }


    const sortAlarmSummary = (sortField) => {
        sortOrder *= -1;
        const matches = alarmSummaryForAllFiles.sort( (a, b) => (a[sortField] < b[sortField] ? sortOrder : -sortOrder)  );
        
        UI.clearAlarmSummary();
        UI.outputHtmlSearch(matches);
        UI.updEventListener();
    }


    const loadAlarmsfromMySql = (selected, searchParams) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `ajax_receive_data_universal.php?request=${selected}&search=${searchParams}`, true);
        xhr.onload = function(){
            if (this.readyState == 4 && this.status == 200) {
                UI.showAlert(xhr);
                alarmSummaryForAllFiles = JSON.parse(this.responseText);
                UI.outputHtmlSearch(alarmSummaryForAllFiles);
                UI.updEventListener();
            }
            else console.log('AJAX ERROR!');
        }
        xhr.send();
    }

      
    const sendAlarmsToMySql = (dataForSend) => {
        UI.clearAlarmSummary();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'ajax_send_data.php', true);
        xhr.onprogress = function(){
            UI.showAlert(xhr);
          }
        xhr.setRequestHeader('Content-type', 'application/json');
    
        xhr.onload = function() {
            UI.showAlert(xhr);
            if (this.readyState == 4 && this.status == 200) {
                UI.showAlert(xhr);
            } else if(this.status = 404){
                document.querySelector('#json').innerHTML = 'Not Found';
            }
        }
        xhr.send( JSON.stringify(dataForSend) );
    }



document.querySelector('#startDemo')      .addEventListener('click', (e) => startAlarmSummary(e, 'demo'));
document.querySelector('#newupload')      .addEventListener('change',(e) => startAlarmSummary(e, 'newupload'));

document.querySelector('#input')           .addEventListener('change',(e) => startAlarmSummary(e, 'dragDropInput'));
document.querySelector('#drop')           .addEventListener('drop',(e) => startAlarmSummary(e, 'dragDrop'));

document.querySelector('#uploadToDB')     .addEventListener('click', () => sendAlarmsToMySql(alarmSummaryForAllFiles));
document.querySelector('#loadFromDB')     .addEventListener('click', () => loadAlarmsfromMySql('select_all'));

document.querySelector('#search')         .addEventListener('input', () => searchAlarmsLocaly(search.value));
document.querySelector('#searchInDB')     .addEventListener('input', () => searchAlarmsFromDb(searchInDB.value));

document.getElementById('search_name')    .addEventListener('click', (e) => setSearchCond(e));
document.getElementById('search_source')  .addEventListener('click', (e) => setSearchCond(e));
document.getElementById('search_first')   .addEventListener('click', (e) => setSearchCond(e));
document.getElementById('search_latest')  .addEventListener('click', (e) => setSearchCond(e));

//document.getElementById('drag-area')            .addEventListener('dragenter', () => startAlarmSummary('newupload'))

//document.querySelector('#startAlarmSummary')    .addEventListener('click', () => startAlarmSummary());
//document.querySelector('#showHideAlarmSummary') .addEventListener('click', () => UI.showHideAlarmSummary());
//document.querySelector('#ajaxFromDbUniversal')  .addEventListener('change',() => loadAlarmsfromMySql(ajaxFromDbUniversal.value));

// Event listener 'input' or 'keyUp keyDown'


// All UI related to DOM manipulation
class UI {

  static updEventListener() {
    const update = () => {
        alarmDetailTd = document.querySelectorAll(".td-mouse-over");
        alarmDetailTd.forEach( oneTd => oneTd.addEventListener('mouseenter',
            (event) => event.target.lastElementChild.setAttribute('class', 'my-pre-on')
        ));
        alarmDetailTd.forEach( oneTd => oneTd.addEventListener('mouseleave',
            (event) => event.target.lastElementChild.setAttribute('class', 'my-pre-off')
        ));
    }
    // work around - how to wait if table is rendered
    setTimeout( update , 1000 );
  }


  // create DOM div from scrath : <div class="alert alert-success">Message</div>
  static showAlert(xhr) {
      const readyStateText = [
        '0 request not initialized',
        '1 server connection established',
        '2 request received',
        '3 processing request',
        '4 request finished and response is ready'
      ];

      const div = document.createElement('div');
      div.className = `alert`;
      // append text
      const text = document.createTextNode(xhr.status + ' - ' + readyStateText[xhr.readyState])
      div.appendChild(text);
      // store div to parent 'container' before 'form'
      const container = document.querySelector('.container');
      const place = document.querySelector('.menu');
      // inside '<div container>' insert '<div textAlert>' before '<form>'
      container.insertBefore(div, place);
      // Vanish(remove) DOM with class name 'alert' after 3 second
      setTimeout( () => document.querySelector('.alert').remove(), 1000 );
  }
  

  static clearAlarmSummary() {
      document.querySelector('#alarm-list-table').style.display = "none";
  }


  static addQuerySelectorForSearch() {
      document.querySelector('#sortAlarmSummary-name') .addEventListener('click', () => sortAlarmSummary(0));
      document.querySelector('#sortAlarmSummary-count').addEventListener('click', () => sortAlarmSummary(1));
      document.querySelector('#sortAlarmSummary-prio') .addEventListener('click', () => sortAlarmSummary(2));  
      document.querySelector('#sortAlarmSummary-file') .addEventListener('click', () => sortAlarmSummary(3));  
  }


  static showEmptyAlarmSummary() {
    const html = `
      ${UI.theadHtml()}
      <tbody id="alarm-list"></tbody>
    `;
    document.querySelector('#alarm-list-table').innerHTML=html;
    UI.addQuerySelectorForSearch();
  };


static showHideAlarmSummary() {
  // Prevent actual submit
  event.preventDefault();
  const list = document.querySelector('#alarm-list-table');
  if (list.style.display === "none") {
    list.style.display = "table";
  } else {
    list.style.display = "none";
  }
};


static addHtmlHeaderForSummary(fileName, fileSize, fileDate) {
  const list = document.querySelector('#alarm-list');
  const row = document.createElement('tr');
  row.setAttribute('class', 'td-header');
  row.innerHTML = `
      <td><b>${fileName}</b></td>
      <td>${Math.round(fileSize/1000)} kB</td>
      <td>${fileDate}</td>
      <td></td>
  `;
  list.appendChild(row);
  }


// [UI create row to tbody] : <tbody id="alarm-list"></tbody>
static addHtmlAlarmToSummary(alarm) {
  // use getElenentById or querySelector
  const list = document.querySelector('#alarm-list');
  // insert <tr> element:
  const row = document.createElement('tr');
  row.setAttribute ( 'class', 'tr-mouse-over' );
  // add colums to tr: 'btn-sm'=small, 'btn-danger'=red color
  row.innerHTML = UI.tableDataResult(alarm);
  // apend row to the list:
  list.appendChild(row);
}


static theadHtml() {
  return `
  <thead>
      <tr>
          <th>
              <button class="btn" id="sortAlarmSummary-name">
                  Alarm Name
                  <i class="fas fa-arrow-up"></i>
                  <i class="fas fa-arrow-down"></i>
              </button>
          </th>
          <th>
              <button class="btn"  id="sortAlarmSummary-count">
                  Count
                  <i class="fas fa-arrow-up"></i>
                  <i class="fas fa-arrow-down"></i>
              </button>
          </th>
          <th>
              <button class="btn" id="sortAlarmSummary-prio">
                  Prio
                  <i class="fas fa-arrow-up"></i>
                  <i class="fas fa-arrow-down"></i>
              </button>
          </th>
          <th>
              <button class="btn"  id="sortAlarmSummary-file">
                  Source
                  <i class="fas fa-arrow-up"></i>
                  <i class="fas fa-arrow-down"></i>
              </button>
          </th>
      </tr>
  </thead>
  `;
};


// [UI create td with result]
static tableDataResult(alarm) {
  const [ name, count, prio, source, first, latest ] = alarm;
  let prioClass;
  switch(prio){
    case '*** ALARM':   prioClass = 'td-prio-one';       break;
    case '**  ALARM':   prioClass = 'td-prio-two';       break;
    case '*   ALARM':   prioClass = 'td-prio-three';     break;
    case '2 (critical': prioClass = 'td-prio-one';       break;
    case '3 (major)':   prioClass = 'td-prio-two';       break;
    case '4 (minor)':   prioClass = 'td-prio-three';     break;
    default :           prioClass = '';                  break;
  }

  let aaa, bbb;
  if (name !== "") aaa = name.substring(0, 50)
    else aaa = name;

  if (source) bbb = source.substring(0, 8)
    else bbb = source;

  let newAaa = aaa;
  let newBbb = bbb;
  let newFirst = first;
  let newLatest = latest;

  if (searchCond.searchText != '') {

      const regex = new RegExp(`${searchCond.searchText}`, 'gi');
      
      newFirst = first.replace( regex, (text) => {
          newAaa = `${aaa} <mark><u><b> >>> </b></u></mark>`;
          return  `<mark><u><b>${text}</b></u></mark>`;
      });

      newLatest = latest.replace( regex, (text) => {
          newAaa = `${aaa} <mark><u><b> >>> </b></u></mark>`;
          return `<mark><u><b>${text}</b></u></mark>`
      });

      
      newAaa = newAaa.replace( regex, (text) => `<mark><u><b>${text}</b></u></mark>` );

      newBbb = newBbb.replace( regex, (text) => `<mark><u><b>${text}</b></u></mark>` );


  }


  return `
    <td class="td-mouse-over">
      ${newAaa}
      <span class="my-pre-off">
      
        ${newFirst}

        ${newLatest}
      </span>
    </td>
    <td>${count}</td>
    <td class="${prioClass}">${prio}</td>
    <td>${newBbb}</td>
  `;
  
}


// show search matches html
static outputHtmlSearch(matches) {
  // if not empty
  if(matches.length > 0) {
      const htmlTr = matches.map( alarm => `
          <tr>
              ${UI.tableDataResult(alarm)}
          </tr>
      `).join('');
      
      matchList.innerHTML = `
          ${UI.theadHtml()}
          <tbody>
              ${htmlTr}
          </tbody>
      `;

      UI.addQuerySelectorForSearch();
  }
};


// static dynamicSelectButton() {

//   let activities = document.getElementById("dynamicSelectButton");

//   activities.addEventListener("click", () => {
//       var options = activities.querySelectorAll("option");
//       var count = options.length;
//       console.log(`click : ${count}`);
//       if(typeof(count) === "undefined" || count < 2)
//       {
//         loadAlarmsfromMySql('DISTINCT_alarm');  
//         addActivityItem();
//       }
//       else {
//         console.log(activities.value);
//         searchAlarmsFromDb(activities.value);
//       }
//   });
  
  
//   const addActivityItem = () => {
//       let dummyText;
//       alarmSummaryForAllFiles.forEach(dummyEntry => {
//         var option = document.createElement("option");
//         dummyText = dummyEntry[0].substring(0, 30);
//         option.value = dummyText;
//         option.innerHTML = dummyText;
//         activities.appendChild(option);
//       })
//   }

// }

}


//UI.dynamicSelectButton();