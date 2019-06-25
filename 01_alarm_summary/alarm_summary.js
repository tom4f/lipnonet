//"use strict";

let alarmSummaryForAllFiles;

//imgs.forEach(img => img.addEventListener('click', imgClick));

function startAlarmSummary() {
  // Prevent actual submit
  event.preventDefault();
  alarmSummaryForAllFiles = [];
  UI.showEmptyAlarmSummary();
  let fileName = document.getElementById("selectedAlarmFile");
  for (let i=0; i < fileName.files.length; i++) {
    getTextFromOneFile(fileName.files[i].name);
  }
}

function getTextFromOneFile(fileName){
  fetch(`test/${fileName}`)
  .then( (res)  => res.text())
  .then( (alarmText) => {
    UI.addHtmlHeaderForSummary(fileName);
    let AlarmSummaryForOneFile = createAlarmSummaryForOneFile (alarmText, fileName);
    alarmSummaryForAllFiles = alarmSummaryForAllFiles.concat(AlarmSummaryForOneFile);
    AlarmSummaryForOneFile
      .forEach( dummyArrayEntry => { 
        UI.addHtmlAlarmToSummary(dummyArrayEntry);
    });
  })
  // to handle errors :
  .catch( (error) => console.log(error) )
}

// alarm summary for one fileName
  function createAlarmSummaryForOneFile (alarmText, fileName)
  {
    // whole file divided separate Alarms = array
    const alarmParseRule = [
        [/     ....-..-.. ..:..:..[.]../g,/     ....-..-.. ..:..:..[.]../g,  4, 71, 2, 1, 0, 11, 'IPA MGW'],
        [/....-..-..  ..:..:..[.]../g,/ ..:..:..[.]../g,11, 78, 2, 1, 0, 11, 'DX200 MSS'],
        [/Specific problem         : /g,/Specific problem         : /g,     0, 67, 0, 3, 0, 11, 'ATCA MGW'],
        [/NO ALARMS WITH GIVEN PARAMETERS/g, '', 0, 67, 0, 3, 0, 11, 'n/a' ],
        [/No events matched the given criteria/g, /00]/g,      0, 37, 1, 1, 0, 11, 'empty ATCA MGW']
    ];

    // let alarmText = fs.readFileSync(path.join(__dirname, '/test', fileName), 'utf8');
    let AlarmBlock, alarmStart, alarmStop, alarmPosition, prioPosition, prioStart, prioStop, elementType;
    alarmParseRule.forEach(dummyAlarmParseRule => {
      if (alarmText.search(dummyAlarmParseRule[0]) > 0) {
        AlarmBlock =      alarmText.split(dummyAlarmParseRule[1]);      
        alarmStart =      dummyAlarmParseRule[2];
        alarmStop =       dummyAlarmParseRule[3];
        alarmPosition =   dummyAlarmParseRule[4];
        prioPosition =    dummyAlarmParseRule[5];
        prioStart =       dummyAlarmParseRule[6];
        prioStop =        dummyAlarmParseRule[7];
        elementType =     dummyAlarmParseRule[8];  
      }
    });

    // remove first element - this is not alarm
    AlarmBlock.shift();

    let alarmWithCount = [];
    let alarmSummary = [];
    let oneAlarm, onePriority, actualIndex;

    // all alarms to array
    AlarmBlock.forEach(dummyAlarm => {

      // from one alarm block separate single alarm text
        oneAlarm = dummyAlarm.
          split('\r\n')[alarmPosition].
          substring(alarmStart, alarmStop).
          trim();

        if (elementType === 'ATCA MGW') {
            onePriority = dummyAlarm.
            split('Severity                 : ')[1].
            substring(prioStart, prioStop).
            trim();
        } else {
            onePriority = dummyAlarm.
            split('\r\n')[prioPosition].
            substring(prioStart, prioStop).
            trim();
        }


      
        const isAlarmStored = (dummyAlarm, dummyIndex) => {
          actualIndex = dummyIndex;
          return dummyAlarm == oneAlarm;
        }

        if(alarmSummary.some(isAlarmStored)) {
          ++alarmWithCount[actualIndex][1];
          if (elementType === 'ATCA MGW') alarmWithCount[actualIndex][2] = onePriority;
        }
          else {
            alarmSummary.push(oneAlarm);
            alarmWithCount.push([oneAlarm,1,onePriority,fileName]);
        }
      })
    return alarmWithCount.sort( (a, b) => (a[1] < b[1] ? 1 : -1)  );
    }




    const matchList = document.querySelector('#alarm-list-filtered');
    
    const searchAlarms = searchText => {
        UI.clearAlarmSummary();
            let matches = alarmSummaryForAllFiles.filter( alarm => {
            const regex = new RegExp(`${searchText}`, 'gi');
            // const regex = new RegExp(`^${searchText}`, 'gi');
            return alarm[0].match(regex) || alarm[3].match(regex);
        });
        // clear search table if no searchText entered or searchText does not match 
        if( searchText.length === 0 || matches.length === 0 ) {
            matches = [];
            matchList.innerHTML = '';
            startAlarmSummary();
        }
        //clearAlarmSummary();
        UI.outputHtmlSearch(matches);
    }
    
    const sortAlarmSummary = (sortW, sortO) => {
        UI.clearAlarmSummary();
        let matches;
        let sortWhat = sortW;
        let sortOrder = sortO;
    
        console.log(`${sortW} - ${sortO}`);

        switch(sortWhat){
          case 'name':    sortWhat = 0;       break;
          case 'count':   sortWhat = 1;       break;
          case 'prio':    sortWhat = 2;       break;
          case 'file':    sortWhat = 3;       break;
          default :       sortWhat = 0;       break;
        }
    
        if (sortOrder === 'desc') 
            matches = alarmSummaryForAllFiles.sort( (a, b) => (a[sortWhat] < b[sortWhat] ? 1 : -1)  );
            else
            matches = alarmSummaryForAllFiles.sort( (a, b) => (a[sortWhat] > b[sortWhat] ? 1 : -1)  );
        UI.outputHtmlSearch(matches);
    }

