let pdoResp = [];
const start = '2015-01-31';
const end =   '2018-03-26';

const canvas  = document.getElementById('canvas');
//const canvas1 = document.getElementById('canvas1');
//const canvas2 = document.getElementById('canvas2');

const canvas_pointer  = document.getElementById('canvas_pointer');
//const canvas1_pointer = document.getElementById('canvas1_pointer');
//const canvas2_pointer = document.getElementById('canvas2_pointer');

const canvasSize = ( canvas ) => {
    const clientWidth  = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    canvas.width  = clientWidth;
    canvas.height = clientHeight / 1;
}

const loadPocasi = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_pocasi_by_date.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            pdoResp = JSON.parse(xhr.responseText);
            // Instantiate Object
            hladina = new Draw('hladina', 'white', canvas);
            //
            //odtok   = new Draw('odtok'  , 'white', canvas1);
            //pritok  = new Draw('pritok' , 'green' , canvas1,  'right');
            //
            //voda    = new Draw('voda'   , 'white'  , canvas2);
            //vzduch  = new Draw('vzduch' , 'green', canvas2, 'right');
            // show graphs
            //voda.graph();
            //odtok.graph();
            //pritok.graph();
            hladina.graph();
            //vzduch.graph();
        } 
    }
    xhr.onerror = () => console.log("** An error occurred during the transaction");
    xhr.send(JSON.stringify(
        { 
            'start'   : start,
            'end'     : end,
            'orderBy' : 'datum',
            'sort'    : 'ASC'
        }
    ));
}

// Start App
// set canvas size
canvasSize(canvas);
//canvasSize(canvas1);
//canvasSize(canvas2);

canvasSize(canvas_pointer);
//canvasSize(canvas1_pointer);
//canvasSize(canvas2_pointer);
// load data + show graphs
loadPocasi();

window.addEventListener('resize', () => {
    // set canvas size
    canvasSize(canvas);
    //canvasSize(canvas1_pointer);
    //canvasSize(canvas2_pointer);
    canvasSize(canvas_pointer);
    //canvasSize(canvas1_pointer);
    //canvasSize(canvas2_pointer);
    // reload graphs
    hladina.resizeCanvas();
    //pritok.resizeCanvas();
    //odtok.resizeCanvas();
    //voda.resizeCanvas();
    //vzduch.resizeCanvas();
});
