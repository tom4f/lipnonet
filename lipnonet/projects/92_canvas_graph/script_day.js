"use strict"

// data from DB
let pdoResp = [];
// data from DB should be downloaded only once
let isAllDownloaded = false;
// storage of date values in mySQL
const dateStorage = 'Date'

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

console.log(window.location.hostname);

//const SOURCE_FILE = 'https://www.frymburk.com/davis/downld02.txt'
const SOURCE_FILE = '../../davis/downld02.txt';
//const SOURCE_FILE = 'downld02.txt';
const ONE_MINUTE = 1000 * 60
const ONE_DAY = ONE_MINUTE * 60 * 24 

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
}

allCanvasSize();


const loadPocasiAsync = async () => {
    try { 
        console.time('Start');
        const response = await fetch(SOURCE_FILE)
        console.timeEnd('Start');
        if (response.status != 200) return null
        
        const text = await response.text()

        // lines to array
        const arr = text.trim().split('\n')
        // remove first 3 lines
        arr.shift()
        arr.shift()
        arr.shift()

        // create array of meteo data array
        // one or more spaces for split
        //const arrOfArr = arr.map( line => line.split(/  +/g) )

        const arrOfObj = arr.map( line => {
            
            const arrFromLine = line.split(/ +/g);
            
            const [ myDate, Time, TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
                  ] = arrFromLine;
            
            const  objFromLine = {
                Date: myDate, Time, TempOut: +TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
            }

            const [ day, month, year ] = myDate.split('.');
            const [ hour, minute ] = Time.split(':');

            // UTC used to disable time offset effect
            const dateString = new Date(Date.UTC( `20${year}`, month - 1, day, hour, minute) ).toJSON();

            objFromLine.Date = dateString;

           const dirObj = {
                '---' : 16,
                'NNW' : 15,
                'NW' : 14,
                'WNW' : 13,
                'W' : 12,
                'WSW' : 11,
                'SW' : 10,
                'SSW' : 9,
                'S' : 8,
                'SSE' : 7,
                'SE' : 6,
                'ESE' : 5,
                'E' : 4,
                'ENE' : 3,
                'NE' : 2,
                'NNE' : 1,
                'N' : 0
           }

           objFromLine.WindDir = 22.5 *dirObj[objFromLine.WindDir];

            return objFromLine
        })



        pdoResp = arrOfObj

    }
    catch (err) {
        console.log(err)
        return null;
    }

    const temp     = new Draw(
        [ canvas, canvas_pointer, dateStorage]
        , [ 'THWIndex' , 'lime'  , 'line', 1, 'THWIndex [\xB0C]', 1, [] ]
        , [ 'TempOut'  , 'white' , 'line', 1, 'TempOut [\xB0C]' , 1, [] ]
    ); 

    const huminidy     = new Draw(
        [ canvas1, canvas1_pointer, dateStorage]
        , [ 'HumOut', 'white', 'line', 1, 'HumOut [%]', 1, [] ]
        , [ 'Bar'   , 'lime' , 'line', 1, 'Bar [hPa]' , 2, [] ]
    ); 
    
    const rain     = new Draw(
        [ canvas2, canvas2_pointer, dateStorage]
        , [ 'Rain'    , 'green', 'line', 1, 'Rain [mm]'       , 1, [] ]
        , [ 'RainRate', 'white', 'line', 1, 'RainRate [mm/h]' , 2, [] ]
    ); 

    const wind     = new Draw(
        [ canvas3, canvas3_pointer, dateStorage]
        , [ 'HiSpeed'  , 'lime' , 'area', 1, 'HiSpeed [m/s]'  , 1, [] ]
        , [ 'WindDir'  , 'white', 'dot' , 6, 'WindDir [\xB0]' , 2, [] ]
        , [ 'WindSpeed', 'blue' , 'area', 1, 'WindSpeed [m/s]', 1, [] ]
        ); 
    // show graphs
    //THWIndex.graph();
    temp.graph();
    huminidy.graph();
    rain.graph();
    wind.graph();


    window.addEventListener('resize', () => {
        // set canvas size
        allCanvasSize();
        // reload graphs
        //THWIndex.resizeCanvas();
        temp.resizeCanvas();
        huminidy.resizeCanvas();
        rain.resizeCanvas();
        wind.resizeCanvas();
    });

}

loadPocasiAsync();