document.querySelector('#startAlarmSummary').addEventListener('click', event => startAlarmSummary());
document.querySelector('#showHideAlarmSummary').addEventListener('click', event => UI.showHideAlarmSummary());
document.querySelector('#StringifyArray').addEventListener('click', () => UI.stringifyArray());

// Event listener 'input' or 'keyUp keyDown'
document.querySelector('#search').addEventListener('input', () => searchAlarms(search.value));






// All UI related to DOM manipulation
class UI {
  
  static stringifyArray(){
    //UI.clearAlarmSummary();
    var myJSON = JSON.stringify(alarmSummaryForAllFiles); 
    var xhr = new XMLHttpRequest();
    
    const addLi = () => {
      const readyStateText = [
        '0 request not initialized',
        '1 server connection established',
        '2 request received',
        '3 processing request',
        '4 request finished and response is ready'
      ];

      const node = document.createElement('li');
      const nodeText = document.createTextNode(xhr.status + ' - ' + readyStateText[xhr.readyState])
      node.appendChild(nodeText);
      document.querySelector('#json').appendChild(node);
    }

    addLi();
    
    xhr.open('POST', 'ajax.php', true);
    addLi();
    // OPTIONAL - used for loaders, if waiting for something
    xhr.onprogress = function(){
        addLi();
        }
    xhr.setRequestHeader('Content-type', 'application/json');
    addLi();

    xhr.onload = function(){
      addLi();
      if(this.status == 200){  // OK
        //console.log(this.responseText);
        addLi();
      } else if(this.status = 404){
        document.querySelector('#json').innerHTML = 'Not Found';
      }
    }
    xhr.send(myJSON);
    addLi();

    // Vanish(remove) DOM with class name 'alert' after 3 second
    setTimeout( 
      () => document.querySelector('#json').innerHTML = '',
      3000            
      )

        // readyState Values
    // 0: request not initialized 
    // 1: server connection established
    // 2: request received 
    // 3: processing request 
    // 4: request finished and response is ready

    // HTTP Statuses
    // 200: "OK"
    // 403: "Forbidden"
    // 404: "Not Found"
  }

  static clearAlarmSummary() {
    const list = document.querySelector('#alarm-list-table');
    list.style.display = "none";
  };

  static addQuerySelectorForSearch(){
    document.querySelector('#sortAlarmSummary-name-desc') .addEventListener('click', event => sortAlarmSummary('name', 'desc'));
   // document.querySelector('#sortAlarmSummary-name-asc')  .addEventListener('click', event => sortAlarmSummary('name', 'asc'));
    document.querySelector('#sortAlarmSummary-count-desc').addEventListener('click', event => sortAlarmSummary('count', 'desc'));
   // document.querySelector('#sortAlarmSummary-count-asc') .addEventListener('click', event => sortAlarmSummary('count', 'asc'));
   document.querySelector('#sortAlarmSummary-prio-desc').addEventListener('click', event => sortAlarmSummary('prio', 'desc'));  
   document.querySelector('#sortAlarmSummary-file-desc').addEventListener('click', event => sortAlarmSummary('file', 'desc'));  
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


static addHtmlHeaderForSummary(fileName) {
  const list = document.querySelector('#alarm-list');
  const row = document.createElement('tr');
  row.setAttribute('class', 'td-header');
  row.innerHTML = `
      <td><b>${fileName}</b></td>
      <td></td>
      <td></td>
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
        <button class="btn" id="sortAlarmSummary-name-desc">
          Alarm Name
          <i class="fas fa-arrow-up"></i>
          <i class="fas fa-arrow-down"></i>
        </button>
      </th>
      <th>
        <button class="btn"  id="sortAlarmSummary-count-desc">
          Count
          <i class="fas fa-arrow-up"></i>
          <i class="fas fa-arrow-down"></i>
        </button>
      </th>
      <th>
        <button class="btn" id="sortAlarmSummary-prio-desc">
          Prio
          <i class="fas fa-arrow-up"></i>
          <i class="fas fa-arrow-down"></i>
        </button>
      </th>
      <th>
        <button class="btn"  id="sortAlarmSummary-file-desc">
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
  let prioClass;
  switch(alarm[2]){
    case '*** ALARM':   prioClass = 'td-prio-one';       break;
    case '**  ALARM':   prioClass = 'td-prio-two';       break;
    case '*   ALARM':   prioClass = 'td-prio-three';     break;
    case '2 (critical': prioClass = 'td-prio-one';       break;
    case '3 (major)':   prioClass = 'td-prio-two';       break;
    case '4 (minor)':   prioClass = 'td-prio-three';     break;
    default :           prioClass = '';                  break;
  }
  return `
    <td>${alarm[0].substring(0, 50)}</td>
    <td>${alarm[1]}</td>
    <td class="${prioClass}">${alarm[2]}</td>
    <td>${alarm[3].substring(0, 8)}</td>
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
       
       const html = `
           ${UI.theadHtml()}
           <tbody>
           ${htmlTr}
           </tbody>
       `;
   matchList.innerHTML = html;
   UI.addQuerySelectorForSearch();
  }
};

}