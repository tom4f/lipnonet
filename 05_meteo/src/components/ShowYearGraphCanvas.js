import React, { useRef, useEffect } from 'react';
import { apiPath } from './apiPath.js'
import Draw from './Draw';


export const ShowYearGraphCanvas = () => {
    
    const graphHeight = 3;
    let pdoResp = [];
    let isAllDownloaded = false;
    const dateStorage = 'datum';

    const canvasRef  = useRef(null);
    const canvas_pointerRef  = useRef(null);
    const canvas1Ref  = useRef(null);
    const canvas1_pointerRef  = useRef(null);

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
            xhr.open('POST', `${apiPath()}/pdo_read_pocasi_by_date.php`, true);
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

            const hladina     = new Draw(
                [ canvas, canvas_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
                , [ 'pritok' , 'lime' , 'line', 2, 'pritok [m\xB3/s]', 1, [] ]
                , [ 'hladina', 'red', 'line', 2, 'hladina [m n.m.]', 2, [] ]
                , [ 'odtok'  , 'white' , 'line', 2, 'odtok [m\xB3/s]' , 1, [] ]
            ); 
        
            const teplota     = new Draw(
                [ canvas1, canvas1_pointer, dateStorage, pdoResp, isAllDownloaded, loadPocasi ]
                , [ 'voda'  , 'white', 'line', 2, 'voda [\xB0C]'  , 1, [] ]
                , [ 'vzduch', 'lime' , 'line', 2, 'vzduch ráno [\xB0C]', 1, []  ]
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
            }

            allCanvasSize();
            
            hladina.graph();
            teplota.graph();
            

            window.addEventListener('resize', () => {
                // set canvas size
                allCanvasSize();
                // reload graphs
                hladina.resizeCanvas();
                teplota.resizeCanvas();
            });
        }





    useEffect( () => {
       // load data + show graphs
        loadPocasiAsync();
    });

    return (
            <>
                <header id="detail_graphs" className="header">
                    <a href="https://www.frymburk.com/projects/92_canvas_graph/index.html">
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
                </div>
        </>
    )
}