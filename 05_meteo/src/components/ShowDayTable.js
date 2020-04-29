import React, {useState, useEffect, useContext} from 'react';
import { DateContext } from './DateContext';

export const ShowDayTable = () => {

    const { globalDate } = useContext(DateContext);

    // which lines requested from mySQL
    const [ start, setStart ] = useState(0);
    const [ davis, setDavis ] = useState([]);
    useEffect( () => loadDavis(), [ start ] );

    const loadDavis = () => {
        let xhr = new XMLHttpRequest();
        // for live
        //xhr.open('POST', `./api/pdo_read_davis.php`, true);
        // for node.js
        // xhr.open('POST', `http://localhost/lipnonet/rekreace/api/pdo_read_davis.php`, true);
        xhr.open('POST', `https://frymburk.com/rekreace/api/pdo_read_davis.php`, true);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const pdoResp = JSON.parse(xhr.responseText);
                setDavis(pdoResp);
                const [ year, month, day ] = pdoResp[0].date.split('-');
                const clickedDate = new Date( year, month - 1, day );
                globalDate('daily', clickedDate );
            }
        }
        xhr.onerror = () => console.log("** An error occurred during the transaction");
        xhr.send(JSON.stringify({ 'start' : start, 'limit' : 30 }));
    }

    const rgbCss = (r, g, b, value) => { return { background: `rgba(${r}, ${g}, ${b}, ${value})` } };  
    const rgbCssT = (value) => { 
        return value > 0
            ? { background: `rgba(255, 0, 0, ${ value/35})` }
            : { background: `rgba(0, 0, 255, ${-value/25})` }
    };

    const setDay = (e) => {
        const clickedText = e.target.innerText;
        const [ year, month, day ] = clickedText.split('-');
        const clickedDate = new Date( +year, +month - 1, +day );
        globalDate('daily', clickedDate );
        // go to graph location
        window.location.href = '#detail_graphs';
    }

    const printDavis = () => {
        const output = [];
        davis.forEach( (one, index) => {
            output.push( 
                <tr key={index}>
                     <td className="link" onClick={ (e) => setDay(e) }>{one.date}</td> 
                    {/*<td className="link" >{one.date}</td>*/}
        
                    <td style={ rgbCss(0, 255, 0, one.wind3                 /1285 ) }>{one.wind3}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind6                 /850  ) }>{one.wind6}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind9                 /274  ) }>{one.wind9}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind_speed_avg        /10   ) }>{one.wind_speed_avg}</td>
                    <td style={ rgbCss(0, 255, 0, one.wind_speed_high       /50   ) }>{one.wind_speed_high}</td>
                    <td>{one.dir}</td>

                    <td style={ rgbCssT(one.temp_low) } >{one.temp_low}</td>
                    <td style={ rgbCssT(one.temp_mean) }>{one.temp_mean}</td>
                    <td style={ rgbCssT(one.temp_high) }>{one.temp_high}</td>

                    <td style={ rgbCss(255, 0, 255, one.rain                /60  ) }>{one.rain}</td>
                    <td style={ rgbCss(255, 0, 255, one.rain_rate_max       /50  ) }>{one.rain_rate_max}</td>

                    <td style={ rgbCss(255, 127, 0, 1 - (1050 - one.bar_min)/40 ) }>{one.bar_min}</td>
                    <td style={ rgbCss(255, 127, 0, 1 - (1050 - one.bar_avg)/40 ) }>{one.bar_avg}</td>
                    <td style={ rgbCss(255, 127, 0, 1 - (1050 - one.bar_max)/40 ) }>{one.bar_max}</td>

                    <td style={ rgbCss(0, 127, 127, (100 - one.huminidy_min)/150 ) }>{one.huminidy_min}</td>
                    <td style={ rgbCss(0, 127, 127, (100 - one.huminidy_avg)/150 ) }>{one.huminidy_avg}</td>
                    <td style={ rgbCss(0, 127, 127, (100 - one.huminidy_max)/150 ) }>{one.huminidy_max}</td>
                </tr>
            )
        });
        return output;
    }

    return (
        <>  
            <br/>
            <header className="header" >
                Historie : &nbsp; 
                <button onClick={ () => setStart( start <= 2670 ? start + 30 : start ) } > &nbsp; {'<'} &nbsp; </button>
                &nbsp; {start} &nbsp;
                <button onClick={ () => setStart( start >= 30 ? start - 30 : start ) } > &nbsp; {'>'} &nbsp; </button>
                &nbsp; dní
            </header>
                <section className="davisTable">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th colSpan="6">vítr</th>
                                <th colSpan="3">teplota vzduchu</th>
                                <th colSpan="2">srážky</th>
                                <th colSpan="3">tlak vzduchu</th>
                                <th colSpan="3">vlhkost vzduchu</th>
                            </tr>
                            <tr>
                                <th>graf</th>
                                <th>>3<sub>m/s</sub></th>
                                <th>>6<sub>m/s</sub></th>
                                <th>>9<sub>m/s</sub></th>
                                <th>prů</th>
                                <th>max</th>
                                <th>směr</th>
                                <th>min</th>
                                <th>prů</th>
                                <th>max</th>
                                
                                <th>celk</th>
                                <th>int</th>

                                <th>min</th>
                                <th>prů</th>
                                <th>max</th>

                                <th>min</th>
                                <th>prů</th>
                                <th>max</th>
                            </tr>
                            <tr>
                                <th>datum</th>
                                <th>min</th>
                                <th>min</th>
                                <th>min</th>
                                <th>m/s</th>
                                <th>m/s</th>
                                <th>-</th>
                                <th>&deg;C</th>
                                <th>&deg;C</th>
                                <th>&deg;C</th>
                                
                                <th>mm</th>
                                <th>mm/h</th>

                                <th>hPa</th>
                                <th>hPa</th>
                                <th>hPa</th>

                                <th>%</th>
                                <th>%</th>
                                <th>%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {printDavis()}
                        </tbody>
                    </table>
                </section>
        </>
    )
}