"use strict"

import Draw from './modules/Draw.js';

// data from DB
let pdoResp = [];
// data from DB should be downloaded only once
let isAllDownloaded = false;
// storage of date values in mySQL
const dateStorage = 'datum'

// set height for one graph
const graphHeight = 2;
const graph = document.querySelectorAll('.one-graph');
graph.forEach( value => value.style.height = 100 / graphHeight + 'vh' );

// definition of all graphs
const canvas  = document.getElementById('canvas' );
const canvas1 = document.getElementById('canvas1');
// definition of all graph pointers
const canvas_pointer  = document.getElementById('canvas_pointer');
const canvas1_pointer = document.getElementById('canvas1_pointer');

const canvasSize = ( can, can_pointer, size ) => {
    const clientWidth  = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    can.width  = clientWidth;
    can.height = clientHeight / size;
    can_pointer.width  = clientWidth;
    can_pointer.height = clientHeight / size;
}

const allCanvasSize = () => {
    canvasSize(canvas , canvas_pointer , graphHeight);
    canvasSize(canvas1, canvas1_pointer, graphHeight);
}

allCanvasSize();


// convert new Date() object to string, e.g. 2019-05-18
const getTextDateFromNewDate = (updDate) =>{
    return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
}

// AJAX request set as Promise
const loadPocasi = (
    start = getTextDateFromNewDate( new Date( new Date().setFullYear ( new Date().getFullYear() - 1 )  ) ),
    end =   getTextDateFromNewDate( new Date() )
    ) => {
    return new Promise( (resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `../../rekreace/api/pdo_read_pocasi_by_date.php`, true);
        //xhr.open('POST', `https://www.frymburk.com/rekreace/api/pdo_read_pocasi_by_date.php`, true);
        //xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_pocasi_by_date.php`, true);
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

    const hladina     = new Draw(
        [ canvas, canvas_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
        , [ 'pritok' , 'lime' , 'line', 2, 'pritok [m\xB3/s]', 1, [] ]
        , [ 'hladina', 'red', 'line', 2, 'hladina [m n.m.]', 2, [] ]
        , [ 'odtok'  , 'white' , 'line', 2, 'odtok [m\xB3/s]' , 1, [] ]
    ); 

    const teplota     = new Draw(
        [ canvas1, canvas1_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
        , [ 'voda'  , 'white', 'line', 2, 'voda [\xB0C]'  , 1, [] ]
        , [ 'vzduch', 'lime' , 'line', 2, 'vzduch ráno [\xB0C]', 1, []  ]
    ); 

    
    // show graphs
    hladina.graph();
    teplota.graph();

    window.addEventListener('resize', () => {
        // set canvas size
        allCanvasSize();
        // reload graphs
        hladina.resizeCanvas();
        teplota.resizeCanvas();
    });
}

// Start App

// load data + show graphs
loadPocasiAsync();