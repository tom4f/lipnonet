import React, { useRef, useEffect } from 'react';
import { apiPath } from './apiPath.js'
import Draw from './Draw';


export const ShowDayGraphCanvas = () => {
    
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
    const canvas4Ref  = useRef(null);
    const canvas4_pointerRef  = useRef(null);

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
            //xhr.open('POST', `../../rekreace/api/pdo_read_davis_by_date.php`, true);
            xhr.open('POST', `${apiPath()}/pdo_read_davis_by_date.php`, true);
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

            const canvas4 = canvas4Ref.current;
            const canvas4_pointer = canvas4_pointerRef.current;



            const temp     = new Draw(
                [ canvas, canvas_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
                , [ 'temp_low' , 'lime'  , 'line', 1, 'temp_low [\xB0C]' , 1, []  ]
                , [ 'temp_high', 'yellow', 'line', 1, 'temp_high [\xB0C]', 1, [] ]
                , [ 'temp_mean', 'white' , 'line', 1, 'temp_mean [\xB0C]', 1, []  ]
            ); 
            const wind     = new Draw(
                [ canvas1, canvas1_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
                , [ 'wind_speed_high', 'red'  , 'area', 5, 'wind_speed_high [m/s]', 1, [] ]
                , [ 'wind_speed_avg' , 'white', 'area', 5, 'wind_speed_avg [m/s]' , 1, [] ]
            ); 

            const bar     = new Draw(
                [ canvas2, canvas2_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi]
                , [ 'bar_min', 'green', 'line', 1, 'bar_min [hPa]', 1, [] ]
                , [ 'bar_max', 'red'  , 'line', 1, 'bar_max [hPa]', 1, [] ]
                , [ 'bar_avg', 'white', 'line', 1, 'bar_avg [hPa]', 1, [] ]
            ); 
        
            const huminidy     = new Draw(
                [ canvas3, canvas3_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi]
                , [ 'huminidy_min', 'green' , 'line', 1, 'huminidy_min [%]', 1, [] ]
                , [ 'huminidy_max', 'ping'  , 'line', 1, 'huminidy_max [%]', 1, [] ]
                , [ 'huminidy_avg', 'white' , 'line', 1, 'huminidy_avg [%]', 1, [] ]
            ); 
        
            const rain     = new Draw(
                [ canvas4, canvas4_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi]
                , [ 'rain_rate_max', 'orange', 'area', 5, 'rain_rate_max [mm/h]', 1, [] ]
                , [ 'rain'         , 'white' , 'area', 5, 'rain [mm]'           , 2, [] ]
            ); 


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
                canvasSize(canvas4, canvas4_pointer, graphHeight);
            }

            allCanvasSize();
            
            temp.resizeCanvas();
            wind.resizeCanvas();
            bar.resizeCanvas();
            huminidy.resizeCanvas();
            rain.resizeCanvas();

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





    useEffect( () => {
       // load data + show graphs
        loadPocasiAsync();
    });

    return (
            <>
                <header id="detail_graphs" className="header">
                    <a href="https://www.frymburk.com/projects/92_canvas_graph/index_davis.html">
                        HISTORIE - dynamické grafy - na celou obrazovku &nbsp;
                        <i className="fas fa-expand-arrows-alt"></i>
                    </a>
                </header>
               
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
                        <canvas ref={canvas2Ref} className="canvas"></canvas>
                        <canvas ref={canvas2_pointerRef} className="canvas_pointer"></canvas>
                    </article>
                    <article id="one-graph" className="one-graph">
                        <canvas ref={canvas3Ref} className="canvas"></canvas>
                        <canvas ref={canvas3_pointerRef} className="canvas_pointer"></canvas>
                    </article>
                    <article id="one-graph" className="one-graph">
                        <canvas ref={canvas4Ref} className="canvas"></canvas>
                        <canvas ref={canvas4_pointerRef} className="canvas_pointer"></canvas>
                    </article>
                </div>
        </>
    )
}