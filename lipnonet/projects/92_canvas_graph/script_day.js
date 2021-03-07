"use strict"

import Draw from './modules/Draw.js';

// data from DB
let pdoResp = [];
// data from DB should be downloaded only once
let isAllDownloaded = true;
// storage of date values in mySQL
const dateStorage = 'Date';

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

console.log(window.location.hostname);

// const SOURCE_FILE = 'https://www.frymburk.com/davis/downld02.txt'
// const SOURCE_FILE = '../../davis/downld02.txt';
// const SOURCE_FILE = 'downld02.txt';


const loadPocasiAsync = async () => {
    try { 
        //console.time('Start');

        // get meteodata array for one file
        const loadOneFile = async ( txtFile ) => {
            const response = await fetch( txtFile )
            // this response check not works if .httaccess show default html page instead text file
            if (response.status !== 200) return []
            const text = await response.text()
            // lines to array
            const arr = text.trim().split('\n')
            // remove first 3 lines
            arr.shift()
            arr.shift()
            arr.shift()
            // return empty arr if not valid text file - return (-1) = FALSE
            return !arr[0].search( /..\...\.......:../ ) ? arr : []
        }



        // create filePaths array with correct days order
        let meteoFiles = [];
        const dayOfWeekNow = new Date().getUTCDay();
        for ( let day = dayOfWeekNow + 1; day < dayOfWeekNow + 6; day++ ) {
            const correctedDay = day > 6 ? day - 7 :  day;
            const meteoFile = `../../davis/archive/downld02-${ correctedDay }.txt`;
            meteoFiles = [ ...meteoFiles, meteoFile ];
        }
        meteoFiles = [ ...meteoFiles, '../../davis/downld02.txt' ];



        // create meteo array for all 7 days
        let arr = [];
        const myPromises = meteoFiles.map( filePath => loadOneFile( filePath ) )
        await Promise.all( myPromises )
            .then( responses => responses.forEach(
                response => arr = [ ...arr, ...response ]
            ))
        // in react folder: /public/davis/downld02.txt

        // create array of meteo data array
        // one or more spaces for split
        //const arrOfArr = arr.map( line => line.split(/  +/g) )


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
// orig. solution with map instead reduce
/*                 const arrOfObj = arr.map( line => {
            
            const arrFromLine = line.trim().split(/ +/g);
            
            const [ myDate, Time, TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
                  ] = arrFromLine;
            
            const  objFromLine = {
                Date: myDate, Time, TempOut: +TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
            }

            // UTC used to disable time offset effect
            const [ day, month, year ] = myDate.split('.');
            const [ hour, minute ] = Time.split(':');
            const dateString = new Date(Date.UTC( `20${year}`, month - 1, day, hour, minute) ).toJSON();
            objFromLine.Date    = dateString;
            // Wind dir - degrees from string
            objFromLine.WindDir = 22.5 *dirObj[objFromLine.WindDir];
    
            return objFromLine
        }) */


        const arrOfObj = arr.reduce( ( accumulator, line, index ) => {
            
            const arrFromLine = line.trim().split(/ +/g);
            
            const [ myDate, Time, TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
                  ] = arrFromLine;
            
            const  objFromLine = {
                Date: myDate, Time, TempOut: +TempOut, TempHi, TempLow, HumOut, DewPt, WindSpeed, WindDir, WindRun, HiSpeed, HiDir, WindChill, HeatIndex, THWIndex, Bar, Rain, RainRate, HeatDD, CoolDD, TempIn, HumIn, DewIn, HeatIn, EMCIn, AirDensityIn, WindSamp, WindTx, ISSRecept, ArcInt
            }

            // UTC used to disable time offset effect
            const [ day, month, year ] = myDate.split('.');
            const [ hour, minute ] = Time.split(':');
            const dateString = new Date(Date.UTC( `20${year}`, month - 1, day, hour, minute) ).toJSON();
            objFromLine.Date    = dateString;
            // Wind dir - degrees from string
            objFromLine.WindDir = 22.5 *dirObj[objFromLine.WindDir];
    
            // tricky index is from 1
            // skip duplicated entries when merging more text files
            const result = index > 0 && objFromLine.Date < accumulator[ accumulator.length - 1 ].Date
                         ? accumulator
                         : [ ...accumulator, objFromLine ];

            return result
        }, [])


        pdoResp = arrOfObj

    }
    catch (err) {
        console.log(err)
        return null;
    }

    const temp     = new Draw(
        [ canvas, canvas_pointer, dateStorage, pdoResp, isAllDownloaded, null]
        , [ 'THWIndex' , 'lime'  , 'line', 1, 'THWIndex [\xB0C]', 1, [] ]
        , [ 'TempOut'  , 'white' , 'line', 1, 'TempOut [\xB0C]' , 1, [] ]
        , [ 'DewPt'  , 'blue' , 'line', 1, 'DewPt [\xB0C]' , 1, [] ]
    ); 

    const huminidy     = new Draw(
        [ canvas1, canvas1_pointer, dateStorage, pdoResp, isAllDownloaded, null]
        , [ 'HumOut', 'white', 'line', 1, 'HumOut [%]', 1, [] ]
        , [ 'Bar'   , 'lime' , 'line', 1, 'Bar [hPa]' , 2, [] ]
    ); 
    
    const rain     = new Draw(
        [ canvas2, canvas2_pointer, dateStorage, pdoResp, isAllDownloaded, null]
        , [ 'Rain'    , 'green', 'line', 1, 'Rain [mm]'       , 1, [] ]
        , [ 'RainRate', 'white', 'line', 1, 'RainRate [mm/h]' , 2, [] ]
    ); 

    const wind     = new Draw(
        [ canvas3, canvas3_pointer, dateStorage, pdoResp, isAllDownloaded, null]
        , [ 'HiSpeed'  , 'lime', 'area', 1, 'HiSpeed [m/s]'  , 1, [] ]
        , [ 'WindDir'  , 'orange' , 'dot' , 1, 'WindDir [\xB0]' , 2, [] ]
        , [ 'WindSpeed', 'blue', 'area', 1, 'WindSpeed [m/s]', 1, [] ]
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

    // hide isLoading when graph loaded
    const isLoading = document.getElementById( 'isLoading' );
    isLoading.style.visibility = 'hidden';
    
}

loadPocasiAsync();