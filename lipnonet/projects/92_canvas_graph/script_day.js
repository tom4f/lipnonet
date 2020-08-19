// data from DB
let pdoResp = [];
// data from DB should be downloaded only once
let isAllDownloaded = false;
// storage of date values in mySQL
const dateStorage = 'Date'

// set height for one graph
const graphHeight = 3;
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


// convert new Date() object to string, e.g. 2019-05-18
const getTextDateFromNewDate = (updDate) =>{
    return `${updDate.getFullYear()}-${ ('0' + (updDate.getMonth() + 1)).slice(-2) }-${ ('0' + updDate.getDate()).slice(-2) }`;
}

const SOURCE_FILE = 'https://www.frymburk.com/davis/downld02.txt'
//const SOURCE_FILE = 'downld02.txt'
const ONE_MINUTE = 1000 * 60
const ONE_DAY = ONE_MINUTE * 60 * 24 

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

            return objFromLine
        })

        pdoResp = arrOfObj

        TempOut     = new Draw('TempOut', 'white', canvas , 'left' , canvas_pointer , 'THWIndex'   , 'TempOut [\xB0C]', dateStorage, true, 'line' );
        THWIndex    = new Draw('THWIndex', 'green', canvas , 'right' , canvas_pointer , 'TempOut'   , 'THWIndex [\xB0C]', dateStorage, true, 'line' );
        
        WindSpeed   = new Draw('WindSpeed', 'green', canvas1 , 'left' , canvas1_pointer , 'HiSpeed'   , 'WindSpeed [m/s]', dateStorage, true, 'area' );
        HiSpeed     = new Draw('HiSpeed', 'yellow', canvas1 , 'right' , canvas1_pointer , 'WindSpeed'   , 'HiSpeed [m/s]', dateStorage, true, 'area' );

        Bar         = new Draw('Bar', 'white', canvas2 , 'left' , canvas2_pointer , 'HumOut'   , 'Bar [hPa]', dateStorage, false, 'line' );
        HumOut      = new Draw('HumOut', 'orange', canvas2 , 'right' , canvas2_pointer , 'Bar'   , 'HumOut [%]', dateStorage, false, 'line' );

        Rain        = new Draw('Rain', 'white', canvas3 , 'left' , canvas3_pointer , 'RainRate'   , 'Rain [mm]', dateStorage, false, 'area' );
        RainRate    = new Draw('RainRate', 'green', canvas3 , 'right' , canvas3_pointer , 'Rain'   , 'RainRate [mm/h]', dateStorage, false, 'area', 2 );
 

        // show graphs
        THWIndex.graph();
        TempOut.graph();
        
        HiSpeed.graph();
        WindSpeed.graph();

        Bar.graph();
        HumOut.graph();

        Rain.graph();
        RainRate.graph();

    }
    catch (err) {
        console.log(err)
        return null;
    }
}

loadPocasiAsync();

// set canvas size
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
canvasSize(canvas4, canvas4_pointer, graphHeight);

window.addEventListener('resize', () => {
    // set canvas size
    canvasSize(canvas , canvas_pointer , graphHeight);
    canvasSize(canvas1, canvas1_pointer, graphHeight);
    canvasSize(canvas2, canvas2_pointer, graphHeight);
    canvasSize(canvas3, canvas3_pointer, graphHeight);
    canvasSize(canvas4, canvas4_pointer, graphHeight);
    // reload graphs
    THWIndex.resizeCanvas();
    TempOut.resizeCanvas();

    HiSpeed.resizeCanvas();
    WindSpeed.resizeCanvas();

    Rain.resizeCanvas();
    RainRate.resizeCanvas();

    Bar.resizeCanvas();
    HumOut.resizeCanvas();
});

