"use strict"

import Draw from './modules/Draw.js';

// data from DB
let pdoResp = [];
// data from DB should be downloaded only once
let isAllDownloaded = false;
// storage of date values in mySQL
const dateStorage = 'date'

// set height for one graph
const graphHeight = 2;
const graph = document.querySelectorAll('.one-graph');
graph.forEach( value => value.style.height = 100 / graphHeight + 'vh' );

// definition of all graphs
const canvas  = document.getElementById('canvas' );
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
// definition of all graph pointers
const canvas_pointer  = document.getElementById('canvas_pointer');
const canvas1_pointer = document.getElementById('canvas1_pointer');
const canvas2_pointer = document.getElementById('canvas2_pointer');
const canvas3_pointer = document.getElementById('canvas3_pointer');

// set canvas size

const allCanvasSize = () => {
    const canvasSize = ( can, can_pointer, size ) => {
        const clientWidth  = document.documentElement.clientWidth;
        const clientHeight = document.documentElement.clientHeight;
        can.width  = clientWidth;
        can.height = clientHeight / size;
        can_pointer.width  = clientWidth;
        can_pointer.height = clientHeight / size;
    }

    canvasSize(canvas , canvas_pointer , graphHeight);
    canvasSize(canvas1, canvas1_pointer, graphHeight);
    canvasSize(canvas2, canvas2_pointer, graphHeight);
    canvasSize(canvas3, canvas3_pointer, graphHeight);
}

allCanvasSize();

// convert new Date() object to string, e.g. 2019-05-18
const getTextDateFromNewDate = (updDate) =>{
    return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
}

// AJAX request set as Promise
const loadPocasi = (
        // start = getTextDateFromNewDate( new Date( new Date().setFullYear ( new Date().getFullYear() - 1 )  ) ),
        start = getTextDateFromNewDate( new Date( '2011-08-22' ) ),
        // end =   getTextDateFromNewDate( new Date() )
        end =   getTextDateFromNewDate( new Date( '2012-08-22' ) )
    ) => {
    return new Promise( (resolve, reject) => {

        const xhr = new XMLHttpRequest();
        //xhr.open('POST', `https://www.frymburk.com/rekreace/api/pdo_read_pocasi_by_date.php`, true);
        xhr.open('POST', `../../rekreace/api/pdo_read_old_station_by_date.php`, true);
        //xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_davis_by_date.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } 
        }
        xhr.onerror = () => reject('error');
        xhr.send(JSON.stringify(
            { 
                'start'   : start,
                'end'     : end,
                'orderBy' : dateStorage,
                'sort'    : 'ASC'
            }
        ));
    })
}

// start AJAX async
const loadPocasiAsync = async () => {
    try { 
        console.time('Start');
        pdoResp = await loadPocasi();
        console.timeEnd('Start');
     }
        catch (err) {
            console.log(err)
            return null;
        }

    if (pdoResp.length === 0) return null;
    console.log( `%c Data loaded on start!`, 'color: orange; font-weight: bold;' );
    // Instantiate Object
       //
    const wind     = new Draw(
        [ canvas, canvas_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
        , [ 'wind3' , 'grey' , 'area', 1, 'wind>3m/s [min]', 1, [] ]
        , [ 'wind6', 'orange', 'area', 1, 'wind>6m/s [min]', 1, [] ]
        , [ 'wind9'  , 'lime' , 'area', 1, 'wind>9m/s [min] ' , 1, [] ]
        , [ 'wind12'  , 'yellow' , 'area', 1, 'wind>12m/s [min] ' , 1, [] ]
    ); 

    const teplota     = new Draw(
        [ canvas1, canvas1_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
        , [ 'windmax' , 'lime' , 'line', 2, 'windMax [m/s]', 2, [] ]
        , [ 'direct', 'white' , 'dot', 2, 'dir []', 1, []  ]
    ); 

    const temp     = new Draw(
        [ canvas2, canvas2_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
        , [ 'tempmin' , 'blue' , 'line', 1, 'tempMin [\xB0C]', 1, [] ]
        , [ 'tempavg', 'white', 'line', 1, 'tempAvg [\xB0C]', 1, [] ]
        , [ 'tempmax'  , 'red' , 'line', 1, 'tempMax [\xB0C] ' , 1, [] ]
    ); 

    const rain     = new Draw(
        [ canvas3, canvas3_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
        , [ 'rain' , 'lime' , 'area', 1, 'rain [mm]', 1, [] ]
    );  
   
    // show graphs
    wind.resizeCanvas();
    teplota.resizeCanvas();
    temp.resizeCanvas();
    rain.resizeCanvas();

    window.addEventListener('resize', () => {
        // set canvas size
        allCanvasSize();
        // reload graphs
        wind.resizeCanvas();
        teplota.resizeCanvas();
        temp.resizeCanvas();
        rain.resizeCanvas();
    
    });
}

// Start App

// load data + show graphs
loadPocasiAsync();





