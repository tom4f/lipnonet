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
const canvas2 = document.getElementById('canvas2');
// definition of all graph pointers
const canvas_pointer  = document.getElementById('canvas_pointer');
const canvas1_pointer = document.getElementById('canvas1_pointer');
const canvas2_pointer = document.getElementById('canvas2_pointer');

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
        xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_pocasi_by_date.php`, true);
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
    hladina = new Draw('hladina', 'white', canvas , 'left' , canvas_pointer , null   , 'Hladina Lipna [m n.m]', dateStorage );
    //
    voda    = new Draw('voda'   , 'white', canvas1, 'left' , canvas1_pointer, 'vzduch'   , 'Teplota vody [\xB0C]', dateStorage);
    vzduch  = new Draw('vzduch' , 'green', canvas1, 'right', canvas1_pointer, 'voda' , 'Teplota vzduchu ráno [\xB0C]', dateStorage);
    //
    odtok   = new Draw('odtok'  , 'white', canvas2, 'left' , canvas2_pointer, 'pritok'   , 'Odtok [m\xB3/s]', dateStorage);
    pritok  = new Draw('pritok' , 'green', canvas2, 'right', canvas2_pointer, 'odtok', 'Přítok [m\xB3/s]', dateStorage);
    // show graphs
    hladina.graph();
    //
    voda.graph();
    vzduch.graph();
    //
    pritok.graph();
    odtok.graph();
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


window.addEventListener('resize', () => {
    // set canvas size
    canvasSize(canvas , canvas_pointer , graphHeight);
    canvasSize(canvas1, canvas1_pointer, graphHeight);
    canvasSize(canvas2, canvas2_pointer, graphHeight);
    // reload graphs
    hladina.resizeCanvas();
    pritok.resizeCanvas();
    odtok.resizeCanvas();
    voda.resizeCanvas();
    vzduch.resizeCanvas();
});

