import React, { useRef, useEffect } from 'react';
import { apiPath } from './apiPath.js'
import Draw from './Draw';


export const ShowOldStationGraphCanvas = () => {
    
    const graphHeight = 3;
    let pdoResp = [];
    let isAllDownloaded = false;
    const dateStorage = 'date';

    const canvasRef  = useRef(null);
    const canvas_pointerRef  = useRef(null);
    const canvas1Ref  = useRef(null);
    const canvas1_pointerRef  = useRef(null);
    const canvas2Ref  = useRef(null);
    const canvas2_pointerRef  = useRef(null);
    const canvas3Ref  = useRef(null);
    const canvas3_pointerRef  = useRef(null);

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
            //xhr.open('POST', `../../rekreace/api/pdo_read_davis_by_date.php`, true);
            xhr.open('POST', `${apiPath()}pdo_read_old_station_by_date.php`, true);
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

            const canvas = canvasRef.current;
            const canvas_pointer = canvas_pointerRef.current;

            const canvas1 = canvas1Ref.current;
            const canvas1_pointer = canvas1_pointerRef.current;

            const canvas2 = canvas2Ref.current;
            const canvas2_pointer = canvas2_pointerRef.current;
            
            const canvas3 = canvas3Ref.current;
            const canvas3_pointer = canvas3_pointerRef.current;




            const allCanvasSize = () => {
                const canvasSize = ( can, can_pointer, size ) => {
                    const clientWidth  = document.documentElement.clientWidth;
                    const clientHeight = document.documentElement.clientHeight;
                    can.width  = clientWidth > 724 ? 724 : clientWidth;
                    //can.width  = clientWidth;
                    //can.height = clientHeight / size;
                    can.height = 300;
                    can_pointer.width  = clientWidth;
                    can_pointer.height = clientHeight / size;
                }
            
                canvasSize(canvas , canvas_pointer , graphHeight);
                canvasSize(canvas1, canvas1_pointer, graphHeight);
                canvasSize(canvas2, canvas2_pointer, graphHeight);
                canvasSize(canvas3, canvas3_pointer, graphHeight);            
            }



            allCanvasSize();



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





    useEffect( () => {
       // load data + show graphs
        loadPocasiAsync();
    });

    return (
            <>
                <header id="detail_graphs" className="header">
                    <a href="https://www.frymburk.com/projects/92_canvas_graph/old_station.html">
                        HISTORIE - dynamické grafy - na celou obrazovku &nbsp;
                        <i className="fas fa-expand-arrows-alt"></i>
                    </a>
                </header>
                <div>
                    Původní podomácku vyrobená meteostanice.
                    <br />
                    Sběr dat v roce 2001 - 2012 v čase 7:00 - 18:00 hod.
                </div>
                <div id="all-graphs">
                    <article id="one-graph" className="one-graph">
                        <canvas ref={canvasRef} className="canvas" />
                        <canvas ref={canvas_pointerRef} className="canvas_pointer" />
                    </article>
                    <article id="one-graph" className="one-graph">
                        <canvas ref={canvas1Ref} className="canvas" />
                        <canvas ref={canvas1_pointerRef} className="canvas_pointer" />
                    </article>
                    <article id="one-graph" className="one-graph">
                        <canvas ref={canvas2Ref} className="canvas" />
                        <canvas ref={canvas2_pointerRef} className="canvas_pointer" />
                    </article>
                    <article id="one-graph" className="one-graph">
                        <canvas ref={canvas3Ref} className="canvas" />
                        <canvas ref={canvas3_pointerRef} className="canvas_pointer" />
                    </article>
                </div>
        </>
    )
}