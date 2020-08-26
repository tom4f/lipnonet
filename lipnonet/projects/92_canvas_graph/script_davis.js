"use strict"

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
const canvas4 = document.getElementById('canvas4');
// definition of all graph pointers
const canvas_pointer  = document.getElementById('canvas_pointer');
const canvas1_pointer = document.getElementById('canvas1_pointer');
const canvas2_pointer = document.getElementById('canvas2_pointer');
const canvas3_pointer = document.getElementById('canvas3_pointer');
const canvas4_pointer = document.getElementById('canvas4_pointer');

// set canvas size

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
    canvasSize(canvas2, canvas2_pointer, graphHeight);
    canvasSize(canvas3, canvas3_pointer, graphHeight);
    canvasSize(canvas4, canvas4_pointer, graphHeight);
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
        //xhr.open('POST', `https://www.frymburk.com/rekreace/api/pdo_read_pocasi_by_date.php`, true);
        xhr.open('POST', `../../rekreace/api/pdo_read_davis_by_date.php`, true);
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
    const temp     = new Draw(
        [ canvas, canvas_pointer, dateStorage ]
        , [ 'temp_low' , 'red'  , 'line', 1, 'temp_low [\xB0C]' , 1, [1, 1]  ]
        , [ 'temp_high', 'blue' , 'line', 1, 'temp_high [\xB0C]', 1, [1, 1] ]
        , [ 'temp_mean', 'white', 'line', 2, 'temp_mean [\xB0C]', 1, []  ]
    ); 

    const wind     = new Draw(
        [ canvas1, canvas1_pointer, dateStorage]
        , [ 'wind_speed_high', 'orange', 'area', 5, 'wind_speed_high [m/s]', 1, [] ]
        , [ 'wind_speed_avg' , 'green' , 'area', 5, 'wind_speed_avg [m/s]' , 2, [] ]
    ); 

    const bar     = new Draw(
        [ canvas2, canvas2_pointer, dateStorage]
        , [ 'bar_min', 'green' , 'line', 1, 'bar_min [hPa]', 1, [1, 1] ]
        , [ 'bar_max', 'blue'  , 'line', 1, 'bar_max [hPa]', 1, [1, 1] ]
        , [ 'bar_avg', 'white' , 'line', 2, 'bar_avg [hPa]' , 1, [] ]
    ); 

    const huminidy     = new Draw(
        [ canvas3, canvas3_pointer, dateStorage]
        , [ 'huminidy_min', 'green' , 'line', 1, 'huminidy_min [%]', 1, [1, 1] ]
        , [ 'huminidy_max', 'blue'  , 'line', 1, 'huminidy_max [%]', 1, [1, 1] ]
        , [ 'huminidy_avg', 'white' , 'line', 2, 'huminidy_avg [%]' , 1, [] ]
    ); 

    const rain     = new Draw(
        [ canvas4, canvas4_pointer, dateStorage]
        , [ 'rain_rate_max', 'orange', 'line', 1, 'rain_rate_max [mm/h]', 1, [] ]
        , [ 'rain'         , 'white' , 'line', 2, 'rain [mm/h]' , 2, [] ]
    ); 
   
    // show graphs
    temp.graph();
    wind.graph();
    bar.graph();
    huminidy.graph();
    rain.graph();

    window.addEventListener('resize', () => {
        // set canvas size
        allCanvasSize();
        // reload graphs
        temp.resizeCanvas();
        wind.resizeCanvas();
        bar.resizeCanvas();
        huminidy.resizeCanvas();
        rain.resizeCanvas();
    
    });
}

// Start App

// load data + show graphs
loadPocasiAsync();





