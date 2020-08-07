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
        //xhr.open('POST', `../../rekreace/api/pdo_read_pocasi_by_date.php`, true);
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
    temp_low        = new Draw('temp_low'       , 'white', canvas , 'left' , canvas_pointer , 'temp_high'      , 'temp_low  [\xB0C]', dateStorage );
    temp_high       = new Draw('temp_high'      , 'green', canvas , 'right', canvas_pointer , 'temp_low'       , 'temp_high [\xB0C]', dateStorage);
    //
    wind_speed_avg  = new Draw('wind_speed_avg' , 'white', canvas1, 'left' , canvas1_pointer, 'wind_speed_high', 'wind_speed_avg [m/s]', dateStorage );
    wind_speed_high = new Draw('wind_speed_high', 'green', canvas1, 'right', canvas1_pointer, 'wind_speed_avg' , 'wind_speed_high [m/s]', dateStorage);
    //
    bar_min         = new Draw('bar_min'        , 'white', canvas2, 'left' , canvas2_pointer, 'bar_max'        , 'bar_min [hPa]', dateStorage );
    bar_max         = new Draw('bar_max'        , 'green', canvas2, 'right', canvas2_pointer, 'bar_min'        , 'bar_max [hPa]', dateStorage);
    //
    huminidy_avg    = new Draw('huminidy_avg'        , 'white', canvas3, 'left' , canvas3_pointer, 'huminidy_min'        , 'huminidy_avg [%]', dateStorage );
    huminidy_min    = new Draw('huminidy_min'        , 'green', canvas3, 'right', canvas3_pointer, 'huminidy_avg'        , 'huminidy_min [%]', dateStorage);
   //
   rain_rate_max    = new Draw('rain_rate_max'        , 'white', canvas4, 'left' , canvas4_pointer, 'rain'        , 'rain_rate_max [mm/h]', dateStorage );
   rain             = new Draw('rain'        , 'green', canvas4, 'right', canvas4_pointer, 'rain_rate_max'        , 'rain [mm]', dateStorage);

   
    // show graphs
    temp_low.graph();
    temp_high.graph();
    //
    wind_speed_avg.graph();
    wind_speed_high.graph();
    //
    bar_min.graph();
    bar_max.graph();
    //
    huminidy_avg.graph();
    huminidy_min.graph();
    //
    rain_rate_max.graph();
    rain.graph();
}

// Start App

// load data + show graphs
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
    temp_low.resizeCanvas();
    temp_high.resizeCanvas();
    //
    wind_speed_avg.resizeCanvas();
    wind_speed_high.resizeCanvas();
    //
    bar_min.resizeCanvas();
    bar_max.resizeCanvas();
    //
    huminidy_avg.resizeCanvas();
    huminidy_min.resizeCanvas();
});

