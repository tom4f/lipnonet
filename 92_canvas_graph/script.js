let pdoResp = [];

const start = '2000-01-31';
const end =   '2099-12-26';

const graph = document.querySelectorAll('.one-graph');
const graphHeight = 3;

graph.forEach( value => value.style.height = 100 / graphHeight + 'vh' );


const canvas  = document.getElementById('canvas' );
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');

const canvas_pointer  = document.getElementById('canvas_pointer');
const canvas1_pointer = document.getElementById('canvas1_pointer');
const canvas2_pointer = document.getElementById('canvas2_pointer');

const canvasSize = ( can, can_pointer, size ) => {
    const clientWidth  = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    can.width  = clientWidth;
    can.height = clientHeight / size;
    can_pointer.width  = clientWidth;
    can_pointer.height = clientHeight / size;
}

const loadPocasi = () => {
    const xhr = new XMLHttpRequest();
    //xhr.open('POST', `https://www.frymburk.com/rekreace/api/pdo_read_pocasi_by_date.php`, true);
    xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_pocasi_by_date.php`, true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            pdoResp = JSON.parse(xhr.responseText);
            // Instantiate Object
            hladina = new Draw('hladina', 'white', canvas , 'left' , canvas_pointer , null   , 'Hladina Lipna [m n.m]' );
            //
            voda    = new Draw('voda'   , 'white', canvas1, 'left' , canvas1_pointer, null   , 'Teplota vody [\xB0C]');
            vzduch  = new Draw('vzduch' , 'green', canvas1, 'right', canvas1_pointer, 'voda' , 'Teplota vzduchu ráno [\xB0C]');
            //
            odtok   = new Draw('odtok'  , 'white', canvas2, 'left' , canvas2_pointer, null   , 'Odtok [m\xB3/s]');
            pritok  = new Draw('pritok' , 'green', canvas2, 'right', canvas2_pointer, 'odtok', 'Přítok [m\xB3/s]');
            // show graphs
            hladina.graph();
            //
            voda.graph();
            vzduch.graph();
            //
            pritok.graph();
            odtok.graph();

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
canvasSize(canvas , canvas_pointer , graphHeight);
canvasSize(canvas1, canvas1_pointer, graphHeight);
canvasSize(canvas2, canvas2_pointer, graphHeight);
// load data + show graphs
loadPocasi();

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
