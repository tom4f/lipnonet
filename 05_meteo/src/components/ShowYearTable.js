import React, { useState, useEffect, useContext } from 'react';
import { DateContext } from './DateContext';

export const ShowYearTable = () => {

    const { globalDate } = useContext(DateContext);

    const [ orderBy, setOrderBy ] = useState (
        {
            value : 'datum',
            order : 'DESC'
        }
    );
    
    // which lines requested from mySQL
    const [ start,  setStart ]  = useState(0);
    const [ pocasi, setPocasi ] = useState([]);
    useEffect( () => loadPocasi(), [ start, orderBy ]);

    const loadPocasi = () => {
        const xhr = new XMLHttpRequest();
        // for live
        xhr.open('POST', `./api/pdo_read_pocasi.php`, true);
        // for node.js
        // xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_pocasi.php`, true);
        //xhr.open('POST', `https://frymburk.com/rekreace/api/pdo_read_pocasi.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const pdoResp = JSON.parse(xhr.responseText);
                setPocasi(pdoResp);
                const [ year ] = pdoResp[0].datum.split('-');
                const clickedDate = new Date( year );
                globalDate('yearSum', clickedDate );

            } 
        }
        xhr.onerror = () => console.log("** An error occurred during the transaction");
        //xhr.send();
        xhr.send(JSON.stringify(
            { 
                'start' : start,
                'limit' : 30,
                'orderBy' : orderBy.value,
                'sort' : orderBy.order
            }
        ));
    }

    const rgbCss = (r, g, b, value) => { return { background: `rgba(${r}, ${g}, ${b}, ${value})` } };  
    const rgbCssT = (value) => { 
        return value > 0
            ? { background: `rgba(255, 0, 0, ${ value/35})` }
            : { background: `rgba(0, 0, 255, ${-value/25})` }
    };

    const printPocasi = () => {
        const output = [];
        pocasi.forEach( (one, index)  => output.push( 
            <tr key={index}>
                <td>{one.datum}</td>
                <td style={ rgbCss(255, 0, 0, 1 - (725 - one.hladina)       /2 ) }>{one.hladina}</td>
                <td style={ rgbCss(0, 255, 0, one.pritok                    /100 ) }>{one.pritok}</td>
                <td style={ rgbCss(0, 255, 0, one.odtok                     /100 ) }>{one.odtok}</td>
                <td style={ rgbCss(255, 0, 0, one.voda                      /25 ) }>{one.voda}</td>
                <td style={ rgbCssT(one.vzduch) }>{one.vzduch}</td>
                <td>{one.pocasi}</td>
            </tr>
            ) );
        return output;
    }

    const sort = (e) => {
        const clickedName = e.target.name;
        setOrderBy({
            value : clickedName,
            order : orderBy.order === 'DESC' ? 'ASC' : 'DESC'
        })
    }

    return (
        <>
            <br/>
            <header className="header" >
                Historie : &nbsp; 
                <button onClick={ () => setStart( start <= 6900 ? start + 30 : start ) } > &nbsp; {'<'} &nbsp; </button>
                &nbsp; {start} &nbsp;
                <button onClick={ () => setStart( start >= 30 ? start - 30 : start ) } > &nbsp; {'>'} &nbsp; </button>
                &nbsp; dní
            </header>
                <section className="davisTable">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th colSpan="3">vodní nádrž Lipno [00:00 hod]</th>
                                <th colSpan="3">[7:00 hod]</th>
                            </tr>
                            <tr>
                                <th><button name="datum" onClick={ (e) => sort(e) } >datum</button></th>
                                <th><button name="hladina" onClick={ (e) => sort(e) } >hladina</button></th>
                                <th><button name="pritok" onClick={ (e) => sort(e) } >přítok</button></th>
                                <th><button name="odtok" onClick={ (e) => sort(e) } >odtok</button></th>
                                <th><button name="voda" onClick={ (e) => sort(e) } >voda</button></th>
                                <th><button name="vzduch" onClick={ (e) => sort(e) } >vzduch</button></th>
                                <th>komentář</th>
                            </tr>
                            <tr>
                                <th></th>
                                <th>m n.m.</th>
                                <th>m<sup>3</sup>/s</th>
                                <th>m<sup>3</sup>/s</th>
                                <th>&deg;C</th>
                                <th>&deg;C</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {printPocasi()}
                        </tbody>
                    </table>
                </section>
        </>
    )
}